$(document).ready(function() {
var randomScalingFactor = function(){ return Math.round(Math.random()*1000)};
xvalues=[]
yvalues=[]
        $.ajax({
            method: 'POST',
            url: 'http://127.0.0.1:5000/',
            success: function (data) {
                var result= data.cur_data;
                for(var i in result) {
                    console.log(result[i]);
                    xvalues.push(result[i].cur_time);
                    yvalues.push(result[i].energy);
                }
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
async function show() {
    xlabels = await xvalues
    ydata = await yvalues
    const ctx1 = document.getElementById('myChart1');

    const myLineChart = new Chart(ctx1, {
        type: 'line',
        data: {
            labels: xlabels,

            datasets: [
                {
                    label: "Energy1",
                    fillColor: "rgba(220,220,220,0.2)",
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgb(26,239,12)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#f10d0d",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: ydata
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
                            return value + 'sec';
                        }
                    }
                }]
            }
        }
    });
}
show();
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