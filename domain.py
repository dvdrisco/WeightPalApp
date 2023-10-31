from typing import Optional, TYPE_CHECKING
from datetime import datetime
from datetime import date
from models import UserModel, WeightHistoryModel
import json
from uuid import UUID
if TYPE_CHECKING:
    from dto import UserDTO, WeightHistoryDTO


class BaseDomain(object):
    def __str__(self):
        return json.dumps(self.__dict__)


class UserDomain(BaseDomain):
    def __init__(self, user_model: Optional[UserModel] = None, user_dto: Optional['UserDTO'] = None):
        if user_model:
            self.id: str = user_model.id
            self.password: str = user_model.password
            self.first_name: str = user_model.first_name
            self.last_name: str = user_model.last_name
            self.starting_weight: float = user_model.starting_weight
            self.account_creation_datetime: datetime = user_model.account_creation_datetime
            self.active: bool = user_model.active
        elif user_dto:
            self.id: str = user_dto.id
            self.password: str = user_dto.password
            self.first_name: str = user_dto.first_name
            self.last_name: str = user_dto.last_name
            self.starting_weight: float = user_dto.starting_weight
            # javascript timestamp is in miliseconds, while pythin is in seconds, so much multiply python timestamp by 1000
            self.account_creation_datetime: datetime = datetime.fromtimestamp(
                int(user_dto.account_creation_datetime))
            self.active: bool = user_dto.active


class WeightHistoryDomain(BaseDomain):
    def __init__(self, weight_history_model: Optional[WeightHistoryModel] = None, weight_history_dto: Optional['WeightHistoryDTO'] = None):
        if weight_history_model:
            self.id: UUID = weight_history_model.id
            self.user_id: str = weight_history_model.user_id
            self.weight: float = weight_history_model.weight
            self.date: date = weight_history_model.date
            self.notes: str = weight_history_model.notes
        elif weight_history_dto:
            self.id: UUID = weight_history_dto.id
            self.user_id: str = weight_history_dto.user_id
            self.weight: float = weight_history_dto.weight
            self.date: date = weight_history_dto.date
            self.notes: str = weight_history_dto.notes
