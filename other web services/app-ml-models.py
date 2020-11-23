import datetime
import threading
import time
from flask import Flask, render_template, redirect, url_for, request, session
from flask_cors import CORS
from flask_restful import Api, Resource, reqparse
import json
from elasticsearch import Elasticsearch

es = Elasticsearch()
app = Flask(__name__)
app.secret_key = 'B;}}S5Cx@->^^"hQT{T,GJ@YI*><17'
api = Api(app)
parser = reqparse.RequestParser()
CORS(app)

@app.route('/', methods = ['POST', 'GET'])
def dashboard():
    if request.method == 'POST':
        data = request.get_json()
        if data != None:
            if data["type"] == "now":
                query = "{\"query\":{\"range\":{\"timestamp\":{\"gte\":\"now-1m\"}}}}"
                res = es.search(index='energy-forecast', body=query)
                status='{ \'energy-forecast\':['+ str(res['hits']['hits'][0]['_source']) + '],'
                query = "{\"query\":{\"range\":{\"timestamp\":{\"gte\":\"now-1m\"}}}}"
                res = es.search(index='traffic-forecast', body=query)
                status = status + ' \'traffic\':['+ str(res['hits']['hits'][0]['_source']) + ']}'
                return json.loads(status.replace("'", "\""))
        time = 60  # how many minuts

        #error rate
        error_rate=0.85


        status='{\'error_rate\':'+str(error_rate)+', \'energy\':[' # inital status
        count=0
        query = "{\"query\":{\"range\":{\"timestamp\":{\"gte\":\"now" + str(-time) + "m\"}}}}" #+2h o +1h depends on time zone
        res = es.search(index='energy-forecast', body=query, size=time)
        max=len(res['hits']['hits'])
        for i in range(max): # fill status with energy records
            count=count +1
            if count < max : #check number of current record to close energy
                status = status + str( res['hits']['hits'][i]['_source']) + ', '
            else:
                status = status + str(res['hits']['hits'][i]['_source']) + '],'
        status = status + ' \'sensor-data\':['
        count = 0
        res = es.search(index='sensor-data', body=query,size=time)
        max=len(res['hits']['hits'])
        if max == 0: status = status + "],"
        for i in range(max):  # fill status with energy records
            count = count + 1
            if count < max:  # check number of current record to close energy
                status = status + str(res['hits']['hits'][i]['_source']) + ', '
            else:
                status = status + str(res['hits']['hits'][i]['_source']) + '],'
        status = status + ' \'forecast-sensor-data\':['
        count = 0
        res = es.search(index='forecast-sensor-data', body=query,size=time)
        max = len(res['hits']['hits'])
        if max == 0: status = status + "],"
        for i in range(max):  # fill status with energy records
            count = count + 1
            if count < max:  # check number of current record to close energy
                status = status + str(res['hits']['hits'][i]['_source']) + ', '
            else:
                status = status + str(res['hits']['hits'][i]['_source']) + '],'
        status = status + ' \'traffic\':['
        count = 0
        res = es.search(index='traffic-forecast', body=query,size=time)
        max = len(res['hits']['hits'])
        if max == 0: status = status + "]}"
        for i in range(max):    #fill status with energy records
            count = count + 1
            if count < max:    #check number of current record to close traffic
                status = status + str(res['hits']['hits'][i]['_source']) + ', '
            else:
                status = status + str(res['hits']['hits'][i]['_source']) + ']}'

        return json.loads(status.replace("'", "\""))

@app.route('/train-info', methods = ['POST', 'GET'])
def train():
    if request.method == 'POST':
        data = request.get_json()
        if data != None:                #UPDATE
            if data["type"] == "update":
                verify = json.loads("{\"query\": {\"match\": {\"status\": \"running\"}}}")
                res = es.search(index='train-status', body=verify)
                if res['hits']['hits'] != []:
                    return {"status":"another process is running"}
                id=data["value"]
                start = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
                search = json.loads("{\"query\": {\"ids\" : {\"values\" : \""+data["value"]+"\"}}}")
                res = es.search(index='train-info', body=search)
                status = str(res['hits']['hits'][0]['_source']["model_name"])
                next = False
                version=""
                for char in status:
                    if(next):
                        version=version+char
                    if(char=='v'):
                        next=True
                version=int(version)+1
                message = "{\
                                        \"model_type\": \"" + id + "\",\
                                        \"model_name\": \"" + id + "_v"+str(version)+"\",\
                                        \"last_build\": \"" + str(start)+"\",\
                                        \"rmse\": 0.57,\
                                        \"smape\": 1.57,\
                                        \"mase\": 0.17,\
                                        \"horizon\": 10\
                                    }"

                es.index(index='train-info', id=id, body=json.loads(message.replace("'", "\"")))
                message="{\"status\": \"running\",\"model_name\": \""+id + "_v"+str(version)+"\",\"start\": \""+str(start)+"\"}"
                es.index(index='train-status', id=id+"_v"+str(version), body=json.loads(message.replace("'", "\"")))
                ##################################
                threading.Thread(target=machine_learning_process,args=(id, start, version,)).start()
                ##################################
                res = es.search(index='train-info', body=search)
                status = str(res['hits']['hits'][0]['_source'])
                status = json.loads(status.replace("'", "\""))
                return status

            #check if a trianing process is running
            if data["type"] == "check":
                verify = json.loads("{\"query\": {\"match\": {\"status\": \"running\"}}}")
                res = es.search(index='train-status', body=verify)

                if res['hits']['hits'] != []:
                    status = str(res['hits']['hits'][0]['_source'])
                    status = json.loads(status.replace("'", "\""))
                    return status
                return {"status":"free"}

            #GET DATA
            if data["type"] == "get":
                message="{"
                search = json.loads("{\"query\": {\"ids\" : {\"values\" : \"Energy\"}}}")
                res = es.search(index='train-info', body=search)
                status = str(res['hits']['hits'][0]['_source'])
                status = json.loads(status.replace("'", "\""))
                message = build_message(message,status,"Energy")+","

                search = json.loads("{\"query\": {\"ids\" : {\"values\" : \"Traffic\"}}}")
                res = es.search(index='train-info', body=search)
                status = str(res['hits']['hits'][0]['_source'])
                status = json.loads(status.replace("'", "\""))
                message = build_message(message,status,"Traffic")+","

                for i in range((data["sensor"])+1):
                    if i==0:
                        continue
                    search = json.loads("{\"query\": {\"ids\" : {\"values\" : \"S"+str(i)+"\"}}}")
                    res = es.search(index='train-info', body=search)
                    if res['hits']['hits']==[]:
                        id="S"+str(i)
                        message = "{\
                        \"model_type\": \""+id+"\",\
                        \"model_name\": \""+id+"_v1\",\
                        \"last_build\": \"2020-11-11T12:11:30Z\",\
                        \"rmse\": 0.57,\
                        \"smape\": 1.57,\
                        \"mase\": 0.17,\
                        \"horizon\": 10\
                    }"
                        es.index(index='train-info', id=id, body=json.loads(message.replace("'", "\"")))
                        time.sleep(3) #need time to store data


                    search = json.loads("{\"query\": {\"ids\" : {\"values\" : \"S" + str(i) + "\"}}}")
                    res= es.search(index='train-info', body=search)
                    status = str(res['hits']['hits'][0]['_source'])
                    status = json.loads(status.replace("'", "\""))
                    message = build_message(message,status,"S"+str(i))+","
                res = es.search(index='train-info', body={
                    "sort": [
                        {"last_build": {"order": "desc"}}
                    ],
                    "size": 1
                })
                status = str(res['hits']['hits'][0]['_source'])
                status = json.loads(status.replace("'", "\""))
                message = build_message(message,status,"last_record")+"}"
                return json.loads(message.replace("'", "\""))

        return {"message":"type or sensor value wrong or missing"}, 400


def build_message(message,status,type):
    message = message +"\""+type+"\":{\"model_type\": \"" + str(status["model_type"]) + "\"," \
              + "\"model_name\": \"" + str(status["model_name"]) + "\"," \
              + "\"last_build\": \"" + str(status["last_build"]) + "\"," \
              + "\"rmse\":" + str(status["rmse"]) + "," \
              + "\"smape\":" + str(status["smape"]) + "," \
              + "\"mase\":" + str(status["mase"]) + "," \
              + "\"horizon\":" + str(status["horizon"]) + "}"
    return message

def machine_learning_process(id,start,version):
    """
        background Process handled by Threads
        :return: None
    """
    time.sleep(61)  # simulate processing
    end = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    message = "{\"status\": \"finished\",\"model_name\": \"" + id + "\",\"start\": \"" + str(
        start) + "\", \"end\":\"" + end + "\"}"
    es.index(index='train-status', id=id + "_v" + str(version),body=json.loads(message.replace("'", "\"")))  # after finish set running to finished


if __name__ == '__main__':
    app.run(port=5001)

