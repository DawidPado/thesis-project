$(document).ready(function() {
    xvalues=[]
    yvalues=[]
    xvalues_energy=[]
    yvalues_energy=[]
function sum(obj){
        return obj.S1+obj.S2+obj.S3+obj.S4+obj.S5+obj.S6+obj.S7+obj.S8+obj.S9+obj.S10+obj.S11+obj.S12+obj.S13+
            obj.S14+obj.S15+obj.S16+obj.S17+obj.S18+obj.S19+obj.S20+obj.S21+obj.S22;
    }
      /*  $.ajax({
            method: 'POST',
            url: 'http://127.0.0.1:5000/',
            success: function (data) {
                var result= data.cur_data;
                console.log(result)
                for(var i in result) {
                 //   console.log(result[i]);
                    xvalues.push(result[i].cur_time);
                    yvalues.push(result[i].energy);
                }
                show();
            },
            statusCode: {
                400: function (response) {
                    console.log(response);
                }
            },
            error: function (err) {
                console.log(err);
            }
        });*/

        $.ajax({
            method: 'POST',
            url: 'http://127.0.0.1:5000/',
            success: function (data) {
                var result = JSON.parse(data);
                result=result.energy
                for(var j in result) {
                    xvalues_energy.push(result[j].timestamp);
                    yvalues_energy.push(sum(result[j]));
                    console.log(result[j]);
                }
                show();
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
 function show() {
    const ctx1 = document.getElementById('myChart1');

    const myLineChart = new Chart(ctx1, {
        type: 'line',
        data: {
            labels: xvalues_energy,

            datasets: [
                {
                    label: "Energy",
                    fillColor: "rgba(220,220,220,0.2)",
                     backgroundColor: 'rgba(255, 99, 132, 0.2)',
                     borderColor: 'rgba(255, 99, 132, 1)',
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgb(26,239,12)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#f10d0d",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: yvalues_energy
                }
            ]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        callback: function (value, index, values) {
                            return value + 'J';
                        }
                    }
                }],
                xAxes: [{
                    ticks: {
                        callback: function (value, index, values) {
                            var d = new Date(value)
                            if(d.getMinutes()<10){
                                return d.getHours()-2 +":0" + d.getMinutes();
                            }
                            else {
                                return d.getHours() - 2 + ":" + d.getMinutes();
                            }
                        }
                    }
                }]
            }
        }
    });
}
const ctx2 = document.getElementById('myChart2');
const xlabels2=[0,1,2,3,4,5];
const ydata2=[0,1,-2,-4,6, 7];
const myLineChart2 = new Chart(ctx2, {
    type: 'line',
    data: {
        labels : xlabels2,

		datasets : [
			{
				label: "Data Trafic",
				fillColor : "rgba(151,187,205,0.5)",
				strokeColor : "rgba(151,187,205,0.8)",
				pointColor : "rgba(220,220,220,1)",
				pointStrokeColor : "#451111",
				pointHighlightFill : "#451111",
				pointHighlightStroke : "rgba(220,220,220,1)",
				data: ydata2
			}
		]},
		options: {
        scales: {
            yAxes: [{
                ticks: {
                    callback: function(value, index, values) {
                        return value + 'kB';
                    }
                }
            }],
			xAxes: [{
                ticks: {
                    callback: function(value, index, values) {
                        return value + 'sec';
                    }
                }
            }]
        }
    }
});
var ctx3 = document.getElementById('myChart3').getContext('2d');
var myChart = new Chart(ctx3, {
    type: 'bar',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});
});