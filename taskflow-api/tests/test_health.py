def test_health(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"service": "taskflow-api", "status": "ok"}
