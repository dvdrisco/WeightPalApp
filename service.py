from typing import Any, Optional
from domain import *
from repository import *
from dto import *
from models import connection_string, host_url
from sqlalchemy.orm import scoped_session
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from contextlib import contextmanager
import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

# an Engine, which the Session will use for connection resources
db_engine = create_engine(
    os.environ.get("DB_STRING", connection_string), pool_size=100, max_overflow=10)

# create a configured "Session" class
session_factory = sessionmaker(bind=db_engine)

# create a Session
Session = scoped_session(session_factory)


@contextmanager
def session_scope():
    session: scoped_session = Session()
    try:
        yield session
        session.commit()
    except Exception as e:
        session.rollback()
        raise e
    finally:
        session.close()

    # now all calls to Session() will create a thread-local session


class UserService(object):
    def get_user(self, user_id: str) -> Optional[UserDomain]:
        with session_scope() as session:
            user_model = UserRepository().get_user(user_id=user_id, session=session)
            if user_model:
                user_domain = UserDomain(user_model=user_model)
                return user_domain
            else:
                return False

    def create_user(self, user_dto: UserDTO):
        with session_scope() as session:
            UserRepository().create_user(user_domain=UserDomain(
                user_dto=user_dto), session=session)

    def authenticate_user(self, user_id: str, password: str) -> Optional[UserDomain]:
        with session_scope() as session:
            user_auth_status = UserRepository().authenticate_user(
                user_id=user_id, password=password, session=session)
            if user_auth_status:
                user_domain = UserDomain(user_model=user_auth_status)
                return user_domain
            else:
                return False


class WeightHistoryService(object):
    def get_user_weight_history(self, user_id: str) -> list[WeightHistoryDomain]:
        with session_scope() as session:
            user_weight_history = [WeightHistoryDomain(weight_history_model=x)for x in WeightHistoryRepository(
            ).get_user_weight_history(user_id=user_id, session=session)]
            return user_weight_history

    def create_weight_history(self, weight_history_dto: WeightHistoryDTO):
        with session_scope() as session:
            WeightHistoryRepository().create_weight_history(
                weight_history_domain=WeightHistoryDomain(weight_history_dto=weight_history_dto), session=session)

    def update_weight_history(self, weight_history_dto: WeightHistoryDTO):
        with session_scope() as session:
            WeightHistoryRepository().update_weight_history(
                weight_history_domain=WeightHistoryDomain(weight_history_dto=weight_history_dto), session=session)

    def delete_weight_history(self, weight_history_id: UUID):
        with session_scope() as session:
            WeightHistoryRepository().delete_weight_history(
                weight_history_id=weight_history_id, session=session)
