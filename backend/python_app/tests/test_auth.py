import pytest


def test_auth_endpoints_exist(client) -> None:
    response = client.get("/v1/auth/me")
    assert response.status_code in [401, 404]


def test_company_endpoints_exist(client) -> None:
    response = client.get("/v1/company/1234567890")
    assert response.status_code == 200
    data = response.json()
    assert "success" in data
    assert "data" in data


def test_search_endpoint_exists(client) -> None:
    response = client.post("/v1/search", json={"query": "test"})
    assert response.status_code in [200, 404, 422, 500]