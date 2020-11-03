task n.1
LOGIN PAGE - i used https://colorlib.com/wp/template/login-form-v10/ template
description :
on login button click, ajax send post  request with username and password input.
server verify if it is correct,
1) if it is,new session is created and respond json {"status":"success"} is sent
2) otherwise {"status":"fail"}
key files : app.py, auth.js
-------

task n.2

CHARTS AND DASHBOARD - i used chartJs and LUMINO Pro Version
description:
First static and then next step will be dynamic,
the data should not be in the js instead it should be from the service.
Once the user logs in, he should see a page with 2 main graphs
1) the first graph will have x-axis with time intervals in seconds and y axis will be energy consumption in joules...
2) the second graph will have x-axis again with time intervals in seconds and y axis will be data traffic
And other 2:
3) single sensor energy chart settable
4) energy distribution in 10 minutes by any sensor
key files : app.py, data_gen.py, main.html, main-charts.js, chart-config.js
Elastic search use:

show all - GET http://localhost:9200/energy/_search
insert - POST http://localhost:9200/energy/_doc/{id}  body : JSON file { }      ///  - or without id
-------

task n.3
configurations