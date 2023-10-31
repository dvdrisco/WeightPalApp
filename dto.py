from domain import UserDomain, WeightHistoryDomain
from typing import Optional
from uuid import UUID
from datetime import datetime, date, timezone


class BaseDTO(object):
    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            # catch and stringify unserializable data types
            if isinstance(attributes[i], UUID):
                serialized_attributes[attribute_names[i]] = str(attributes[i])
            elif isinstance(attributes[i], datetime):
                serialized_attributes[attribute_names[i]
                                      ] = attributes[i].timestamp()
            elif isinstance(attributes[i], date):
                serialized_attributes[attribute_names[i]
                                      ] = attributes[i].strftime("%s")
            else:
                serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class UserDTO(BaseDTO):
    def __init__(self, user_json: Optional[dict] = None, user_domain: Optional[UserDomain] = None):
        if user_json:
            self.id: str = user_json["id"]
            self.password: str = user_json["password"]
            self.first_name: str = user_json["first_name"]
            self.last_name: str = user_json["last_name"]
            self.starting_weight: float = user_json["starting_weight"]
            self.account_creation_datetime: datetime = user_json["account_creation_datetime"]
            self.active: bool = user_json["active"]
        elif user_domain:
            self.id: str = user_domain.id
            self.first_name: str = user_domain.first_name
            self.last_name: str = user_domain.last_name
            self.starting_weight: float = user_domain.starting_weight
            self.password: str = user_domain.password
            self.account_creation_datetime: datetime = user_domain.account_creation_datetime
            self.active: bool = user_domain.active


class WeightHistoryDTO(BaseDTO):
    def __init__(self, weight_history_json: Optional[dict] = None, weight_history_domain: Optional['WeightHistoryDomain'] = None):
        if weight_history_json:
            print('weight_history_json', weight_history_json)
            self.id: UUID = weight_history_json["id"]
            self.user_id: str = weight_history_json["user_id"]
            self.weight: float = weight_history_json["weight"]
            self.date: date = datetime.fromtimestamp(
                float(weight_history_json["date"]), tz=timezone.utc).date()
            self.notes: str = weight_history_json["notes"]
        elif weight_history_domain:
            self.id: UUID = weight_history_domain.id
            self.user_id: str = weight_history_domain.user_id
            self.weight: float = weight_history_domain.weight
            self.date: date = weight_history_domain.date
            self.notes: str = weight_history_domain.notes
