$(document).ready(function() {
//global variables
    var xvalues_traffic = [], yvalues_traffic = [], xvalues_energy = [], yvalues_energy = [];
    var yvalues_traffic_forecast=[], yvalues_energy_forecast=[];
    var xvalues_data = [], yvalues_data = [], yvalues_data_forecast = [];
    var myLineChart, myLineChart2, myLineChart3 = null;
    var sensors = []
    var components_number=0;
    var sensor_number =1;
    var disabled="", element=""
// start and update data
    start();
    setInterval(dataupdate, 30000); // refresh every 30s

// start and update function
    function start() {
         $.ajax({
            method: 'POST',
            url: 'http://127.0.0.1:5001/train-info',
            contentType: 'application/json;charset=UTF-8',
            data: JSON.stringify(
                {
                    "type": "check",
                }),
            dataType: "json",
            success: function (result) {
                if (result["status"] !== "free") {
                    console.log(result)
                    disabled = "disabled"
                    element=result["model_name"]
                }
            },
            statusCode: {
                400: function (response) {
                    console.log(response);
                }

            },
            error: function (err) {
               offline(err)
            }
        });
        $.ajax({
            method: 'POST',
            url: 'http://127.0.0.1:5001/',
            success: function (result) {
                components_number = count_components(result["sensor-data"][0]); // numero componenti primo set == tutti gli altri set
                sensors = sensor_iterate(components_number);
                $("#status").replaceWith("<div id=\"status\"><div class=\"profile-usertitle-status\"><span class=\"indicator label-success\"></span>Online</div> </div>");
                for (var j in result["energy"]) {
                    xvalues_energy.push(result["energy"][j]["timestamp"]);
                    yvalues_energy.push(result["energy"][j]["actual"]);
                    yvalues_energy_forecast.push(result["energy"][j]["forecast"]);
                }
                for (var k in result["traffic"]) {
                    xvalues_traffic.push(result["traffic"][k]["timestamp"]);
                    yvalues_traffic.push(result["traffic"][k]["actual"]);
                    yvalues_traffic_forecast.push(result["traffic"][k]["forecast"]);

                }
                 for (var l in result["sensor-data"]) {
                    xvalues_data.push(result["sensor-data"][l]["timestamp"]);
                    yvalues_data.push(get_sensor_data(result["sensor-data"][l],sensor_number));

                } for (var m in result["forecast-sensor-data"]) {
                    yvalues_data_forecast.push(get_sensor_data(result["forecast-sensor-data"][m],sensor_number));

                }
                var section="";
                for(i=0;i<components_number;i++){
                    section=section+"                                    <option value=\""+(i+1)+"\">"+sensors[i]+"</option>\n";
                }
                $("#option").replaceWith(section);
                show_energy();
                show_traffic();
                show_single_data()
                $("#energy-forecast").replaceWith("<div class=\"large\" id=\"energy-forecast\">" + yvalues_energy_forecast[59] / 1000 + "</div>");
                $("#traffic-forecast").replaceWith("<div class=\"large\" id=\"traffic-forecast\">" + (yvalues_traffic_forecast[59]) + "</div>");
                var d = new Date();
                $("#time").replaceWith("<p id=\"time\">"+date_formatter(d)+"</p>");
                xvalues_traffic = [], yvalues_traffic = [], xvalues_energy = [], yvalues_energy = [];
                yvalues_traffic_forecast=[], yvalues_energy_forecast=[];
                xvalues_data = [], yvalues_data = [], yvalues_data_forecast = [];
                var table=define_table()
                $("#tbody").replaceWith(table);
                if(disabled!=""){
                    console.log(element)
                    $("#"+element+"-button").replaceWith("<button id='"+element+"-button' onclick=\"train("+element+")\" class=\"btnbtn - smbtn - primary\" type=\"button\" disabled>Runs</button");
                }
                fill_table(components_number)
            },
            statusCode: {
                400: function (response) {
                    console.log(response);
                }

            },
            error: function (err) {
               offline(err)
            }
        });
    }

    function dataupdate() {
        $.ajax({
            method: 'POST',
            url: 'http://127.0.0.1:5001/',
            success: function (result) {
                for (var j in result["energy"]) {
                    xvalues_energy.push(result["energy"][j]["timestamp"]);
                    yvalues_energy.push(result["energy"][j]["actual"]);
                    yvalues_energy_forecast.push(result["energy"][j]["forecast"]);
                }
                for (var k in result["traffic"]) {
                    xvalues_traffic.push(result["traffic"][k]["timestamp"]);
                    yvalues_traffic.push(result["traffic"][k]["actual"]);
                    yvalues_traffic_forecast.push(result["traffic"][k]["forecast"]);

                }
                 for (var l in result["sensor-data"]) {
                    xvalues_data.push(result["sensor-data"][l]["timestamp"]);
                    yvalues_data.push(get_sensor_data(result["sensor-data"][l],sensor_number));

                } for (var m in result["forecast-sensor-data"]) {
                    yvalues_data_forecast.push(get_sensor_data(result["forecast-sensor-data"][m],sensor_number));

                }
                 var d = new Date();
                $("#time").replaceWith("<p id=\"time\">"+date_formatter(d)+"</p>");
                update_energy();
                update_traffic();
                update_single_data()
                $("#energy-forecast").replaceWith("<div class=\"large\" id=\"energy-forecast\">" + yvalues_energy_forecast[59] / 1000 + "</div>");
                $("#traffic-forecast").replaceWith("<div class=\"large\" id=\"traffic-forecast\">" + (yvalues_traffic_forecast[59]) + "</div>");
                xvalues_traffic = [], yvalues_traffic = [], xvalues_energy = [], yvalues_energy = [];
                yvalues_traffic_forecast=[], yvalues_energy_forecast=[];
                xvalues_data = [], yvalues_data = [], yvalues_data_forecast = [];
            },
            statusCode: {
                400: function (response) {
                    console.log(response);
                }
            },
            error: function (err) {
                offline(err)
            }
        });

    }

// udapte graph
    function update_energy(){
    myLineChart.data.datasets[0].data= yvalues_energy;
    myLineChart.data.datasets[1].data= yvalues_energy_forecast;
    myLineChart.data.labels= xvalues_energy;
    myLineChart.update();
}
    function update_traffic(){
    myLineChart2.data.datasets[0].data= yvalues_traffic;
    myLineChart2.data.datasets[1].data= yvalues_traffic_forecast;
    myLineChart2.data.labels= xvalues_traffic;
    myLineChart2.update();
}
    function update_single_data(){
    myLineChart3.data.datasets[0].data= yvalues_data;
    myLineChart3.data.datasets[1].data= yvalues_data_forecast;
    myLineChart3.data.labels= xvalues_data;
    myLineChart3.update();
}
//update on select
    $("#sel").change(function(){
         sensor_number = Number($("#sel option:selected").val());
         highlight("S"+sensor_number.toString(),components_number)

        $.ajax({
            method: 'POST',
            url: 'http://127.0.0.1:5001/',
            success: function (result) {
                xvalues_data = [], yvalues_data = [], yvalues_data_forecast = [];

                 for (var l in result["sensor-data"]) {
                    xvalues_data.push(result["sensor-data"][l]["timestamp"]);
                    yvalues_data.push(get_sensor_data(result["sensor-data"][l],sensor_number));

                } for (var m in result["forecast-sensor-data"]) {
                    yvalues_data_forecast.push(get_sensor_data(result["forecast-sensor-data"][m],sensor_number));

                }
                update_single_data()
                xvalues_data = [], yvalues_data = [], yvalues_data_forecast = [];
            },
            statusCode: {
                400: function (response) {
                    console.log(response);
                }
            },
            error: function (err) {
                console.log(err);
            }
        });
    });
    $('#traffic-chart').on('click', function(e) {
        e.preventDefault();
        highlight('Traffic',components_number)
    })
     $('#energy-chart').on('click', function(e) {
         highlight('Energy',components_number)
        e.preventDefault();
    })
    $('#myChart4').on('click', function(e) {
         highlight('S'+sensor_number,components_number)
        e.preventDefault();
    })
//create graph
    function show_energy() {
    const ctx1 = document.getElementById('energy-chart');
     myLineChart = new Chart(ctx1, {
        type: 'line',
        data: {
            labels: xvalues_energy,

            datasets: [
                {
                    label: "Energy",/*
                     backgroundColor: 'rgb(109,99,255,0.2)',
                     borderColor: 'rgb(58,62,255)', */
                    backgroundColor :'rgba(255,255,255,0.1)',
                        borderColor:'#5386E4',
                    data: yvalues_energy
                }, {
                    label: "Energy Forecast",/*
                     backgroundColor: 'rgb(109,99,255,0.2)',
                     borderColor: 'rgb(58,62,255)', */
                    backgroundColor :'rgba(255,255,255,0.1)',
                        borderColor:'#ED6A5A',
                    data: yvalues_energy_forecast
                }
            ]
        },
       options: {
            legend: {
    labels: {
      usePointStyle: true,

    },
  },
            scales: {
                yAxes: [
                    {
                    ticks: {
                     //   fontColor: "white",
                        callback: function (value) {
                            return value + 'J';
                        }
                    }
                }],
                xAxes: [{
                    ticks: {
                        callback: function (value) {
                            var d = new Date(value)
                            if(d.getMinutes()<10){
                                return d.getHours() +":0" + d.getMinutes();
                            }
                            else {
                                return d.getHours()  + ":" + d.getMinutes();
                            }
                        }
                    }
                }]
            }
        }
    });
}
    function show_traffic() {
    const ctx2 = document.getElementById('traffic-chart');
    myLineChart2 = new Chart(ctx2, {
        type: 'line',
        data: {
            labels: xvalues_traffic,

            datasets: [
                {
                    label: "Traffic",/*
                     backgroundColor: 'rgba(54, 162, 235, 0.2)',
                     borderColor: 'rgba(54, 162, 235, 1)',*/
                    backgroundColor :'rgba(255,255,255,0.1)',
                        borderColor:'#5386E4',
                    data: yvalues_traffic
                },
                {
                    label: "Traffic Forecast",/*
                     backgroundColor: 'rgb(109,99,255,0.2)',
                     borderColor: 'rgb(58,62,255)', */
                    backgroundColor :'rgba(255,255,255,0.1)',
                        borderColor:'#ed6a5a',
                    data: yvalues_traffic_forecast
                }
            ]
        },
        options: {
            legend: {
    labels: {
      usePointStyle: true,

    },
  },
            scales: {
                yAxes: [{
                    ticks: {
                //             fontColor: "white",
                        callback: function (value) {
                            return value;
                        }
                    }
                }],
                xAxes: [{
                    ticks: {
                        callback: function (value) {
                            var d = new Date(value)
                            if(d.getMinutes()<10){
                                return d.getHours() +":0" + d.getMinutes();
                            }
                            else {
                                return d.getHours()  + ":" + d.getMinutes();
                            }
                        }
                    }
                }]
            }
        }
    });
}
    function show_single_data() {
    const ctx4 = document.getElementById('myChart4');
     myLineChart3 = new Chart(ctx4, {
        type: 'line',
        data: {
            labels: xvalues_data,
            datasets: [
                {
                    label: "data",/*
                     backgroundColor: 'rgba(54, 162, 235, 0.2)',
                     borderColor: 'rgba(54, 162, 235, 1)',*/
                    backgroundColor :'rgba(255,255,255,0.1)',
                    borderColor:'#5386E4',
                    data: yvalues_data
                },
                {
                    label: "data forecast",/*
                     backgroundColor: 'rgba(54, 162, 235, 0.2)',
                     borderColor: 'rgba(54, 162, 235, 1)',*/
                    backgroundColor :'rgba(255,255,255,0.1)',
                    borderColor:'#ed6a5a',
                    data: yvalues_data_forecast
                }
            ]
        },
           options: {
               legend: {
                    labels: {
                        usePointStyle: true,
                    }},
               scales: {
                   yAxes: [
                       {
                           ticks: {
                               callback: function (value) {
                                   return value;
                               }
                           }
                       }],
                   xAxes: [{
                       ticks: {
                           callback: function (value) {
                               var d = new Date(value)
                               if (d.getMinutes() < 10) {
                                   return d.getHours() + ":0" + d.getMinutes();
                               } else {
                                   return d.getHours() + ":" + d.getMinutes();
                               }
                           }
                       }
                   }]
               }
           }
    });
}
//create table
    function define_table(){
        var table=
            "\t\t\t\t\t\t\t\t\t<tbody style=\"word-break: break-all;\">\n" +
            "\t\t\t\t\t\t\t\t\t\t<tr id='Energy'>\n" +
            "\t\t\t\t\t\t\t\t\t\t\t<td id=\"Energy-1\">Energy</td>\n" +
            "<td id=\"Energy-2\"></td>\n" +
            "\t\t\t\t\t\t\t\t\t\t\t<td id=\"Energy-3\"></td>\n" +
            "<td id=\"Energy-4\"></td>\n" +
            "\t\t\t\t\t\t\t\t\t\t\t<td id=\"Energy-5\"></td>\n" +
            "\t\t\t\t\t\t\t\t\t\t\t<td id=\"Energy-6\"></td>\n" +
            "<td id=\"Energy-7\"></td>\n" +
            "<td><button id='Energy-button' onclick=\"train('Energy')\" class=\"btn btn-sm btn-primary\" type=\"button\" "+disabled+">Train</button></td>\n" +
            "\t\t\t\t\t\t\t\t\t\t</tr>\n" +
            "\t\t\t\t\t\t\t\t\t\t<tr id='Traffic'>\n" +
            "\t\t\t\t\t\t\t\t\t\t\t<td id=\"Traffic-1\">Traffic</td>\n" +
            "\t\t\t\t\t\t\t\t\t\t\t<td id=\"Traffic-2\"></td>\n" +
            "\t\t\t\t\t\t\t\t\t\t\t<td id=\"Traffic-3\"></td>\n" +
            "<td id=\"Traffic-4\"></td>\n" +
            "\t\t\t\t\t\t\t\t\t\t\t<td id=\"Traffic-5\"></td>\n" +
            "\t\t\t\t\t\t\t\t\t\t\t<td id=\"Traffic-6\"></td>\n" +
            "<td id=\"Traffic-7\"></td>\n" +
            "<td ><button  id='Traffic-button' onclick=\"train('Traffic')\" class=\"btn btn-sm btn-primary\" type=\"button\" "+disabled+">Train</button></td>\n" +
            "\t\t\t\t\t\t\t\t\t\t</tr>"
        for (i=1;i<=components_number;i++){
            table+="<tr id='S"+i+"'>\n";
                for(j=1;j<=7;j++){
                table+="<td id=\"S"+i.toString()+"-"+j.toString()+"\"></td>\n"
                }
            table+="<td><button id='S"+i.toString()+"-button' onclick=\"train('S"+i.toString()+"')\" class=\"btn btn-sm btn-primary\" type=\"button\" "+disabled+">Train</button></td>\n"+
            "</tr>\n";
        }
        table+="</tbody>\n"

        return table
    }
    $('#refresh-content').on('click', function(e) {
		e.preventDefault();
		dataupdate()
	});
})
