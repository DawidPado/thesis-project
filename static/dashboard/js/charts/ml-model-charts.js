$(document).ready(function() {
//global variables
    var xvalues_traffic = [], yvalues_traffic = [], xvalues_energy = [], yvalues_energy = [],
        ysensor_values_energy = [],
        sensor_data = [], sensors = [];
    var components_number = 0;  //how many sensors are in the sistem
    var myLineChart, myLineChart2 = null;

// start and update data
    start();
    setInterval(dataupdate, 30000); // refresh every 30s

// start and update function
    function start() {
        $.ajax({
            method: 'POST',
            url: 'http://127.0.0.1:5000/',
            success: function (result) {
                components_number = count_components(result.energy[0]); // numero componenti primo set == tutti gli altri set
                sensors = sensor_iterate(components_number);
                for (var j in result.energy) {
                    xvalues_energy.push(result.energy[j].timestamp);
                    yvalues_energy.push(sum(result.energy[j], components_number));
                    ysensor_values_energy.push(get_sensor_data(result.energy[j], sensor_number));
                    if (j >= 50) {
                        sensor_data = fill_data(result.energy[j], sensor_data, components_number)
                    }

                }

                console.log(components_number)
                for (var k in result.traffic) {
                    xvalues_traffic.push(result.traffic[k].timestamp);
                    yvalues_traffic.push(sum(result.traffic[k], components_number));

                }
                var section = "";
                for (i = 0; i < components_number; i++) {
                    section = section + "                                    <option value=\"" + (i + 1) + "\">" + sensors[i] + "</option>\n";
                }
                $("#option").replaceWith(section);
                $("#total-energy").replaceWith("<div class=\"large\" id=\"total-energy\">" + yvalues_energy[59] / 1000 + "KJ" + "</div>");
                $("#total-traffic").replaceWith("<div class=\"large\" id=\"total-traffic\">" + (yvalues_traffic[59]) + "msg" + "</div>");
                $("#components-number").replaceWith("<div class=\"large\" id=\"components-number\">" + components_number + "</div>");

                show_chart();
                show_energy();
                show_traffic();
                show_single_energy();
                ysensor_values_energy = [], xvalues_traffic = [], yvalues_traffic = [], xvalues_energy = [], yvalues_energy = [], sensor_data = [];
            },
            statusCode: {
                400: function (response) {
                    console.log(response);
                }

            },
            error: function (err) {
                window.location.href = "http://127.0.0.1:5000/login/";
            }
        });
    }
    function dataupdate() {
        $.ajax({
            method: 'POST',
            url: 'http://127.0.0.1:5000/',
            success: function (result) {
                for (var j in result.energy) {
                    xvalues_energy.push(result.energy[j].timestamp);
                    yvalues_energy.push(sum(result.energy[j], components_number));
                    ysensor_values_energy.push(get_sensor_data(result.energy[j], sensor_number));
                    if (j >= 50) {
                        sensor_data = fill_data(result.energy[j], sensor_data, components_number)
                    }

                }
                console.log(sensor_data)
                for (var k in result.traffic) {
                    xvalues_traffic.push(result.traffic[k].timestamp);
                    yvalues_traffic.push(sum(result.traffic[k], components_number));

                }
                $("#total-energy").replaceWith("<div class=\"large\" id=\"total-energy\">" + yvalues_energy[59] / 1000 + "KJ" + "</div>");
                $("#total-traffic").replaceWith("<div class=\"large\" id=\"total-traffic\">" + (yvalues_traffic[59]) + "msg" + "</div>");

                update_bar();
                update_energy();
                update_traffic();
                update_single_energy();
                ysensor_values_energy = [];
                xvalues_traffic = [];
                yvalues_traffic = [];
                xvalues_energy = [];
                yvalues_energy = [];
                sensor_data = [];
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

// udapte graph
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
//create graph
    function show_energy() {
    const ctx1 = document.getElementById('myChart1');

     myLineChart = new Chart(ctx1, {
        type: 'line',
        data: {
            labels: xvalues_energy,

            datasets: [
                {
                    label: "Energy",/*
                     backgroundColor: 'rgb(109,99,255,0.2)',
                     borderColor: 'rgb(58,62,255)', */
                    backgroundColor :'rgb(58, 117, 251,0.2)',
                        borderColor:'rgb(58, 117, 251)',
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
    const ctx2 = document.getElementById('myChart2');
    myLineChart2 = new Chart(ctx2, {
        type: 'line',
        data: {
            labels: xvalues_traffic,

            datasets: [
                {
                    label: "Traffic",/*
                     backgroundColor: 'rgba(54, 162, 235, 0.2)',
                     borderColor: 'rgba(54, 162, 235, 1)',*/
                     backgroundColor :'rgb(58, 117, 251,0.2)',
                        borderColor:'rgb(58, 117, 251)',
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
})