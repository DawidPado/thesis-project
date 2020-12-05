The software development took place following the Agile methodology.
The software was developed entirely in English and is divided into five sections, such as, Dashboard, Machine Learning Models, Simulation, Adaptation and Configuration.
HTML pages are requested with GET methods to the main web service while data with POST methods to all four Flask web services. The first web service, in fact, takes care of sending HTML pages, and sending the data of the Dashboard and Configuration section.
The second, third and fourth servers send data for the requests of the Machine Learning Models, Adaptation and Simulation sections respectively, see Fig. 1.
All data requests are made via AJAX requests.
Some of those requests are sent out immediately after the page has loaded and are requested every thirty seconds to keep the page updated.
All data requested from the server are taken from the ElasticSerach search engine through an ElasticSearch library, which are processed and sent to the applicant.
To make HTML more readable and not to repeat the code, Jinja2's templating mechanism was used, separating the redundant code into a single template.html file and putting more separately.
Another use of Jinja2 was to check if the simulation field with the value “on” is present in the session.
If this is not true, Jinja will replace the current skim with a message that the simulation is not in progress.
The session is also used to check if a user is authorized. Each data of it is encrypted with the session function of flask. The visual appearance of the software is a result of adapting the Lumino Pro template based on Bootstrap, modified to achieve the purpose of the project. Other frameworks for the UI part used are:
• ChartJS for the representation of data in charts
• SweetAlert to create error, success or information notifications
• jQuery Timepicker Addon to take the time interval that will be shown in the dashboard graphs
The appearance and use will be shown in the third chapter.
The following chapters will explain in more detail how the development of each section took place.

Dashboard
The dashboard mainly consists of four charts, such as, Total Energy Chart, Total Traffic Chart, Energy Distribution and finally Sensor Energy Chart.
There is a format on the page to select time range of charts. If interval is selected, a request is made containing this information, also blocking the automatic updating of the data, which always begins each time the page is loaded.
When a request occurs, the server checks if it contains data and in particular start_time and end_time.
If so, prepare the query to take the data in that interval, making an aggregation dependent on the time of the interval.
Every 1 minute for intervals of up to 3 hours.
Every 10 minutes for intervals between 3 hours and 1 day.
Every 12 hours for intervals between 1 day and 5 days.
Every 1 day for intervals longer than 5 days.
Otherwise, the query only asks for data from the last hour.
It then requests the data from the Energy and Traffic index, groups everything together and sends it back in the JSON format.
The system currently consists of 22 sensors but it is not a fixed number and can change.
To adapt their number is always calculated as the first task.
The count is done by analyzing the response JSON and checking how many records have the form “S” + number, assuming that the numbers are ordered integers greater than 0, for example S1, S2, S3, ..., S22.
Knowing the number of sensors it is finally possible to create graphs.
The first two are linear and data represent the sum of all sensors.
The third is a bar type and represents the data in the form of the sum of each sensor over time.
The last of the linear type represents the data of a single sensor with the possibility of changing it using a selector.
key files: app.py, dashboard.js, utilities.js


Machine Learning Models
This section consists of three graphs and a table.
The graphs are linear and have the following name:
Total Energy Consumption Forecast Model, Total Traffic Forecast Model, Sensor Data Forecast Model.
They are graphs consisting of two lines, one for the forecast made and one for current real data.
The table shows the training models available alongside a Train button to start the training.
The initial call requests the data of the graphs of the last hour to the respective indexes that contain them, in addition to the index that contains the data of the table and the index to check if a training is in progress.
Everything is grouped and sent back to the sender in JSON format.
The sensor count for the graphs is not necessary as the data is already saved in the form shown in the graph.
Far from it for the table that shows the models of all sensors together with the Traffic and Energy model.
After counting with the same dashboard method, the table is created with as many rows as sensors plus the Traffic, Energy columns.
Finally, the table is filled, with buttons enabled or disabled depending on whether in the JSON field to check if a training is in progress is positive. If it is in progress but the request is still made by enabling buttons from the console, web service will respond with
"Status": "another process is running" and will not complete the request.
Instead, if no training is in progress the buttons are enabled.
By clicking on a button, a request with the data of the respective column is forwarded to the web service which still checks the status of the trainings and then passes the request to the ArchLearner.
If all goes well, it responds to the client, which notifies the user of the training started.
key files: app-ml-models.py, ml-models.js, utilities.js

Simulation
The section consists of 4 fields and 3 buttons, and is used to set the simulation configuration, start it, and stop it.
In which one field is intended for loading the CupCarbon project and three remaining fields for the duration of the simulation, number of patterns, and number of components.
Pressing the Upload button activates a function that first sends the project if there is, at its destination, the web service checks if it has an approved extension and, if so, saves it in a folder, and sends the status of the operation in response.
Subsequently, with another call, the data is sent.
Which in turn will be saved in the search engine.
To start the operation of the other screens, the simulation must be started.
Checking whether the simulation is in progress takes place via the session.
Pressing the Start button activates a function that makes a request to the main server which saves the simulation status to “on” in the session, and then directs to the dashboard section.
It is not an optimal solution to the problem, as it does not take into account the multiple users who can use the system at the same time, as well as having session expiration limits.
By pressing the Stop button, the simulation in the session is set to “off”.
key files: app-simulation.py, simulation.js, utilities.js, validator.js

Adaptation
This section allows viewing only.
It is composed of two tables called “Real-time grid of Q-learning process” and “Real-time view of Q-table matrix”.
And from two graphs "Number of adaptations" and "Adaptation time".
The first request for data occurs when the document is loaded and they are updated every one minute.
The procedure is no different from those previously, when sending the request, the web service collects the data of the two graphs, together with the system position and the Q-table values ​​from the search engine, encapsulates everything together and sends the result in JSON format.
The first table is predefined and it is not necessary to create it in realtime but only to insert the data.
The second table is created with as many rows as records for the Q-table in the response and filled at the same time.
As for the two graphs, they are created with the same procedure as the ML Models section, unlike they are composed of one line each.
key files: app-adaptation.py, adaptation.js, utilities.js

Configuration
Like the Simualtion section, this one also does not show any graphs.
It is mainly used to give the user a configuration interface of the ArchLearner framework.
The section is divided into four subsections such as configuration for data prediction, traffic prediction, one for decision maker and one for data pipeline.
As always, when the page loads, an AJAX request is initiated to request the current configuration data that are saved in the ElasticSearch, and sent back in JSON format.
In order not to let the user enter random or wrongly formed data, the verification system based on regular expressions written in Javascript has been created.
If at least one verification of a subsection is not passed, an alert appears informing the wrong field, moreover the html of the field is modified to highlight it in red.
Otherwise the request is made with the changed data which are saved in the ElasticSerach as well as being sent to the ArchLearner.
key files: app.py, configuration.js, utilities.js, validator.js

Login and Logout
The Login screen was created by modifying the Template of
“Login Form 10 by Colorlib”. When you press the Login button, a function checks whether the fields are empty and if so, it shows the user a message informing him. Otherwise an AJAX request is initiated with the data to the main web service. The password is encrypted and a request is sent to ElasticSearch to check if there is a match.
If there is, a field is created in the "Logged_id" session with a value of True.
Finally, the status of the comparison is sent, which if it fails, causes an error message to appear, otherwise it resizes.
Logout, on the other hand, was managed through a button that requires confirmation with an alert. If confirmation occurs in the session, the "Logged_in" field assumes the value False. And in this case, the window is resized on the Login window
key files: app.py, /login/js/auth.js