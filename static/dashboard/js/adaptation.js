$(document).ready(function() {
//global variables
    var xvalues_time = [], yvalues_time = [], xvalues_number = [], yvalues_number = [];
    var myLineChart, myLineChart2 = null;
    var current=""
// start and update data
    start();
    setInterval(dataupdate, 30000); // refresh every 30s

    function start() {
        $.ajax({
            method: 'POST',
            url: 'http://127.0.0.1:5002/',
            success: function (result) {
                $("#status").replaceWith("<div id=\"status\"><div class=\"profile-usertitle-status\"><span class=\"indicator label-success\"></span>Online</div> </div>");

                for (var j in result["adaptation_time"]) {
                    xvalues_time.push(result["adaptation_time"][j]["key_as_string"]);
                    yvalues_time.push(result["adaptation_time"][j]["value"]["value"]);
                }

                for (var k in result["adaptation_number"]) {
                    xvalues_number.push(result["adaptation_number"][k]["key_as_string"]);
                    yvalues_number.push(Math.ceil(Number(result["adaptation_number"][k]["value"]["value"])));
                }
                $("#"+result["SA"]).replaceWith("<td id=\"current "+result["SA"]+"\">SA</td>");


                show_time();
                show_number();
                var d = new Date();
                $("#time").replaceWith("<p id=\"time\">" + date_formatter(d) + "</p>");

                var table=define_table(result["q_table"])
                console.log(result)
                $("#adaptation_number").replaceWith("<div class=\"large\" id=\"adaptation_number\">"+result["values"][0]["adaptation_count"]+"</div>");
                $("#energy_saved").replaceWith("<div class=\"large\" id=\"energy_saved\">"+result["values"][0]["energy_saved"]+"</div>");
                $("#traffic_saved").replaceWith("<div class=\"large\" id=\"traffic_saved\">"+result["values"][0]["traffic_saved"]+"</div>");
                $("#current_pattern").replaceWith("<div class=\"large\" id=\"current_pattern\">"+result["pattern"]+"</div>");
                $("#adaptation_time").replaceWith("<div class=\"large\" id=\"adaptation_time\">"+result["values"][0]["adaptation_time"]+" seconds </div>");

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
            url: 'http://127.0.0.1:5002/',
            success: function (result) {
                $("#status").replaceWith("<div id=\"status\"><div class=\"profile-usertitle-status\"><span class=\"indicator label-success\"></span>Online</div> </div>");

                for (var j in result["adaptation_time"]) {
                    xvalues_time.push(result["adaptation_time"][j]["key_as_string"]);
                    yvalues_time.push(result["adaptation_time"][j]["value"]["value"]);
                }

                for (var k in result["adaptation_number"]) {
                    xvalues_number.push(result["adaptation_number"][k]["key_as_string"]);
                    yvalues_number.push(Math.ceil(Number(result["adaptation_number"][k]["value"]["value"])));
                }
                $("#"+result["SA"]).replaceWith("<td id=\"current "+result["SA"]+"\">SA</td>");


                update_number()
                update_time()
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
    function update_time(){
    myLineChart.data.datasets[0].data= yvalues_time;
    myLineChart.data.labels= xvalues_time;
    myLineChart.update();
}
    function update_number(){
    myLineChart2.data.datasets[0].data= yvalues_number;
    myLineChart2.data.labels= xvalues_number;
    myLineChart2.update();
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

})