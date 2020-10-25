from flask import Flask, render_template, redirect, url_for, request, session
from flask_restful import Api, Resource, reqparse
import json
from elasticsearch import Elasticsearch

es = Elasticsearch()
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
def start_r():
    if request.method == 'POST':
        status='{ \'energy\':['
        count=0
        for i in range(6):

            j = -60 + i*10
            if j < 0:
                query = "{\"query\":{\"range\":{\"timestamp\":{\"gte\":\"now+1h" + str(j) + "m\"}}}}" #+2 o +1 dipende dal orrario
            else:
                query = "{\"query\":{\"range\":{\"timestamp\":{\"gte\":\"now+1h\"}}}}"

            res = es.search(index='energy', body=query)
            for i in range(10):
                count=count +1
                if count < 60 :
                    status = status + str( res['hits']['hits'][i]['_source']) + ', '
                else:
                    status = status + str(res['hits']['hits'][i]['_source']) + '],'
        status = status + ' \'traffic\':['
        count = 0
        for i in range(6):

            j = -60 + i * 10
            if j < 0:
                query = "{\"query\":{\"range\":{\"timestamp\":{\"gte\":\"now+1h" + str(j) + "m\"}}}}"
            else:
                query = "{\"query\":{\"range\":{\"timestamp\":{\"gte\":\"now+1h\"}}}}"

            res = es.search(index='traffic', body=query)
            for i in range(10):
                count = count + 1
                if count < 60:
                    status = status + str(res['hits']['hits'][i]['_source']) + ', '
                else:
                    status = status + str(res['hits']['hits'][i]['_source']) + ']}'

        return status.replace("'", "\"")
    else:
        return render_template('main.html')


if __name__ == '__main__':
    app.run()
