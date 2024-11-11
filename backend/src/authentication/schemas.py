from pydantic import BaseModel

from ..identities.schemas import User


class BearerToken(BaseModel):
    access_token: str
    token_type: str


## TODO: merge the UserLogin and UserSignup to one class
class UserLogin(User):
    # id: int
    # username: str
    # first_name: str
    # last_name: str
    hashed_password: str

    def to_user(self) -> User:
        # Returns with everything but hashed_password
        user_dict = self.model_dump()
        if isinstance(user_dict.get("hashed_password"), str):
            del user_dict["hashed_password"]
        else:
            raise ValueError("UserLogin object does not contain a password")
        return User(**user_dict)


"""
creating a class to handle user sign ins including the following
member variables:
- first_name: user's first name
- last_name: user's last name
- username: profile username
- password: password
"""


class UserSignup(BaseModel):
    first_name: str
    last_name: str
    username: str
    password: str
