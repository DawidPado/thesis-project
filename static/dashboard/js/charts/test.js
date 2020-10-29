$(document).ready(function() {
    xvalues_traffic=[];
    yvalues_traffic=[];
    xvalues_energy =[];
    yvalues_energy=[];
    ysensor_values_energy=[];
    sensor_data=[];
    var sensor_number =1;
    var components_number=22;
    var myLineChart = null;
    var myLineChart2 = null;
    var myLineChart3 = null;
    var myBarChart = null;
    var sensors = sensor_iterate(components_number);
    function start(){
    $.ajax({
            method: 'POST',
            url: 'http://127.0.0.1:5000/',
            success: function (data) {
                var result = JSON.parse(data);
                for (var j in result.energy) {
                    xvalues_energy.push(result.energy[j].timestamp);
                    yvalues_energy.push(sum(result.energy[j],components_number));
                    ysensor_values_energy.push(get_sensor_data(result.energy[j],sensor_number));
                   if(j>=50){
                    sensor_data = fill_data(result.energy[j],sensor_data,components_number)
                    }

                }
                console.log(sensor_data)
                for (var k in result.traffic) {
                    xvalues_traffic.push(result.traffic[k].timestamp);
                    yvalues_traffic.push(sum(result.traffic[k],components_number));

                }
                $("#total-energy").replaceWith("<div class=\"large\" id=\"total-energy\">" + yvalues_energy[59] / 1000 + "KJ" + "</div>");
                $("#total-traffic").replaceWith("<div class=\"large\" id=\"total-traffic\">" + (yvalues_traffic[59]) + "msg" + "</div>");

                show_chart();
                show_energy();
                show_traffic();
                show_single_energy();
                sensor_data=[];
                 xvalues_traffic=[];
                 yvalues_traffic=[];
                xvalues_energy =[];
                yvalues_energy=[];
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
    }
    start();
    setInterval(dataupdate, 3000); // refresh every 30s

function dataupdate(){
    $.ajax({
            method: 'POST',
            url: 'http://127.0.0.1:5000/',
            success: function (data) {
                var result = JSON.parse(data);
                for (var j in result.energy) {
                    xvalues_energy.push(result.energy[j].timestamp);
                    yvalues_energy.push(sum(result.energy[j],components_number));
                    ysensor_values_energy.push(get_sensor_data(result.energy[j],sensor_number));
                   if(j>=50){
                    sensor_data = fill_data(result.energy[j],sensor_data,components_number)
                    }

                }
                console.log(sensor_data)
                for (var k in result.traffic) {
                    xvalues_traffic.push(result.traffic[k].timestamp);
                    yvalues_traffic.push(sum(result.traffic[k],components_number));

                }
                $("#total-energy").replaceWith("<div class=\"large\" id=\"total-energy\">" + yvalues_energy[59] / 1000 + "KJ" + "</div>");
                $("#total-traffic").replaceWith("<div class=\"large\" id=\"total-traffic\">" + (yvalues_traffic[59]) + "msg" + "</div>");

                update_bar();
                update_energy();
                update_traffic();
                update_single_energy();
                sensor_data=[];
                xvalues_traffic=[];
                yvalues_traffic=[];
                xvalues_energy =[];
                yvalues_energy=[];
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
}
function update_bar(){
    myBarChart.data.datasets[0].data= sensor_data;
    myBarChart.update();
}
function update_energy(){
    myLineChart.data.datasets[0].data= yvalues_energy;
    myLineChart.data.labels= xvalues_energy;
    myLineChart.update();
}
function update_traffic(){
    myLineChart2.data.datasets[0].data= yvalues_traffic;
    myLineChart2.data.labels= xvalues_traffic;
    myLineChart2.update();
}
function update_single_energy(){
    myLineChart3.data.datasets[0].data= ysensor_values_energy;
    myLineChart3.data.labels= xvalues_energy;
    myLineChart3.update();
}
$('#change-energy-chart').on('click', function(e) {
    e.preventDefault();
    var input = prompt("Please enter the sensor number");
    sensor_number = input;
    $.ajax({
            method: 'POST',
            url: 'http://127.0.0.1:5000/',
            success: function (data) {
                ysensor_values_energy=[]
                xvalues_energy=[]
                var result = JSON.parse(data);
                for(var j in result.energy) {
                    xvalues_energy.push(result.energy[j].timestamp);
                    ysensor_values_energy.push(get_sensor_data(result.energy[j],sensor_number));
                    console.log(get_sensor_data(result.energy[j],input));
                }
                $("#new-chart4").replaceWith(
					        	"<div class=\"canvas-wrapper\" id=\"new-chart4\">\n" +
                    "\t\t\t\t\t\t\t<canvas class=\"chart\" id=\"myChart4\"  ></canvas>\n" +
                    "\t\t\t\t\t\t</div>"
							);
                $("#single-energy-chart").replaceWith("<p3 id=\"single-energy-chart\">S"+input+" Energy Chart </p3>");
                show_single_energy();
                 ysensor_values_energy=[]
                xvalues_energy=[]
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
})
 function show_energy() {
    const ctx1 = document.getElementById('myChart1');

     myLineChart = new Chart(ctx1, {
        type: 'line',
        data: {
            labels: xvalues_energy,

            datasets: [
                {
                    label: "Energy",
                     backgroundColor: 'rgb(109,99,255,0.2)',
                     borderColor: 'rgb(58,62,255)',
                    data: yvalues_energy
                }
            ]
        },
       options: {
            legend: {display:false},
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
                                return d.getHours()-1 +":0" + d.getMinutes();
                            }
                            else {
                                return d.getHours() - 1 + ":" + d.getMinutes();
                            }
                        }
                    }
                }]
            }
        }
    });
}
function show_traffic() {
    const ctx2 = document.getElementById('myChart2');
    myLineChart2 = new Chart(ctx2, {
        type: 'line',
        data: {
            labels: xvalues_traffic,

            datasets: [
                {
                    label: "Traffic",
                     backgroundColor: 'rgba(54, 162, 235, 0.2)',
                     borderColor: 'rgba(54, 162, 235, 1)',
                    data: yvalues_traffic
                }
            ]
        },
        options: {
            legend: {display:false},
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
                                return d.getHours()-1 +":0" + d.getMinutes();
                            }
                            else {
                                return d.getHours() - 1 + ":" + d.getMinutes();
                            }
                        }
                    }
                }]
            }
        }
    });
}
function show_single_energy() {
    const ctx4 = document.getElementById('myChart4');
     myLineChart3 = new Chart(ctx4, {
        type: 'line',
        data: {
            labels: xvalues_energy,

            datasets: [
                {
                    label: "Energy",
                     backgroundColor: 'rgba(54, 162, 235, 0.2)',
                     borderColor: 'rgba(54, 162, 235, 1)',
                    data: ysensor_values_energy
                }
            ]
        },
           options: {
            legend: {display:false},
            scales: {
                yAxes: [
                    {
                    ticks: {
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
                                return d.getHours()-1 +":0" + d.getMinutes();
                            }
                            else {
                                return d.getHours() - 1 + ":" + d.getMinutes();
                            }
                        }
                    }
                }]
            }
        }
    });
}
function show_chart() {
    const ctx3 = document.getElementById('myChart3');
     myBarChart = new Chart(ctx3, {
        type: 'bar',
        data: {
    datasets: [{
        backgroundColor: 'rgb(54,126,235)',
        borderColor: 'rgb(54,99,235)',
        data: sensor_data
    }],

    labels: sensors
},
        options: {
            legend: {display: false}
        }
    });
}
});