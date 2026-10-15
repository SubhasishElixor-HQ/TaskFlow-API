def register_and_token(client, email="user@example.com"):
    client.post("/api/v1/auth/register", json={"email": email, "password": "very-long-test-password"})
    response = client.post("/api/v1/auth/login", json={"email": email, "password": "very-long-test-password"})
    return response.json()["access_token"]

def test_task_crud_and_auth(client):
    token = register_and_token(client)
    headers = {"Authorization": f"Bearer {token}"}
    created = client.post("/api/v1/tasks", headers=headers, json={"title": "Learn FastAPI", "description": "Build a secure API"})
    assert created.status_code == 201
    task = created.json()
    assert task["status"] == "pending"
    task_id = task["id"]
    listed = client.get("/api/v1/tasks", headers=headers)
    assert listed.status_code == 200
    assert len(listed.json()) == 1
    updated = client.patch(f"/api/v1/tasks/{task_id}", headers=headers, json={"status": "completed"})
    assert updated.status_code == 200
    assert updated.json()["status"] == "completed"
    assert client.delete(f"/api/v1/tasks/{task_id}", headers=headers).status_code == 204
    assert client.get(f"/api/v1/tasks/{task_id}", headers=headers).status_code == 404

def test_task_endpoints_require_auth(client):
    assert client.get("/api/v1/tasks").status_code == 401
    assert client.post("/api/v1/tasks", json={"title": "No auth"}).status_code == 401

def test_users_cannot_access_other_users_tasks(client):
    token_a = register_and_token(client, "a@example.com")
    token_b = register_and_token(client, "b@example.com")
    headers_a = {"Authorization": f"Bearer {token_a}"}
    headers_b = {"Authorization": f"Bearer {token_b}"}
    created = client.post("/api/v1/tasks", headers=headers_a, json={"title": "Private task"})
    task_id = created.json()["id"]
    assert client.get(f"/api/v1/tasks/{task_id}", headers=headers_b).status_code == 404
    assert client.patch(f"/api/v1/tasks/{task_id}", headers=headers_b, json={"title": "stolen"}).status_code == 404
    assert client.delete(f"/api/v1/tasks/{task_id}", headers=headers_b).status_code == 404
