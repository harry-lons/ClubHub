from pydantic import BaseModel


class BearerToken(BaseModel):
    access_token: str
    token_type: str


class User(BaseModel):
    username: str


class UserInDB(User):
    hashed_password: str

    def to_user(self) -> User:
        return User(username=self.username)
