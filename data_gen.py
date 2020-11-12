import random
from elasticsearch import Elasticsearch

es = Elasticsearch()
es1 = Elasticsearch()

#url = 'http://localhost:9200/energy/_dev/'
#serach='http://localhost:9200/energy/_search'


# data time format yyyy-MM-dd'T'hh:mm:ss'Z' -> 2015-01-01T12:11:30Z
data = "2020-11-12"
hh="00"
mm="00"
ss="00"
message=''
text=''
energy_values = []
traffic_values = []
data_values = [[] for _ in range(24*60)]


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

        n1=0
        for k in range (23):
            if k == 0:
                continue
            n = random.randrange(0, 1000)
            n1= n1 + n

            message = message + " \"S"+str(k)+"\": " +str(n)

            if k==22:
                message = message + " }"
            else :
                message = message + ", "
       # messages.append(message)

        energy_values.append(n1)
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
        text = "{ \"timestamp\":\"" + date + "\","
        n1 = 0
        for k in range (23):
            if k == 0:
                continue
            n = random.randrange(0, 1000)
            n1=n1+n

            message = message + " \"S"+str(k)+"\": " +str(n)
            if k==22:
                message = message + " }"
            else :
                message = message + ", "
       # messages.append(message)
        traffic_values.append(n1)
        rex = es.index(index='traffic', body=message)

c1=0
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
        text = "{ \"timestamp\":\"" + date + "\","
        for k in range (23):
            if k == 0:
                continue
            n = random.randrange(0, 1000)
            data_values[c1].append(n)
            message = message + " \"S"+str(k)+"\": " +str(n)
            if k==22:
                message = message + " }"
            else :
                message = message + ", "
        rex = es.index(index='sensor-data', body=message)
        c1=c1+1

c2=0
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
        text = "{ \"timestamp\":\"" + date + "\","
        for k in range (23):
            if k == 0:
                continue
            total = data_values[c2][k-1]
            if total > 100:
                total = random.randint(total - 100, total + 100)
            else:
                total = random.randint(0, total + 100)
            message = message + " \"S"+str(k)+"\": " +str(total)
            if k==22:
                message = message + " }"
            else :
                message = message + ", "
        c2 = c2 + 1
        rex = es.index(index='forecast-sensor-data', body=message)



c3=0
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
        text = "{ \"timestamp\":\"" + date + "\","
        total=energy_values[c3]
        text = text + " \"actual\": " + str(total) + ", "
        total = random.randint(total - 1000, total + 1000)
        text = text + " \"forecast\": " + str(total) + " }"
        c3 = c3 + 1
        forcast = es1.index(index='energy-forecast', body=text)
c4=0
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
        text = "{ \"timestamp\":\"" + date + "\","
        total=traffic_values[c4]
        text = text + " \"actual\": " + str(total) + ", "
        total = random.randint(total - 1000, total + 1000)
        text = text + " \"forecast\": " + str(total) + " }"
        c4=c4+1
        forcast = es1.index(index='traffic-forecast', body=text)

#res = es.search(index='energy')