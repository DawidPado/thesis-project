"""
its a demo to implements adaptation values changing
"""
import random
import time

from elasticsearch import Elasticsearch

es = Elasticsearch()


def archtecture():
    tags = ["hehd", "hemd", "held", "mehd", "memd", "meld", "lehd", "lemd", "leld"]
    tags1=["co", "cu", "sc"]
    target = tags[random.randint(0, 8)]
    target1=tags1[random.randint(0, 2)]
    message={
        "current": target,
        "pattern": target1
    }
    rex = es.index(index='system_state', body=message, id=1)
    return "done"


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


while True:
    x=populate_q_table()
    y=archtecture()
    print(x," ",y)
    time.sleep(60)
