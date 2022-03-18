import base64
from fileinput import filename
from flask import Flask, json, make_response, request, send_file
from os import listdir
from os.path import isfile, join
from flask_cors import CORS
from ast import literal_eval
import os
from numpy import byte

api = Flask(__name__)
CORS(api)


@api.route("/pdf", methods=["GET"])
def get_pdf():
    databasePath = "./database"
    onlyfiles = [f for f in listdir(databasePath) if isfile(join(databasePath, f))]
    returnList = list()
    for file in onlyfiles:
        returnList.append({"name": file})
    # print(returnList)

    return json.dumps(returnList)


@api.route("/pdf/<name>", methods=["DELETE"])
def delete_pdf(name):
    try:
        os.remove("database/" + name)
        return json.dumps({"success": True}), 200, {"ContentType": "application/json"}
    except Exception as e:
        resp = make_response("Could not save file", 400)
        resp.headers["Error"] = str(e)
        print(str(e))
        return resp


@api.route("/pdf/<name>", methods=["GET"])
def get_pdf_by_name(name):
    try:
        return send_file(
            "database/" + name, as_attachment=True, attachment_filename=name
        )
    except Exception as e:
        resp = make_response("Could not load file", 400)
        resp.headers["Error"] = str(e)
        print(str(e))
        return resp


@api.route("/pdf", methods=["POST"])
def save_pdf():
    content = request.get_json(silent=True)
    content = json.loads(content)
    byteArray = literal_eval(content["base64String"])
    print(content["fileName"])
    try:
        with open("database/" + content["fileName"], "wb") as output:
            output.write(bytearray(byteArray))
        return json.dumps({"success": True}), 200, {"ContentType": "application/json"}
    except Exception as e:
        resp = make_response("Could not save file", 400)
        resp.headers["Error"] = str(e)
        print(str(e))
        return resp


if __name__ == "__main__":
    api.run(debug=True)
