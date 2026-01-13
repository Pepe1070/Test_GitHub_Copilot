import pytest
from fastapi.testclient import TestClient
from src.app import app

client = TestClient(app)

def test_root_redirect():
    response = client.get("/")
    assert response.status_code == 200
    assert "Mergington High School" in response.text

def test_get_activities():
    response = client.get("/activities")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, dict)
    assert "Basketball" in data
    assert "participants" in data["Basketball"]

def test_signup_success():
    response = client.post("/activities/Basketball/signup", json={"email": "test@mergington.edu"})
    assert response.status_code == 200
    data = response.json()
    assert "Signed up" in data["message"]

def test_signup_already_signed_up():
    # First signup
    client.post("/activities/Tennis Club/signup", json={"email": "test2@mergington.edu"})
    # Second signup
    response = client.post("/activities/Tennis Club/signup", json={"email": "test2@mergington.edu"})
    assert response.status_code == 400
    data = response.json()
    assert "already signed up" in data["detail"]

def test_signup_invalid_activity():
    response = client.post("/activities/Invalid Activity/signup", json={"email": "test@mergington.edu"})
    assert response.status_code == 404
    data = response.json()
    assert "Activity not found" in data["detail"]

def test_unregister_success():
    # First signup
    client.post("/activities/Drama Club/signup", json={"email": "test3@mergington.edu"})
    # Then unregister
    response = client.post("/activities/Drama Club/unregister", json={"email": "test3@mergington.edu"})
    assert response.status_code == 200
    data = response.json()
    assert "Unregistered" in data["message"]

def test_unregister_not_signed_up():
    response = client.post("/activities/Art Studio/unregister", json={"email": "notsigned@mergington.edu"})
    assert response.status_code == 400
    data = response.json()
    assert "not signed up" in data["detail"]

def test_unregister_invalid_activity():
    response = client.post("/activities/Invalid Activity/unregister", json={"email": "test@mergington.edu"})
    assert response.status_code == 404
    data = response.json()
    assert "Activity not found" in data["detail"]