$(document).ready(function() {
//global variables
    var xvalues_traffic=[], yvalues_traffic =[],xvalues_energy =[],yvalues_energy=[],ysensor_values_energy=[],
    sensor_data=[], sensors = [];
    var sensor_number =1;       // current single sensor chart number
    var components_number=0;  //how many sensors are in the sistem
    var myLineChart,myLineChart2,myLineChart3,myBarChart = null;
    var block=false
    var start_time="",end_time="";
// start and update data
    start();
    setInterval(function (){
        if(!block){
            dataupdate()
        }
    }, 30000); // refresh every 30s

// start and update function
    function start(){
    $.ajax({
            method: 'POST',
            url: 'http://127.0.0.1:5000/',
            success: function (result) {
                components_number = count_components(result.energy[0]); // numero componenti primo set == tutti gli altri set
                sensors = sensor_iterate(components_number);
                $("#status").replaceWith("<div id=\"status\"><div class=\"profile-usertitle-status\"><span class=\"indicator label-success\"></span>Online</div> </div>");
                for (var j in result.energy) {
                    xvalues_energy.push(result.energy[j].timestamp);
                    yvalues_energy.push(sum(result.energy[j],components_number));
                    ysensor_values_energy.push(get_sensor_data(result.energy[j],sensor_number));
                   /*if(j>=50){ //last ten minuts
                    sensor_data = fill_data(result.energy[j],sensor_data,components_number)
                    }*/
                     sensor_data = fill_data(result.energy[j],sensor_data,components_number)
                }

                console.log(components_number)
                for (var k in result.traffic) {
                    xvalues_traffic.push(result.traffic[k].timestamp);
                    yvalues_traffic.push(sum(result.traffic[k],components_number));

                }
                var section="";
                for(i=0;i<components_number;i++){
                    section=section+"                                    <option value=\""+(i+1)+"\">"+sensors[i]+"</option>\n";
                }
                $("#option").replaceWith(section);
                $("#total-energy").replaceWith("<div class=\"large\" id=\"total-energy\">" + yvalues_energy[59] / 1000 + "KJ" + "</div>");
                $("#total-traffic").replaceWith("<div class=\"large\" id=\"total-traffic\">" + (yvalues_traffic[59]) + "msg" + "</div>");
                $("#components-number").replaceWith("<div class=\"large\" id=\"components-number\">"+components_number+"</div>");
                var d = new Date();
                $("#time").replaceWith("<p id=\"time\">"+date_formatter(d)+"</p>");
                show_chart();
                show_energy();
                show_traffic();
                show_single_energy();
                ysensor_values_energy=[], xvalues_traffic=[], yvalues_traffic=[], xvalues_energy =[], yvalues_energy=[], sensor_data=[];
            },
            statusCode: {
                400: function (response) {
                    console.log(response);
                }

            },
            error: function (err) {
                offline(err)
            }
        });}

    function dataupdate(){
    $.ajax({
            method: 'POST',
            url: 'http://127.0.0.1:5000/',
            success: function (result) {
                for (var j in result.energy) {
                    xvalues_energy.push(result.energy[j].timestamp);
                    yvalues_energy.push(sum(result.energy[j],components_number));
                    ysensor_values_energy.push(get_sensor_data(result.energy[j],sensor_number));
                   /*if(j>=50){ //last ten minuts
                    sensor_data = fill_data(result.energy[j],sensor_data,components_number)
                    }*/
                    sensor_data = fill_data(result.energy[j],sensor_data,components_number)
                }
                console.log(sensor_data)
                for (var k in result.traffic) {
                    xvalues_traffic.push(result.traffic[k].timestamp);
                    yvalues_traffic.push(sum(result.traffic[k],components_number));

                }
                $("#total-energy").replaceWith("<div class=\"large\" id=\"total-energy\">" + yvalues_energy[59] / 1000 + "KJ" + "</div>");
                $("#total-traffic").replaceWith("<div class=\"large\" id=\"total-traffic\">" + (yvalues_traffic[59]) + "msg" + "</div>");
                var d = new Date();
                $("#time").replaceWith("<p id=\"time\">"+date_formatter(d)+"</p>");
                update_bar();
                update_energy();
                update_traffic();
                update_single_energy();
                ysensor_values_energy=[];
                xvalues_traffic=[];
                yvalues_traffic=[];
                xvalues_energy =[];
                yvalues_energy=[];
                sensor_data=[];
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
//single chart update function
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
//update on select
    $("#sel").change(function(){
         sensor_number = Number($("#sel option:selected").val());
        console.log(sensor_number);
        if(block){
            $.ajax({
            method: 'POST',
            url: 'http://127.0.0.1:5000/',
            contentType: 'application/json;charset=UTF-8',
            data: JSON.stringify(
                {
                    "start_time": start_time,
                    "end_time":end_time
                }),
            dataType: "json",
            success: function (result) {
                console.log(result)
                ysensor_values_energy=[], xvalues_energy = [];
                for(var j in result.energy) {
                    xvalues_energy.push(result.energy[j]["key_as_string"]);
                    ysensor_values_energy.push(get_sensor_data(result.energy[j],sensor_number,true));                    //console.log(get_sensor_data(result.energy[j],sensor_number));
                }
                update_single_energy()
                ysensor_values_energy=[], xvalues_energy=[];
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
        else {
            $.ajax({
                method: 'POST',
                url: 'http://127.0.0.1:5000/',
                success: function (result) {
                    ysensor_values_energy = [], xvalues_energy = [];
                    for (var j in result.energy) {
                        xvalues_energy.push(result.energy[j].timestamp);
                        ysensor_values_energy.push(get_sensor_data(result.energy[j], sensor_number));
                        //console.log(get_sensor_data(result.energy[j],sensor_number));
                    }
                    update_single_energy()
                    ysensor_values_energy = [];
                    xvalues_energy = [];
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
    });
//chart display
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
    function show_single_energy() {
    const ctx4 = document.getElementById('myChart4');
     myLineChart3 = new Chart(ctx4, {
        type: 'line',
        data: {
            labels: xvalues_energy,

            datasets: [
                {
                    label: "Energy",/*
                     backgroundColor: 'rgba(54, 162, 235, 0.2)',
                     borderColor: 'rgba(54, 162, 235, 1)',*/
                     backgroundColor :'rgb(58, 117, 251,0.2)',
                        borderColor:'rgb(58, 117, 251)',
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
                                return d.getHours() +":0" + d.getMinutes();
                            }
                            else {
                                return d.getHours() + ":" + d.getMinutes();
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
    datasets: [{/*
        backgroundColor: 'rgb(54,126,235)',
        borderColor: 'rgb(54,99,235)',*/
         backgroundColor :'rgb(58, 117, 251)',
        borderColor:'rgb(58, 117, 251)',
        data: sensor_data
    }],

    labels: sensors
},
        options: {
            legend: {display: false},
            scales: {
                yAxes: [
                    {
                    ticks: {
                        callback: function (value) {
                            return value + 'J';
                        }
                    }
                }]
            }
        }
    });
}
var startDateTextBox = $('#range_example_1_start');
var endDateTextBox = $('#range_example_1_end');

startDateTextBox.datetimepicker({
	oneLine: true,
        dateFormat: 'dd/mm/yy',
	    timeFormat: 'HH:mm',
        timezone: '+0100',
	onClose: function(dateText, inst) {
		if (endDateTextBox.val() != '') {
			var testStartDate = startDateTextBox.datetimepicker('getDate');
			var testEndDate = endDateTextBox.datetimepicker('getDate');
			if (testStartDate > testEndDate)
				endDateTextBox.datetimepicker('setDate', testStartDate);
		}
		else {
			endDateTextBox.val(dateText);
		}
	},
	onSelect: function (selectedDateTime){
		endDateTextBox.datetimepicker('option', 'minDate', startDateTextBox.datetimepicker('getDate') );
	}
});
endDateTextBox.datetimepicker({
	oneLine: true,
        dateFormat: 'dd/mm/yy',
	    timeFormat: 'HH:mm',
        timezone: '+0100',
	onClose: function(dateText, inst) {
		if (startDateTextBox.val() != '') {
			var testStartDate = startDateTextBox.datetimepicker('getDate');
			var testEndDate = endDateTextBox.datetimepicker('getDate');
			if (testStartDate > testEndDate)
				startDateTextBox.datetimepicker('setDate', testEndDate);
		}
		else {
			startDateTextBox.val(dateText);
		}
	},
	onSelect: function (selectedDateTime){
		startDateTextBox.datetimepicker('option', 'maxDate', endDateTextBox.datetimepicker('getDate') );
	},
	onClose: function (){
         start_time=$('#range_example_1_start').datetimepicker('getDate');
	     end_time=$('#range_example_1_end').datetimepicker('getDate')
            var d = new Date();
            if(start_time>end_time){
                console.log("start time can't be after end time")
                return false
            }
	        if( d<end_time || d<start_time){
	            alert("ciao")
	            block=false;
	            dataupdate()
	            return false
            }
	        start_time=start_time.toISOString()
            end_time=end_time.toISOString()
            $.ajax({
            method: 'POST',
            url: 'http://127.0.0.1:5000/',
            contentType: 'application/json;charset=UTF-8',
            data: JSON.stringify(
                {
                    "start_time": start_time,
                    "end_time":end_time
                }),
            dataType: "json",
            success: function (result) {
                if(result["status"]==="no data available"){
                    swal({
         showConfirmButton: false,
         timer: 4000,
         icon: 'error',
         title: result["status"]
            });
                    return false;
                }
                update_bar();
                update_energy();
                update_traffic();
                update_single_energy();
                block=true;
                components_number = count_components(result.energy[0]); // numero componenti primo set == tutti gli altri set
                sensors = sensor_iterate(components_number);
                $("#status").replaceWith("<div id=\"status\"><div class=\"profile-usertitle-status\"><span class=\"indicator label-success\"></span>Online</div> </div>");
                for (var j in result.energy) {
                    xvalues_energy.push(result.energy[j]["key_as_string"]);
                    yvalues_energy.push(sum(result.energy[j],components_number,true));
                    ysensor_values_energy.push(get_sensor_data(result.energy[j],sensor_number,true));
                    sensor_data = fill_data(result.energy[j],sensor_data,components_number,true)

                }
                for (var k in result.traffic) {
                    xvalues_traffic.push(result.traffic[k]["key_as_string"]);
                    yvalues_traffic.push(sum(result.traffic[k],components_number,true));

                }
                var section="";
                for(i=0;i<components_number;i++){
                    section=section+"                                    <option value=\""+(i+1)+"\">"+sensors[i]+"</option>\n";
                }
                $("#option").replaceWith(section);
                $("#total-energy").replaceWith("<div class=\"large\" id=\"total-energy\">" + (yvalues_energy[yvalues_energy.length-1]/ 1000 ).toFixed(2)+ "KJ" + "</div>");
                $("#total-traffic").replaceWith("<div class=\"large\" id=\"total-traffic\">" + (yvalues_traffic[yvalues_traffic.length-1]).toFixed(2) + "msg" + "</div>");
                $("#components-number").replaceWith("<div class=\"large\" id=\"components-number\">"+components_number+"</div>");
                var d = new Date();
                $("#time").replaceWith("<p id=\"time\">"+date_formatter(end_time)+"</p>");
                $("#time2").replaceWith("<p id=\"time2\">"+date_formatter(start_time)+" -</p>");
                update_bar();
                update_energy();
                update_traffic();
                update_single_energy();
                ysensor_values_energy=[];
                xvalues_traffic=[];
                yvalues_traffic=[];
                xvalues_energy =[];
                yvalues_energy=[];
                sensor_data=[];
                },
            statusCode: {
                404: function (response) {
                    console.log(response);
                }
            },
            error: function (err) {
                offline(err)
            }
        });
        }

});

    $('#refresh-content').on('click', function(e) {
		e.preventDefault();
		block=false
        $("#time2").replaceWith("<p id=\"time2\"></p>");
        ysensor_values_energy=[];
                xvalues_traffic=[];
                yvalues_traffic=[];
                xvalues_energy =[];
                yvalues_energy=[];
                sensor_data=[];
		dataupdate()
	});
});