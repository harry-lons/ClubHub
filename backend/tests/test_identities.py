import pytest

from src.database import DB


def test_get_all_clubs(client):
    """Test GET '/clubs' endpoint"""
    test_club_1 = DB.db.get_org_from_email("cats@example.com")

    response = client.get("/clubs")

    assert response.status_code == 200, response.status_code
    resp_data = response.json()

    assert len(resp_data["clubs"]) == 1  # number of clubs we have in test data
    item1 = resp_data["clubs"][0]
    assert item1["id"] == test_club_1.id


def test_get_club(client):
    """Test the GET /club with id argument"""
    test_club_1 = DB.db.get_org_from_email("cats@example.com")

    response = client.get(f"/club", params={"club_id": test_club_1.id})

    assert response.status_code == 200, response.status_code
    resp_data = response.json()

    assert resp_data, resp_data
    assert resp_data["id"] == test_club_1.id
    assert resp_data["contact_email"] == test_club_1.email
