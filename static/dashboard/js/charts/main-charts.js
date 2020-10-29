
$(document).ready(function() {
    xvalues_traffic=[];
    yvalues_traffic=[];
    xvalues_energy =[];
    yvalues_energy=[];
    ysensor_values_energy=[];
    sensor_data=[];
    var sensor_number =1;
    var components_number=22;
    function getdata(){
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

                $("#new-chart1").replaceWith("<div class=\"canvas-wrapper\" id=\"new-chart1\">\n" +
                    "\t\t\t\t\t\t\t<canvas class=\"\" id=\"myChart1\" height=\"200\" width=\"600\"></canvas>\n" +
                    "\t\t\t\t\t\t</div>"
							);

                $("#new-chart2").replaceWith("<div class=\"canvas-wrapper\" id=\"new-chart2\">\n" +
                    "\t\t\t\t\t\t\t<canvas class=\"\" id=\"myChart2\" height=\"200\" width=\"600\"></canvas>\n" +
                    "\t\t\t\t\t\t</div>"
							);
                show_energy();
                show_traffic();
                show_single_energy();
                show_chart();
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
    getdata();
    setInterval(getdata, 30000); // refresh every 30s


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

    const myLineChart = new Chart(ctx1, {
        type: 'line',
        data: {
            labels: xvalues_energy,

            datasets: [
                {
                    label: "Energy",
                     backgroundColor: 'rgb(255,99,99,0.2)',
                     borderColor: 'rgb(252,39,39)',
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
    const myLineChart2 = new Chart(ctx2, {
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
    const myLineChart4 = new Chart(ctx4, {
        type: 'line',
        data: {
            labels: xvalues_energy,

            datasets: [
                {
                    label: "Energy",
                     backgroundColor: 'rgba(43,184,0,0.2)',
                     borderColor: 'rgb(0,134,9)',
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
    var sensors = sensor_iterate(components_number);
    var data = sensor_data;
    const myLineChart3 = new Chart(ctx3, {
        type: 'bar',
        data: {
    datasets: [{
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgb(54,99,235)',
        data: data
    }],

    labels: sensors
},
        options: {
            legend: {display: false}
        }
    });
}
});