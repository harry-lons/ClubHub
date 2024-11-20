import pytest

from .utils import RESOURCES_DIR, user_auth_header


def test_upload_profile_picture(client, user_auth_header):
    """Upload a profile picture"""

    with open(RESOURCES_DIR / "pink.png", "rb") as pink_test_img:
        files = {"file": (pink_test_img.name, pink_test_img)}
        response = client.post(
            "/myself/upload_profile_picture", headers=user_auth_header, files=files
        )
        assert response.status_code == 200
        assert response.json()["key"]


def test_download_profile_picture(client, user_auth_header):
    """Download the previously uploaded profile picture in `test_upload_image` and verify
    its contents"""

    # ! This only works right now because we do not reset the object storage database between tests
    # As it relies on the previous function
    # I think this will always execute after the function it depends on, as it is later in the file

    with open(RESOURCES_DIR / "pink.png", "rb") as pink_test_img:
        response = client.get("/myself/profile_picture", headers=user_auth_header)
        assert response.status_code == 200
        assert response.headers["Content-Type"] == "image/png"

        response_data = response.content
        pink_file_data = pink_test_img.read()
        assert response_data == pink_file_data
