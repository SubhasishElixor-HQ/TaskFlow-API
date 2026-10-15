def test_register_and_login(client):
    response = client.post("/api/v1/auth/register", json={"email": "user@example.com", "password": "very-long-test-password"})
    assert response.status_code == 201
    body = response.json()
    assert body["email"] == "user@example.com"
    assert "hashed_password" not in body
    login = client.post("/api/v1/auth/login", json={"email": "user@example.com", "password": "very-long-test-password"})
    assert login.status_code == 200
    assert login.json()["token_type"] == "bearer"
    assert login.json()["access_token"]

def test_duplicate_registration(client):
    payload = {"email": "dupe@example.com", "password": "very-long-test-password"}
    assert client.post("/api/v1/auth/register", json=payload).status_code == 201
    assert client.post("/api/v1/auth/register", json=payload).status_code == 409

def test_invalid_login(client):
    response = client.post("/api/v1/auth/login", json={"email": "missing@example.com", "password": "very-long-test-password"})
    assert response.status_code == 401
