from flask import Flask, render_template
from flask_restful import Api, Resource, reqparse
import json

app = Flask(__name__)
api = Api(app)
parser = reqparse.RequestParser()
""""
STUDENTS = {
  '1': {'name': 'Mark', 'age': 23, 'spec': 'math'},
  '2': {'name': 'Jane', 'age': 20, 'spec': 'biology'},
  '3': {'name': 'Peter', 'age': 21, 'spec': 'history'},
  '4': {'name': 'Kate', 'age': 22, 'spec': 'science'},
}

class StudentList(Resource):
    def get(self):
        return STUDENTS
    def post(self):
        parser.add_argument("name")
        parser.add_argument("age")
        parser.add_argument("spec")
        args = parser.parse_args()
        student_id = int(max(STUDENTS.keys())) + 1
        student_id = '%i' % student_id
        STUDENTS[student_id] = {
            "name": args["name"],
            "age": args["age"],
            "spec": args["spec"],
        }
        return STUDENTS[student_id], 201

api.add_resource(StudentList, '/students/')

"""


#@app.route('/login',methods = ['POST', 'GET'])

class Login(Resource):
    def get(self):
        return render_template('login.html')

    def post(self):
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


api.add_resource(Login, '/login/')


@app.route('/')
def hello_world():
    return render_template('login.html')


if __name__ == '__main__':
    app.run(debug=True)
