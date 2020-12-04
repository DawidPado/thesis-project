import json
import random

from flask import Flask, request
from flask_cors import CORS
from flask_restful import Api, reqparse
from elasticsearch import Elasticsearch

es = Elasticsearch()
app = Flask(__name__)
app.secret_key = 'B;}}S5Cx@->^^"hQT{T,GJ@YI*><17'
api = Api(app)
parser = reqparse.RequestParser()
CORS(app)


@app.route('/', methods = ['POST', 'GET'])
def main():
    if request.method == 'POST':
        #populate_q_table()
        response="{\"SA\":"
        res = es.search(index='system_state')
        status = str(res['hits']['hits'][0]['_source']['current'])
        pattern = str(res['hits']['hits'][0]['_source']['pattern'])
        res = es.search(index='adaptation')
        values = str(res['hits']['hits'][0]['_source'])
        response=response+"\""+status+"\", \"pattern\":\""+pattern+"\", \"values\":["+values+"],"

        interval=10 #time agregation in minuts
        agg = "\"aggs\": {\
                    \"records\": {\
                        \"date_histogram\": {\
                                \"field\": \"timestamp\",\
                                        \"interval\": \"" + str(interval) + "m\"},\
                                \"aggs\": { \"value\": {\
                                    \"avg\": {\
                                        \"field\": \"value\"\
                                    }}}}}"
        time=60 #time before than now in minutes
        query = "{" + agg +",\"query\":{\"range\":{\"timestamp\":{\"gte\":\"now" + str(-time) + "m\", \"lte\":\"now\"}}}}"
        count = 0
        response = response + ' \'adaptation_time\':['
        res = es.search(index='adaptation_time', body=query, size=int(time/interval))
        max = len(res['aggregations']['records']['buckets'])
        if max==0: response = response + "],"
        for i in range(max):  # fill status with energy records
            count = count + 1
            if count < max:  # check number of current record to close energy
                response = response + str(res['aggregations']['records']['buckets'][i]) + ', '
            else:
                response = response + str(res['aggregations']['records']['buckets'][i]) + '],'
        response = response + ' \'adaptation_number\':['
        count = 0
        res = es.search(index='adaptation_number', body=query, size=int(time/interval))
        max = len(res['aggregations']['records']['buckets'])
        if max == 0: response = response + "],"
        for i in range(max):  # fill status with energy records
            count = count + 1
            if count < max:  # check number of current record to close energy
                response = response + str(res['aggregations']['records']['buckets'][i]) + ', '
            else:
                response = response + str(res['aggregations']['records']['buckets'][i]) + '],'
        res = es.search(index='q_table', size=27)
        max = len(res['hits']['hits'])
        response = response + ' \'q_table\':['
        count=0
        if max == 0: response = response + "],"
        for i in range(max):  # fill status with energy records
            count = count + 1
            if count < max:  # check number of current record to close energy
                response = response + str(res['hits']['hits'][i]['_source']) + ', '
            else:
                response = response + str(res['hits']['hits'][i]['_source']) + ']}'

        return json.loads(response.replace("'", "\""))


def populate_q_table():
    tags=["hehd","hemd","held","mehd","memd","meld","lehd","lemd","leld"]
    target=[]
    for i in tags:
        target.append(i+"_su")
        target.append(i + "_co")
        target.append(i + "_sc")
    for j in target:
        su=round(random.uniform(0, 5), 2)
        co = round(random.uniform(0, 5), 2)
        sc=round(random.uniform(0, 5), 2)
        message={"name":j, "su":su,"co":co,"sc":sc}

        rex = es.index(index='q_table', body=message, id=j)
    return "done"


if __name__ == '__main__':
    app.run(port=5002)





