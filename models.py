from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import os
from sqlalchemy.schema import DropTable
from sqlalchemy.ext.compiler import compiles
from werkzeug.security import generate_password_hash
from typing import cast, TYPE_CHECKING, Any, Optional
from sqlalchemy.dialects.postgresql import UUID

if TYPE_CHECKING:
    from domain import UserDomain, WeightHistoryDomain


app = Flask(__name__)
username = os.environ.get("USER", "postgres")
password = os.environ.get("PASSWORD", "Iqopaogh23!")
connection_string_beginning = "postgresql://"
connection_string_end = "@localhost:5432/myweightpaldb"
connection_string = connection_string_beginning + \
    username + ":" + password + connection_string_end

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get(
    "DB_STRING", connection_string)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

env = ""
if os.environ.get("DB_STRING") == None:
    env = "debug"
    host_url = "http://localhost:3000"
elif os.environ.get("DEPLOYMENT_ENV") == "test":
    host_url = "https://test.myweightpal.dev"
    env = "production_debug"
elif os.environ.get("DEPLOYMENT_ENV") == "production":
    host_url = "https://myweightpal.dev"
    env = "production"

if env == "debug":
    from flask_cors import CORS
    CORS(app)

db = SQLAlchemy(app)

# Cast SQLAlchemy dynamic type to static type
BaseModel = cast(Any, db.Model)


class UserModel(BaseModel):
 # User is a reserved word in Postgres
    __tablename__ = "end_user"
    id = db.Column(db.String(80), primary_key=True,
                   unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    first_name = db.Column(db.String(80), nullable=False)
    last_name = db.Column(db.String(80), nullable=False)
    starting_weight = db.Column(db.Float(), nullable=False)
    account_creation_datetime = db.Column(db.DateTime(), nullable=False)
    active = db.Column(db.Boolean(), default=True, nullable=False)

    def __init__(self, user_domain: 'UserDomain'):
        self.id = user_domain.id
        self.password = generate_password_hash(user_domain.password)
        self.first_name = user_domain.first_name
        self.last_name = user_domain.last_name
        self.starting_weight = user_domain.starting_weight
        self.account_creation_datetime = user_domain.account_creation_datetime
        self.active = user_domain.active


class WeightHistoryModel(BaseModel):
    __tablename__ = "weight_history"
    id = db.Column(UUID(as_uuid=True), primary_key=True,
                   unique=True, nullable=False)
    user_id = db.Column(db.String(80), db.ForeignKey(
        "end_user.id"), nullable=False)
    weight = db.Column(db.Float(), nullable=False)
    date = db.Column(db.Date(), nullable=False)
    notes = db.Column(db.String(500), nullable=False)

    def __init__(self, weight_history_domain: 'WeightHistoryDomain'):
        self.id = weight_history_domain.id
        self.user_id = weight_history_domain.user_id
        self.weight = weight_history_domain.weight
        self.date = weight_history_domain.date
        self.notes = weight_history_domain.notes


def instantiate_db_connection():
    db.drop_all()
    db.create_all()
