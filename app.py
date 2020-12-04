import json
import random
from datetime import datetime
import hashlib
from elasticsearch import Elasticsearch
from flask import Flask, render_template, request, session
from flask_cors import CORS
from flask_restful import Api, reqparse

es = Elasticsearch()
app = Flask(__name__)
app.secret_key = 'B;}}S5Cx@->^^"hQT{T,GJ@YI*><17'
api = Api(app)
parser = reqparse.RequestParser()
CORS(app)


@app.route('/login/', methods = ['POST', 'GET'])
def login():
   if request.method == 'POST':
       parser.add_argument("username")
       parser.add_argument("password")
       args = parser.parse_args()
       h = hashlib.md5(args["password"].encode())
       password=h.hexdigest()
       query="{\
  \"query\": {\
    \"bool\": {\
      \"must\": [\
        {\
          \"match\": {\
            \"password\": \"" + password +"\"\
          }\
        },\
        {\
          \"match\": {\
            \"username\": \""+args["username"]+"\"\
          }\
        }\
      ]\
    }\
  }\
}"
       res = es.search(index='users', body=query)
       if res['hits']['hits'] != []:
           if res['hits']['hits'][0]['_source']["username"]==args["username"] and res['hits']['hits'][0]['_source']["password"]==password:
               session['username'] = args["username"]
               session['logged_in'] = True
               status = {"status": "success"}
               return status
           else:
               status = {"status": "fail"}
               return status
       status = {"status": "fail"}
       return status

       #with open('json/file.json', 'r') as myfile:
       #    data = myfile.read()
       #obj = json.loads(data)
       #for i in obj:
       #    if obj[i]['username'] == args["username"]:
       #        if obj[i]['password'] == args["password"]:
       #            session['username'] = args["username"]
       #            session['logged_in'] = True
       #            status = {"status": "success"}
       #            return status
       #        else:
       #            status = {"status": "fail"}
       #            return status

       #status = {"status": "fail"}

       #return status
   else:
      return render_template('login.html')


@app.route('/', methods = ['POST', 'GET'])
def dashboard():
    if request.method == 'POST':
        if len(session) > 0:
            if session['logged_in'] != False:
                start_time="now"
                data = request.get_json()
                query=""
                res=""
                sensor_num=1
                interval=0 # in minutes
                if data != None:  # Setting start time and end time of getting data
      ####################################################################################################################
                    if data["start_time"] and data["end_time"]:
                        start_time=datetime.strptime(data["start_time"], "%Y-%m-%dT%H:%M:%S.000Z")
                        end_time=datetime.strptime(data["end_time"], "%Y-%m-%dT%H:%M:%S.000Z")
                        if (((end_time-start_time).seconds/3600)+((end_time-start_time).days)*24) < 3 :    #3hour
                            interval=1
                        elif (((end_time-start_time).seconds/86400)+((end_time-start_time).days)) < 1 :     #1day
                            interval=10
                        elif(((end_time-start_time).seconds/86400)+((end_time-start_time).days)) < 5:       #5days
                            interval=720
                        else:
                            interval=1440                                                                   #more than 5days
                        message1 = str(start_time.year) + "-" + checkdate(start_time.month) + "-" \
                            + checkdate(start_time.day) + "T" + checkdate(start_time.hour) + ":" + checkdate(start_time.minute) + ":00Z"
                        message2=str(end_time.year) + "-" + checkdate(end_time.month) + "-" \
                            + checkdate(end_time.day) + "T" + checkdate(end_time.hour) + ":" + checkdate(end_time.minute) + ":00Z"

                        query = "{\"query\":{\"range\":{\"timestamp\":{\"gte\":\"" + message1 + "\", \"lte\":\"" + message2 + "\"}}}}"
                        res = es.search(index='energy', body=query, size=10000)
                        if res['hits']['hits'] == []:
                            return {"status": "no data available"}
                        i=1
                        while True:
                            if(not ("S"+str(i) in res['hits']['hits'][0]['_source'])):
                                sensor_num=i-1
                                break
                            i=i+1
                        agg="\"aggs\": {\
                                \"records\": {\
                                    \"date_histogram\": {\
                                        \"field\": \"timestamp\",\
                                        \"interval\": \""+str(interval)+"m\"},\
                                    \"aggs\": {"
                        for j in range(i):
                            if j==0:
                                continue
                            agg=agg+"\"S"+str(j)+"\": {\
                                    \"avg\": {\
                                        \"field\": \"S"+str(j)+"\"\
                                    }}"
                            if j==(i-1):
                                agg = agg+"}}},"
                            else:
                                agg=agg+","
                        query = "{ "+ agg+" \"query\":{\"range\":{\"timestamp\":{\"gte\":\"" + message1 + "\", \"lte\":\"" + message2 + "\"}}}}"
    #######################################################################################################################

                time = 60  # how many minuts

                #traffic and energy violation
                x=random.randint(1,100)
                y=random.randint(1,100)


                status='{\'traffic_violation\':'+str(x)+', \'energy_violation\':'+str(y)+', \'energy\':[' # inital status
                count=0
                if (start_time == "now"):
                    query = "{\"query\":{\"range\":{\"timestamp\":{\"gte\":\""+start_time + str(-time) + "m\"}}}}"
                    res = es.search(index='energy', body=query,size=time)
                    max=len(res['hits']['hits'])  #lenght of records
                    if max == 0: status = status + "],"
                    for i in range(max): # fill status with energy records
                        count=count +1
                        if count < max : #check number of current record to close energy
                            status = status + str( res['hits']['hits'][i]['_source']) + ', '
                        else:
                            status = status + str(res['hits']['hits'][i]['_source']) + '],'
                    status = status + ' \'traffic\':['
                    count = 0
                else:
                    res = es.search(index='energy', body=query, size=1000)
                    max = len(res['aggregations']['records']['buckets'])
                    if max == 0: status = status + "],"
                    for i in range(max): # fill status with energy records
                        count=count +1
                        if count < max : #check number of current record to close energy
                            status = status + str( res['aggregations']['records']['buckets'][i]) + ', '
                        else:
                            status = status + str(res['aggregations']['records']['buckets'][i]) + '],'
                    status = status + ' \'traffic\':['
                    count = 0

                if (start_time == "now"):
                    res = es.search(index='traffic', body=query,size=time)
                    if max == 0: status = status + "]}"
                    for i in range(max):    #fill status with energy records
                        count = count + 1
                        if count < max:    #check number of current record to close traffic
                            status = status + str(res['hits']['hits'][i]['_source']) + ', '
                        else:
                            status = status + str(res['hits']['hits'][i]['_source']) + ']}'

                    return json.loads(status.replace("'", "\""))
                else:
                    res = es.search(index='traffic', body=query, size=1000)
                    if max == 0: status = status + "]}"
                    for i in range(max): # fill status with energy records
                        count=count +1
                        if count < max : #check number of current record to close energy
                            status = status + str( res['aggregations']['records']['buckets'][i]) + ', '
                        else:
                            status = status + str(res['aggregations']['records']['buckets'][i]) + ']}'
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
    search=json.loads("{\
  \"query\": {\
    \"ids\" : {\
      \"values\" : \"1\"\
    }\
  }\
}")
    if request.method == 'POST':
        if len(session) > 0:
            if session['logged_in'] != False:
                data = request.get_json()
                if data != None:
                    if data["type"] == "Energy Forecaster":
                        res = es.search(index='configuration',body=search)
                        status = str(res['hits']['hits'][0]['_source'])
                        status=json.loads(status.replace("'", "\""))
                        message="{\"energy_forecaster\": {\"dataset_path\":"+"\""+str(data["dataset_path"])+"\""\
                                +",\"number_of_neurons\":"+str(data["number_of_neurons"])\
                                +",\"cross_validation_ratio\":"+"\""+str(data["cross_validation_ratio"])+"\""\
                                +",\"model_save_path\":"+"\""+str(data["model_save_path"])+"\""\
                                +",\"number_of_iteration\":"+str(data["number_of_iteration"])+"},"\
                                +"\"data_traffic_forecaster\":"+str(status["data_traffic_forecaster"])+","\
                                +"\"decision_maker\":"+str(status["decision_maker"])+","\
                                +"\"data_pipeline\":"+str(status["data_pipeline"])+"}"
                        es.index(index='configuration',id=1, body=json.loads(message.replace("'", "\"")))
                        return {"status": "success"}
                    elif data["type"] == "Data Traffic Forecaster":
                        res = es.search(index='configuration', body=search)
                        status = str(res['hits']['hits'][0]['_source'])
                        status = json.loads(status.replace("'", "\""))
                        message = "{\"data_traffic_forecaster\": {\"dataset_path\":" + "\"" + str(data["dataset_path"]) + "\"" \
                                  + ",\"number_of_neurons\":" + str(data["number_of_neurons"]) \
                                  + ",\"cross_validation_ratio\":" + "\"" + str(data["cross_validation_ratio"]) + "\"" \
                                  + ",\"model_save_path\":" + "\"" + str(data["model_save_path"]) + "\"" \
                                  + ",\"number_of_iteration\":" + str(data["number_of_iteration"]) + "}," \
                                  + "\"energy_forecaster\":" + str(status["energy_forecaster"]) + "," \
                                  + "\"decision_maker\":" + str(status["decision_maker"]) + "," \
                                  + "\"data_pipeline\":" + str(status["data_pipeline"]) + "}"
                        es.index(index='configuration', id=1, body=json.loads(message.replace("'", "\"")))
                        return {"status": "success"}
                    elif data["type"] == "Decision Maker":
                        res = es.search(index='configuration', body=search)
                        status = str(res['hits']['hits'][0]['_source'])
                        status = json.loads(status.replace("'", "\""))
                        message = "{\"decision_maker\": {\"energy_higher_limit\":" + str(data["energy_higher_limit"]) \
                                  + ",\"energy_lower_limit\":" + str(data["energy_lower_limit"]) \
                                  + ",\"traffic_higher_limit\":" + str(data["traffic_higher_limit"]) \
                                  + ",\"traffic_lower_limit\":" + str(data["traffic_lower_limit"]) \
                                  + ",\"reward_list\":" + "\"" + str(data["reward_list"]) + "\"}," \
                                  + "\"data_traffic_forecaster\":" + str(status["data_traffic_forecaster"]) + "," \
                                  + "\"energy_forecaster\":" + str(status["energy_forecaster"]) + "," \
                                  + "\"data_pipeline\":" + str(status["data_pipeline"]) + "}"
                        es.index(index='configuration', id=1, body=json.loads(message.replace("'", "\"")))
                        return {"status": "success"}
                    elif data["type"] == "Data Pipeline":
                        res = es.search(index='configuration', body=search)
                        status = str(res['hits']['hits'][0]['_source'])
                        status = json.loads(status.replace("'", "\""))
                        message = "{\"data_pipeline\": {\"kafka_host\":" + "\"" + str(data["kafka_host"]) + "\"" \
                                  + ",\"zookeeper_host\":" + "\"" + str(data["zookeeper_host"]) + "\"" \
                                  + ",\"spark_host\":" + "\"" + str(data["spark_host"]) + "\"" \
                                  + ",\"elasticsearch_host\":" + "\"" + str(data["elasticsearch_host"]) + "\"" \
                                  + ",\"kibana_host\":" + "\"" + str(data["kibana_host"]) + "\"}," \
                                  + "\"data_traffic_forecaster\":" + str(status["data_traffic_forecaster"]) + "," \
                                  + "\"decision_maker\":" + str(status["decision_maker"]) + "," \
                                  + "\"energy_forecaster\":" + str(status["energy_forecaster"]) + "}"
                        es.index(index='configuration', id=1, body=json.loads(message.replace("'", "\"")))
                        return {"status": "success"}
                    else:
                        return {"status": "fail"}
                else:
                    res = es.search(index='configuration', body=search)
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


@app.route('/ml-models', methods = ['POST', 'GET'])
def ml_models():
    if len(session) > 0:
        if session['logged_in'] == True:
            return render_template('ml_models.html')
        else:
            return render_template('login.html')
    else:
        return render_template('login.html')


"""@app.route('/analytics', methods = ['POST', 'GET'])
def analytics():
    if len(session) > 0:
        if session['logged_in'] == True:
            return render_template('analytics.html')
        else:
            return render_template('login.html')
    else:
        return render_template('login.html')"""


@app.route('/simulation', methods = ['POST', 'GET'])
def simulation():
    if request.method == 'POST':
        parser.add_argument("simulation")
        args = parser.parse_args()
        if args["simulation"]=="on":
            session['simulation'] = "on"
            return {'status':'success'}
        elif args["simulation"]=="off":
            session['simulation'] = "off"
            return {'status':'success'}
        else:
            return {'status':'wrong or no action declared'}

    if len(session) > 0:
        if session['logged_in'] == True:
            return render_template('simulation.html')
        else:
            return render_template('login.html')
    else:
        return render_template('login.html')


@app.route('/adaptation', methods = ['POST', 'GET'])
def adaptation():
    if len(session) > 0:
        if session['logged_in'] == True:
            return render_template('adaptation.html')
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


def checkdate(x):
    if x<10:
        return "0"+str(x)
    else:
        return str(x)