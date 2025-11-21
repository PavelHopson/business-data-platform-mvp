import pytest


def test_root_endpoint(client) -> None:
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {
        "message": "Company Analysis API",
        "version": "1.0.0"
    }


def test_health_endpoint(client) -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {
        "status": "healthy",
        "version": "1.0.0"
    }


def test_metrics_endpoint(client) -> None:
    response = client.get("/metrics")
    assert response.status_code == 200
    # Проверяем, что возвращаются метрики Prometheus
    assert "http_requests_total" in response.text
    assert "up{job=\"backend-api\"}" in response.text
    assert "HELP" in response.text
