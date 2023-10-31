from flask import Response, request, render_template
from models import app, env, instantiate_db_connection
import json
from service import *
from werkzeug.exceptions import HTTPException


@app.errorhandler(500)
def handle_exception(e):
    print()
    print('500 error exception', e)
    print()
    if isinstance(e, HTTPException):
        return e

    res = {'code': 500,
           'errorType': 'Internal Server Error',
           'errorMessage': "Something went really wrong!"}
    if env == "debug":
        res['errorMessage'] = e.message if hasattr(e, 'message') else f'{e}'
    return Response(status=500, response=json.dumps(res))


@app.route("/")
def serve():
    return render_template("index.html")


@app.errorhandler(404)
def not_found(e):
    print('requested url:', request.path, "error:", e)
    return render_template("index.html")


@app.route("/start_up")
def start_up():
    instantiate_db_connection()
    return Response(status=200)


@app.route("/user/<string:user_id>", methods=["GET"])
def get_user(user_id: str):
    requested_user = UserService().get_user(user_id=user_id)
    if requested_user:
        user_dto = UserDTO(user_domain=requested_user)
        return Response(status=200, response=json.dumps(user_dto.serialize()))
    else:
        return Response(status=204)


@app.route("/user", methods=["POST"])
def post_user():
    user_data = json.loads(request.data)
    user_dto = UserDTO(user_json=user_data)
    UserService().create_user(user_dto=user_dto)
    return Response(status=200)


@app.route("/authenticate/user")
def authenticate_user():
    user_id = request.headers.get("user-id")
    print('user_id', user_id)
    password = request.headers.get("password")
    print('password', password)

    user_auth_status = UserService().authenticate_user(
        user_id=user_id, password=password)
    if user_auth_status:
        user_dto = UserDTO(user_domain=user_auth_status)
        return Response(status=200, response=json.dumps(user_dto.serialize()))
    else:
        return Response(status=204)


@app.route("/weight_history", methods=["GET", "POST", "PUT"])
def weight_history():
    if request.method == "GET":

        # query parameter
        user_id = request.args.get("user_id")
        user_weight_history_domains = WeightHistoryService(
        ).get_user_weight_history(user_id=user_id)
        user_weight_history_DTOs = [WeightHistoryDTO(
            weight_history_domain=x)for x in user_weight_history_domains]
        # must turn objects into dictionaries for them to be serializable for JSONEncoder
        serialized_user_weight_history = [
            x.serialize() for x in user_weight_history_DTOs]
        return Response(status=200, response=json.dumps(serialized_user_weight_history))
    elif request.method == "POST":
        weight_history_json = json.loads(request.data)
        new_weight_history_dto = WeightHistoryDTO(
            weight_history_json=weight_history_json)
        WeightHistoryService().create_weight_history(
            weight_history_dto=new_weight_history_dto)
        return Response(status=200)
    elif request.method == "PUT":
        updated_weight_history_json = json.loads(request.data)
        updated_weight_history_dto = WeightHistoryDTO(
            weight_history_json=updated_weight_history_json)
        WeightHistoryService().update_weight_history(
            weight_history_dto=updated_weight_history_dto)
        return Response(status=200)


@app.route("/weight_history/<string:weight_history_id>", methods=["DELETE"])
def delete_weight_history(weight_history_id):
    WeightHistoryService().delete_weight_history(
        weight_history_id=weight_history_id)
    return Response(status=200)


if env == "debug":
    debug = True
else:
    debug = False

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=4000, debug=debug)
