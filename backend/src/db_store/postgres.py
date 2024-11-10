from typing import Any

from sqlalchemy.orm import Session

from .db_interface import IDatabase


class PostgresDatabase(IDatabase):
    def __init__(self, session: Session):
        self.session = session

    def get(self, model: Any, id: int) -> Any:
        return self.session.query(model).filter(model.id == id).first()

    def create(self, model: Any, data: dict) -> Any:
        instance = model(**data)
        self.session.add(instance)
        self.session.commit()
        return instance

    def update(self, model: Any, id: int, data: dict) -> Any:
        instance = self.get(model, id)
        for key, value in data.items():
            setattr(instance, key, value)
        self.session.commit()
        return instance

    def delete(self, model: Any, id: int) -> None:
        instance = self.get(model, id)
        self.session.delete(instance)
        self.session.commit()
