from flask import Flask, render_template, redirect, url_for, request, session
from flask_restful import Api, Resource, reqparse
import json

app = Flask(__name__)
app.secret_key = 'random string'
api = Api(app)
parser = reqparse.RequestParser()

"""
@app.route('/login/', methods = ['POST', 'GET'])
def login():
   if request.method == 'POST':
       parser.add_argument("username")
       parser.add_argument("password")
       args = parser.parse_args()
       status = {}
       with open('json/file.json', 'r') as myfile:
           data = myfile.read()
       # parse file
       obj = json.loads(data)
       for i in obj:
           if obj[i]['username'] == args["username"]:
               if obj[i]['password'] == args["password"]:
                   status = {"status": "success"}
                   return status
               else:
                   status = {"status": "fail"}
                   return status
       status = {"status": "fail"}
       return status
   else:
      return render_template('login.html')

"""

@app.route('/login/', methods = ['POST', 'GET'])
def login():
   if request.method == 'POST':
       parser.add_argument("username")
       parser.add_argument("password")
       args = parser.parse_args()
       status = {}
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


@app.route('/')
def start():
    if 'username' in session:
        username = session['username']
        return 'Logged in as ' + username + '<br>' + \
               "<b><a href = '/logout'>click here to log out</a></b>"
    return "You are not logged in <br><a href = '/login'></b>" + \
       "click here to log in</b></a>"
    return redirect(url_for('login'))


if __name__ == '__main__':
    app.run()
