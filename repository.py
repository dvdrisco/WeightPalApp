from sqlalchemy.orm import scoped_session
from typing import Optional
from models import UserModel, WeightHistoryModel
from domain import UserDomain, WeightHistoryDomain
import calendar
from random import randint
from uuid import uuid4, UUID
from dto import WeightHistoryDTO
import datetime
from werkzeug.security import check_password_hash


class UserRepository(object):
    def get_user(self, user_id: str, session: scoped_session) -> Optional[UserModel]:
        requested_user = session.get(UserModel, user_id)
        if requested_user:
            return requested_user
        else:
            return False

    def create_user(self, user_domain: UserDomain, session: scoped_session):
        new_user_model = UserModel(user_domain=user_domain)
        session.add(new_user_model)

    def authenticate_user(self, user_id: str, password: str, session: scoped_session) -> Optional[UserModel]:
        user_with_matching_id: Optional[UserModel] = session.query(
            UserModel).filter(UserModel.id == user_id).first()
        if user_with_matching_id and check_password_hash(user_with_matching_id.password, password):
            return user_with_matching_id
        else:
            return False


class WeightHistoryRepository(object):
    def get_user_weight_history(self, user_id: str, session: scoped_session) -> WeightHistoryModel:
        user_weight_history = session.query(WeightHistoryModel).filter(
            WeightHistoryModel.user_id == user_id).all()
        return user_weight_history

    def create_weight_history(self, weight_history_domain: WeightHistoryDomain, session: scoped_session):
        new_weight_history_model = WeightHistoryModel(
            weight_history_domain=weight_history_domain)
        session.add(new_weight_history_model)

    def update_weight_history(self, weight_history_domain: WeightHistoryDomain, session: scoped_session):
        weight_history_model_to_update: WeightHistoryModel = session.get(
            WeightHistoryModel, weight_history_domain.id)
        weight_history_model_to_update.weight = weight_history_domain.weight
        weight_history_model_to_update.notes = weight_history_domain.notes

    def delete_weight_history(self, weight_history_id: UUID, session: scoped_session):
        weight_history_to_delete: WeightHistoryModel = session.get(
            WeightHistoryModel, weight_history_id)
        session.delete(weight_history_to_delete)
