import pytest

from src.database import DB
from src.db_store.models import Events
from src.events.constants import fake_event_1, fake_event_2

from .utils import club_auth_header

# TODO:
# - club login fixutre
# - no database update persistence for each test
# - write the tests


def test_get_event(client):
    """"""
    resp = client.get("/event/1")

    assert resp.status_code == 200
    event_data = resp.json()
    assert len(event_data) > 0

    # Todo be able to check club-id
    assert event_data["id"] == 1
    assert event_data["title"] == fake_event_1.title
    assert event_data["location"] == fake_event_1.location
    assert event_data["capacity"] == 101
    assert len(event_data["type"]) == len(fake_event_1.type)


def test_update_event(client, club_auth_header):
    """"""

    # email from db_store/main example club
    parent_club = DB.db.get_org_from_email("cats@example.com")

    updated_event_data = fake_event_1.model_copy()
    updated_event_data.title = "Not Lunch"
    updated_event_data.club_id = parent_club.id

    print(updated_event_data.model_dump_json())

    resp = client.patch(
        "/club/event",
        headers=club_auth_header,
        data=updated_event_data.model_dump_json(),
    )

    assert resp.status_code == 200, resp.text

    event = DB.db._get_by(Events, id=1)

    assert event.title == "Not Lunch"
    assert event.location == fake_event_1.location
    assert event.capacity == 101
    assert len(event.tags) == len(fake_event_1.type)


def test_update_event_no_perms(client):
    """"""
    updated_event_data = fake_event_1.model_copy()
    updated_event_data.title = "Not Lunch"

    resp = client.patch(
        "/club/event",
        headers={"Authorization": "TOTALLY  BAD HEADER"},
        data=updated_event_data.model_dump_json(),
    )

    assert resp.status_code == 401


def test_delete_event(client, club_auth_header):
    """"""
    resp = client.delete(
        "/club/event/1",  # Autoincremented id of test event in db_store/main
        headers=club_auth_header,
    )

    assert resp.status_code == 200, resp.text

    # Check that the event no longer exists
    with pytest.raises(ValueError) as exec:
        DB.db._get_by(Events, id=1)
        assert "No record found matching the filters" in str(exec.value)
    with pytest.raises(ValueError) as exec:
        DB.db._get_by(Events, title="Lunch")
        assert "No record found matching the filters" in str(exec.value)


def test_create_event(client, club_auth_header):
    """"""
    parent_club = DB.db.get_org_from_email("cats@example.com")
    new_event = fake_event_2.model_copy()

    resp = client.post(
        "/club/event", headers=club_auth_header, data=new_event.model_dump_json()
    )

    assert resp.status_code == 200, resp.text

    event = DB.db._get_by(Events, title="Cat Party", location="Cat Cafe")
    assert event.id == 2
    assert event.club_id == parent_club.id
    assert event.title == fake_event_2.title
    assert event.location == fake_event_2.location
    assert event.capacity == fake_event_2.capacity
    assert len(event.tags) == len(fake_event_1.type)
