from flask import Flask, render_template, redirect, url_for, request, session
from flask_restful import Api, Resource, reqparse
import json

app = Flask(__name__)
app.secret_key = 'random string'
api = Api(app)
parser = reqparse.RequestParser()

@app.route('/login/', methods = ['POST', 'GET'])
def login():
   if request.method == 'POST':
       parser.add_argument("username")
       parser.add_argument("password")
       args = parser.parse_args()
       with open('json/file.json', 'r') as myfile:
           data = myfile.read()
       # parse file
       obj = json.loads(data)
       for i in obj:
           if obj[i]['username'] == args["username"]:
               if obj[i]['password'] == args["password"]:
                   session['username'] = args["username"]
                   status = {"status": "success"}
                   return status
               else:
                   status = {"status": "fail"}
                   return status
       status = {"status": "fail"}
       return status
   else:
      return render_template('login.html')


@app.route('/', methods = ['POST', 'GET'])
def start():
    if request.method == 'POST':
        with open('json/data1.json', 'r') as myfile:
            data = myfile.read()
            obj = json.loads(data)
            return obj
    else:
        return render_template('charts.html')


@app.route('/test/', methods = ['POST', 'GET'])
def start_r():
    if request.method == 'POST':
        with open('json/data1.json', 'r') as myfile:
            data = myfile.read()
            obj = json.loads(data)
            return obj
    else:
        return render_template('main.html')


if __name__ == '__main__':
    app.run()
