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
                   session['logged_in'] = True
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
def dashboard():
    if request.method == 'POST':
        if len(session) > 0:
            if session['logged_in'] != False:
                time = 60  # how many minuts
                max = 10  # max records form the request (limit of db)
                status='{ \'energy\':[' # inital status
                count=0
                for i in range(int(time/max)): # get record every 10 minuts for energy

                    j = -time + i*max   #starts with -60 min and ends with 0min by now
                    if j < 0:
                        query = "{\"query\":{\"range\":{\"timestamp\":{\"gte\":\"now+1h" + str(j) + "m\"}}}}" #+2h o +1h depends on time zone
                    else:
                        query = "{\"query\":{\"range\":{\"timestamp\":{\"gte\":\"now+1h\"}}}}"

                    res = es.search(index='energy', body=query)
                    for i in range(max): # fill status with energy records
                        count=count +1
                        if count < time : #check number of current record to close energy
                            status = status + str( res['hits']['hits'][i]['_source']) + ', '
                        else:
                            status = status + str(res['hits']['hits'][i]['_source']) + '],'
                status = status + ' \'traffic\':['
                count = 0
                for i in range(int(time/max)):  # get record every 10 minuts for energy

                    j = -time + i * max #starts with -60 min and ends with 0min by now
                    if j < 0:
                        query = "{\"query\":{\"range\":{\"timestamp\":{\"gte\":\"now+1h" + str(j) + "m\"}}}}"
                    else:
                        query = "{\"query\":{\"range\":{\"timestamp\":{\"gte\":\"now+1h\"}}}}"

                    res = es.search(index='traffic', body=query)
                    for i in range(max):    #fill status with energy records
                        count = count + 1
                        if count < time:    #check number of current record to close traffic
                            status = status + str(res['hits']['hits'][i]['_source']) + ', '
                        else:
                            status = status + str(res['hits']['hits'][i]['_source']) + ']}'

                return json.loads(status.replace("'", "\""))
            else:
                status = {"status": "unauthorized"}
                return status,401
        else:
            status = {"status": "unauthorized"}
            return status, 401
    else:                   #GET METHOD
        if len(session) > 0:
            if session['logged_in']==True:
                return render_template('main.html')
            else:
                return render_template('login.html')
        else:
            return render_template('login.html')


@app.route('/configuration', methods = ['POST', 'GET'])
def configuration():
    if request.method == 'POST':
        if len(session) > 0:
            if session['logged_in'] != False:
                res = es.search(index='configuration')
                status = str(res['hits']['hits'][0]['_source'])
                return json.loads(status.replace("'", "\""))
            else:
                status = {"status": "unauthorized"}
                return status, 401
        else:
            status = {"status": "unauthorized"}
            return status, 401
    else:  # GET METHOD
        if len(session) > 0:
            if session['logged_in'] == True:
                return render_template('configuration.html')
            else:
                return render_template('login.html')
        else:
            return render_template('login.html')


@app.route('/logout', methods = ['POST', 'GET'])
def logout():
    if request.method == 'POST':
        session['logged_in'] = False
        status = {"status": "success"}
        return status


@app.errorhandler(404)
def page_not_found(e):
    return render_template('error.html')

if __name__ == '__main__':
    app.run()
