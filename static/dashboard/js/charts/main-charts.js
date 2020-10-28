$(document).ready(function() {
    xvalues_traffic=[];
    yvalues_traffic=[];
    xvalues_energy =[];
    yvalues_energy=[];
    ysensor_values_energy=[];
    ysensor_values_traffic=[];

    var data_global=null;
function sum(obj){
        return obj.S1+obj.S2+obj.S3+obj.S4+obj.S5+obj.S6+obj.S7+obj.S8+obj.S9+obj.S10+obj.S11+obj.S12+obj.S13+
            obj.S14+obj.S15+obj.S16+obj.S17+obj.S18+obj.S19+obj.S20+obj.S21+obj.S22;
    }
function get_sensor_data(input,sensor){
            switch (Number(sensor)){
                    case 1:  return input.S1;
                    case 2: return input.S2;
                    case 3: return input.S3;
                    case 4: return input.S4;
                    case 5: return input.S5;
                    case 6: return input.S6;
                    case 7: return input.S7;
                    case 8: return input.S8;
                    case 9: return input.S9;
                    case 10: return input.S10;
                    case 11: return input.S11;
                    case 12: return input.S12;
                    case 13: return input.S13;
                    case 14: return input.S14;
                    case 15: return input.S15;
                    case 16: return input.S16;
                    case 17: return input.S17;
                    case 18: return input.S18;
                    case 19: return input.S19;
                    case 20: return input.S20;
                    case 21: return input.S21;
                    case 22: return input.S22;
            }
    }
        $.ajax({
            method: 'POST',
            url: 'http://127.0.0.1:5000/',
            success: function (data) {
                var result = JSON.parse(data);
                data_global=result;
                for(var j in result.energy) {
                    xvalues_energy.push(result.energy[j].timestamp);
                    yvalues_energy.push(sum(result.energy[j]));

                    ysensor_values_energy.push(result.energy[j].S1)
                //    console.log(result.energy[j]);
                }
                for(var k in result.traffic) {
                    xvalues_traffic.push(result.traffic[k].timestamp);
                    yvalues_traffic.push(sum(result.traffic[k]));

                    ysensor_values_traffic.push(result.traffic[k].S1)
                //    console.log(result.traffic[k]);
                }
                 $("#total-energy").replaceWith("<div class=\"large\" id=\"total-energy\">"+yvalues_energy[59]/1000+"KJ"+"</div>");
                 $("#total-traffic").replaceWith("<div class=\"large\" id=\"total-traffic\">"+(yvalues_traffic[59]/1024).toFixed(2)+"MB"+"</div>");
                show_energy();
                show_traffic();
                show_single_energy();
                //  show_single_traffic();
                console.log(data)
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
$('#change-energy-chart').on('click', function(e) {
    e.preventDefault();
    var input = prompt("Please enter the sensor number");

    $.ajax({
            method: 'POST',
            url: 'http://127.0.0.1:5000/',
            success: function (data) {
                ysensor_values_energy=[]
                xvalues_energy=[]
                var result = JSON.parse(data);
                data_global=result;
                for(var j in result.energy) {
                    xvalues_energy.push(result.energy[j].timestamp);
                    ysensor_values_energy.push(get_sensor_data(result.energy[j],input));
                    console.log(get_sensor_data(result.energy[j],input));
                }
                for(var k in result.traffic) {
                    xvalues_traffic.push(result.traffic[k].timestamp);

                    ysensor_values_traffic.push(get_sensor_data(result.traffic[k],input))
                //    console.log(result.traffic[k]);
                }
                $("#new-chart4").replaceWith(
					        	"<div class=\"canvas-wrapper\" id=\"new-chart4\">\n" +
                    "\t\t\t\t\t\t\t<canvas class=\"chart\" id=\"myChart4\" ></canvas>\n" +
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
     $("#error-alert").replaceWith(
					        	" <div id=\"error-alert \" >\n" +
								"                        <span style=\"color:red\">\n" +
								"                          Wrong username or password  <em class=\"fa fa-warning\"></em>\n" +
								"                        </span>\n" +
								"                    </div>"
							);

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
                 //   fillColor: "rgba(220,220,220,0.2)",
                //     backgroundColor: 'rgba(255, 99, 132, 0.2)',
                     borderColor: 'rgb(255,236,69)',
                 //   strokeColor: "rgba(220,220,220,1)",
                 //   pointColor: "rgb(26,239,12)",
                 //   pointStrokeColor: "#ffffff",
                //    pointHighlightFill: "#f10d0d",
                //    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: yvalues_energy
                }
            ]
        },
       options: {
            legend: {labels: {boxWidth: 0,}},
            scales: {
                yAxes: [
                    {
                        gridLines: {color: "#484848", zeroLineColor: '#fff' },
                        scaleLabel: {
                                fontColor:'fff',
                            },
                    ticks: {
                        fontColor: "white",
                        callback: function (value) {
                            return value + 'J';
                        }
                    }
                }],
                xAxes: [{
                    gridLines: { color: "#484848", zeroLineColor: '#fff' },
                        scaleLabel: {
                                fontColor:'fff',
                            },
                    ticks: {
                        fontColor: "white",
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
                    fillColor: "rgba(220,220,220,0.2)",
                //     backgroundColor: 'rgba(54, 162, 235, 0.2)',
                     borderColor: 'rgba(54, 162, 235, 1)',
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgb(26,239,12)",
                    pointStrokeColor: "#ffffff",
                    pointHighlightFill: "#f10d0d",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: yvalues_traffic
                }
            ]
        },
        options: {
            legend: {labels: {boxWidth: 0,}},
            scales: {
                yAxes: [{
                        gridLines: { color: "#484848", zeroLineColor: '#fff' },
                        scaleLabel: {
                                fontColor:'fff',
                            },
                    ticks: {
                             fontColor: "white",
                        callback: function (value) {
                            return value;
                        }
                    }
                }],
                xAxes: [{
                    gridLines: { color: "#484848", zeroLineColor: '#fff' },
                        scaleLabel: {
                                fontColor:'fff',
                            },
                    ticks: {
                         fontColor: "white",
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
function show_single_traffic() {
    const ctx3 = document.getElementById('myChart3');
    const myLineChart3 = new Chart(ctx3, {
        type: 'line',
        data: {
            labels: xvalues_traffic,

            datasets: [
                {
                    label: "Traffic",
                    fillColor: "rgba(220,220,220,0.2)",
                     backgroundColor: 'rgba(54, 162, 235, 0.2)',
                     borderColor: 'rgba(54, 162, 235, 1)',
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgb(26,239,12)",
                    pointStrokeColor: "#ffffff",
                    pointHighlightFill: "#f10d0d",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: ysensor_values_traffic
                }
            ]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        callback: function (value, index, values) {
                            return value + 'kB';
                        }
                    }
                }],
                xAxes: [{
                    ticks: {
                        callback: function (value, index, values) {
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
                    fillColor: "rgba(220,220,220,0.2)",
                //     backgroundColor: 'rgba(255, 99, 132, 0.2)',
                     borderColor: 'rgb(255,119,0)',
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgb(26,239,12)",
                    pointStrokeColor: "#ffffff",
                    pointHighlightFill: "#f10d0d",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: ysensor_values_energy
                }
            ]
        },
           options: {
            legend: {labels: {boxWidth: 0,}},
            scales: {
                yAxes: [
                    {
                        gridLines: { color: "#484848", zeroLineColor: '#fff' },
                    ticks: {
                        fontColor: "white",
                        callback: function (value) {
                            return value + 'J';
                        }
                    }
                }],
                xAxes: [{
                    gridLines: { color: "#484848", zeroLineColor: '#fff' },
                    ticks: {
                        fontColor: "white",
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
});