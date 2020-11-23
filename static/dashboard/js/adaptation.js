$(document).ready(function() {
//global variables
    var xvalues_time = [], yvalues_time = [], xvalues_number = [], yvalues_number = [];
    var myLineChart, myLineChart2 = null;
    var current=""
// start and update data
    start();
   // setInterval(dataupdate, 30000); // refresh every 30s

    function start() {
        $.ajax({
            method: 'POST',
            url: 'http://127.0.0.1:5002/',
            success: function (result) {
                console.log(result)
                $("#status").replaceWith("<div id=\"status\"><div class=\"profile-usertitle-status\"><span class=\"indicator label-success\"></span>Online</div> </div>");

                for (var j in result["adaptation_time"]) {
                    xvalues_time.push(result["adaptation_time"][j]["key_as_string"]);
                    yvalues_time.push(result["adaptation_time"][j]["value"]["value"]);
                }

                for (var k in result["adaptation_number"]) {
                    xvalues_number.push(result["adaptation_number"][k]["key_as_string"]);
                    yvalues_number.push(result["adaptation_number"][k]["value"]["value"]);
                }
                $("#"+result["SA"]).replaceWith("<td id=\"current "+result["SA"]+"\">SA</td>");


                show_time();
                show_number();
                var d = new Date();
                $("#time").replaceWith("<p id=\"time\">" + date_formatter(d) + "</p>");
                var table=define_table(result["q_table"])
                $("#tbody").replaceWith(table);
                xvalues_time = [], yvalues_time = [], xvalues_number = [], yvalues_number = [];
            },
            statusCode: {
                400: function (response) {
                    console.log(response);
                }

            },
            error: function (err) {
                //offline(err)
            }
        });
    }
    function dataupdate() {
        $.ajax({
            method: 'POST',
            url: 'http://127.0.0.1:5001/',
            success: function (result) {

                 var d = new Date();
                $("#time").replaceWith("<p id=\"time\">"+date_formatter(d)+"</p>");
                update_energy();
                update_traffic();
                update_single_data()

                $("#energy-forecast").replaceWith("<div class=\"large\" id=\"energy-forecast\">" + yvalues_energy_forecast[59] / 1000 + "</div>");
                $("#traffic-forecast").replaceWith("<div class=\"large\" id=\"traffic-forecast\">" + (yvalues_traffic_forecast[59]) + "</div>");
            },
            statusCode: {
                400: function (response) {
                    console.log(response);
                }
            },
            error: function (err) {
                //offline(err)
            }
        });

    }
//create graph
    function show_time() {
        const ctx1 = document.getElementById('time-chart');
        myLineChart = new Chart(ctx1, {
            type: 'line',
            data: {
                labels: xvalues_time,

                datasets: [
                    {
                        backgroundColor :'rgb(58, 117, 251,0.2)',
                        borderColor: '#5386E4',
                        data: yvalues_time
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

    function show_number() {
        const ctx2 = document.getElementById('number-chart');
        myLineChart2 = new Chart(ctx2, {
            type: 'line',
            data: {
                labels: xvalues_number,

                datasets: [
                    {
                        backgroundColor :'rgb(58, 117, 251,0.2)',
                        borderColor: '#5386E4',
                        data: yvalues_number
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

    function define_table(q_table){
        var table= "<tbody id = \"tbody\" style=\"word-break: break-all;\">"
        for (i in q_table){
            table+="<tr><td id='"+q_table[i]["name"]+"'>"+q_table[i]["name"]+"</td>\n\
               <td id='"+q_table[i]["su"]+"'>"+q_table[i]["su"]+"</td>\n\
               <td id='"+q_table[i]["co"]+"'>"+q_table[i]["co"]+"</td>\n\
               <td id='"+q_table[i]["sc"]+"'>"+q_table[i]["sc"]+"</td>\n\
            </tr>\n";
        }
        table+="</tbody>\n"

        return table
    }

function fill_table(components_number){
        $.ajax({
            method: 'POST',
            url: 'http://127.0.0.1:5001/train-info',
            contentType: 'application/json;charset=UTF-8',
            data: JSON.stringify(
                {
                    'type': "get",
                    'sensor': components_number,
                }),
            dataType: "json",
            success: function (result) {
                console.log(result)

                $("#last_build_name").replaceWith("<div class=\"text-muted\" id=\"last_build_name\">Last Model Build ("+result["last_record"]["model_type"]+")</div>");
                $("#last_build_value").replaceWith("<div class=\"large\" id=\"last_build_value\">"+date_formatter(result["last_record"]["last_build"])+"</div>");

                $("#Energy-2").replaceWith("<td id=\"Energy-2\">"+result["Energy"]["model_name"]+"</td>");
                $("#Energy-3").replaceWith("<td id=\"Energy-3\">"+date_formatter(result["Energy"]["last_build"])+"</td>");
                $("#Energy-4").replaceWith("<td id=\"Energy-4\">"+result["Energy"]["rmse"]+"</td>");
                $("#Energy-5").replaceWith("<td id=\"Energy-5\">"+result["Energy"]["smape"]+"</td>");
                $("#Energy-6").replaceWith("<td id=\"Energy-6\">"+result["Energy"]["mase"]+"</td>");
                $("#Energy-7").replaceWith("<td id=\"Energy-7\">"+result["Energy"]["horizon"]+"min</td>");

                $("#Traffic-2").replaceWith("<td id=\"Traffic-2\">"+result["Traffic"]["model_name"]+"</td>");
                $("#Traffic-3").replaceWith("<td id=\"Traffic-3\">"+date_formatter(result["Traffic"]["last_build"])+"</td>");
                $("#Traffic-4").replaceWith("<td id=\"Traffic-4\">"+result["Traffic"]["rmse"]+"</td>");
                $("#Traffic-5").replaceWith("<td id=\"Traffic-5\">"+result["Traffic"]["smape"]+"</td>");
                $("#Traffic-6").replaceWith("<td id=\"Traffic-6\">"+result["Traffic"]["mase"]+"</td>");
                $("#Traffic-7").replaceWith("<td id=\"Traffic-7\">"+result["Traffic"]["horizon"]+"min</td>");




                for(i=1;i<=components_number;i++){
                    $("#S"+i.toString()+"-1").replaceWith("<td id=\"S"+i.toString()+"-1\">"+result["S"+i.toString()]["model_type"]+"</td>");
                    $("#S"+i.toString()+"-2").replaceWith("<td id=\"S"+i.toString()+"-2\">"+result["S"+i.toString()]["model_name"]+"</td>");
                    $("#S"+i.toString()+"-3").replaceWith("<td id=\"S"+i.toString()+"-3\">"+date_formatter(result["S"+i.toString()]["last_build"])+"</td>");
                    $("#S"+i.toString()+"-4").replaceWith("<td id=\"S"+i.toString()+"-4\">"+result["S"+i.toString()]["rmse"]+"</td>");
                    $("#S"+i.toString()+"-5").replaceWith("<td id=\"S"+i.toString()+"-5\">"+result["S"+i.toString()]["smape"]+"</td>");
                    $("#S"+i.toString()+"-6").replaceWith("<td id=\"S"+i.toString()+"-6\">"+result["S"+i.toString()]["mase"]+"</td>");
                    $("#S"+i.toString()+"-7").replaceWith("<td id=\"S"+i.toString()+"-7\">"+result["S"+i.toString()]["horizon"]+"min</td>");
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
        })
    }
})