from ..db_store.models import UserAccounts
from .schemas import User


def useracc_to_user(user_acc: UserAccounts) -> User:
    """Converst a UserAccounts object (from the database) to a User object (API response)"""
    user = User(
        id=user_acc.id,
        username=user_acc.email,
        first_name=user_acc.first_name,
        last_name=user_acc.last_name,
    )
    return user
