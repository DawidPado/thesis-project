import random
from elasticsearch import Elasticsearch

es = Elasticsearch()

#url = 'http://localhost:9200/energy/_dev/'
#serach='http://localhost:9200/energy/_search'


# data time format yyyy-MM-dd'T'hh:mm:ss'Z' -> 2015-01-01T12:11:30Z
data = "2020-11-02"
hh="00"
mm="00"
ss="00"
message=''
messages = []


for i in range(24):
    if i < 10:
        hh="0"+ str(i)
    else:
        hh=str(i)
    for j in range(60):
        if j < 10:
            mm="0"+str(j)
        else:
            mm=str(j)
        date=data+'T'+hh+':'+mm+':'+ss+'Z'
        message ="{ \"timestamp\":\""+ date+"\","
        for k in range (23):
            if k == 0:
                continue
            n = random.randrange(0, 1000)
            message = message + " \"S"+str(k)+"\": " +str(n)
            if k==22:
                message = message + " }"
            else :
                message = message + ", "
       # messages.append(message)
        rex = es.index(index='energy', body=message)


for i in range(24):
    if i < 10:
        hh="0"+ str(i)
    else:
        hh=str(i)
    for j in range(60):
        if j < 10:
            mm="0"+str(j)
        else:
            mm=str(j)
        date=data+'T'+hh+':'+mm+':'+ss+'Z'
        message ="{ \"timestamp\":\""+ date+"\","
        for k in range (23):
            if k == 0:
                continue
            n = random.randrange(0, 1000)
            message = message + " \"S"+str(k)+"\": " +str(n)
            if k==22:
                message = message + " }"
            else :
                message = message + ", "
       # messages.append(message)
        rex = es.index(index='traffic', body=message)

#res = es.search(index='energy')