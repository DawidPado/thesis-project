import datetime
import random
from elasticsearch import Elasticsearch

es = Elasticsearch()
es1 = Elasticsearch()

#url = 'http://localhost:9200/energy/_dev/'
#serach='http://localhost:9200/energy/_search'


# data time format yyyy-MM-dd'T'hh:mm:ss'Z' -> 2015-01-01T12:11:30Z
data = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d")
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
            n=random.uniform(10, 136.363636)
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
            n = random.randrange(5, 100)
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
            n = random.randrange(0, 100)
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
            if total <10:
                total = random.randint(0, total +10)
            else:
                total = random.randint(total- 25, total + 25)
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
        total = random.uniform(total - 10, total + 500)
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
        if total < 10:
            total = random.randint(0, total + 10)
        else:
            total = random.randint(total-100, total + 100)
        text = text + " \"forecast\": " + str(total) + " }"
        c4=c4+1
        forcast = es1.index(index='traffic-forecast', body=text)

number_of_adaptation=[]
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
        message = "{ \"timestamp\":\"" + date+"\","
        n = int(random.randrange(10, 20))
        message = message + " \"value\": " +str(n) + " }"
        number_of_adaptation.append(n)
        rex = es.index(index='adaptation_number', body=message)

c5=0
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
        total=number_of_adaptation[c5]
        total=round(random.uniform(total-1, total+1), 2)
        text = text + " \"value\": " + str(total) + " }"
        c5=c5+1
        forcast = es1.index(index='adaptation_time', body=text)