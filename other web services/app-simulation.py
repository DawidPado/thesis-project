import json
import os
import random

import requests
from flask import Flask, request, flash, redirect, url_for, session
from flask_cors import CORS
from flask_restful import Api, reqparse
from elasticsearch import Elasticsearch
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = './files'
ALLOWED_EXTENSIONS = {'rar', 'zip', 'gz', 'xyz'}

es = Elasticsearch()
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.secret_key = 'B;}}S5Cx@->^^"hQT{T,GJ@YI*><17'
api = Api(app)
parser = reqparse.RequestParser()
CORS(app)


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/data', methods=['POST'])
def upload_data():
    data = request.get_json()
    time=data["simulation"] #time in seconds of simulation
    message = {"number_of_sensors": data["sensors"], "number_of_patterns": data["patterns"]}
    rex = es.index(index='simulation', body=message, id=1)
    return {'status':'success'}


@app.route('/get_data', methods=['POST'])
def get_data():
    search = json.loads("{\
      \"query\": {\
        \"ids\" : {\
          \"values\" : \"1\"\
        }\
      }\
    }")
    rex = es.index(index='simulation', body=search)
    return rex


@app.route('/file', methods=[ 'POST'])
def upload_file():
    if request.method == 'POST':
        # check if the post request has the file part
        file = request.files['file']
        # if user does not select file, browser also
        # submit an empty part without filename
        if file.filename == '':
            return {'status':'no file selected'}
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            return {'status':'success'}
        else:
            return {'status':'not supported format'}


"""@app.route('/', methods=['POST'])
def simulation():
    if request.method == 'POST':
        data = request.get_json()
        payload={'simulation':'unknown'}
        if data["action"]=="start":
            payload = {'simulation':'on'}
        elif data["action"]=="stop":
            payload = {'simulation': 'off'}
        url = "http://localhost:5000/simulation"
        headers = {}
        requests.request("POST", url, headers=headers, data=payload)
        return {'status':'done'}

"""
if __name__ == '__main__':
    app.run(port=5003)

