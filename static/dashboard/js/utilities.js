
function sum(obj,components_number){
    var sum=0;
    for(i=1;i<=components_number;i++){
        var name="S"+i.toString();
        sum=sum+obj[name]
    }
    return sum;
    }

function get_sensor_data(input,sensor){
       var name="S"+sensor.toString();
       return input[name]
    }

function sensor_iterate(components_number){
    var sensors=[]
    for(i=1;i<=components_number;i++) {
        sensors.push("S" + i.toString());
    }
    return sensors;
}

function fill_data(result,data,components){
    if (data.length==0){
        for (i=0;i<components;i++){
            data[i]=0;
        }
    }
    for(i=1;i<=components;i++){
        var name='S'+i.toString();
        data[i-1]=data[i-1]+result[name];
    }
    return data;
}
function count_components(input){
    var i=0; // beacuse timestamp
    while(true){
        var str='S'+(i+1).toString();
        if(input[str]==null){
            break;
        }
        i++;
    }
    return i;
}
function date_formatter(date,check){
        var formatter="";
        var d = new Date(date)

       formatter+=d.toLocaleDateString()+" ";
        if(check!==true ){
            if(d.getMinutes()<10) {
            formatter += d.getHours() + ":0" + d.getMinutes();
            }
            else{
                formatter += d.getHours()  + ":" + d.getMinutes();
            }
        }
        else {
            formatter += d.getHours() + ":00";
        }
        return formatter;
}
function update_row(result){
    $("#"+result["model_type"]+"-2").replaceWith("<td id=\""+result["model_type"]+"-2\">"+result["model_name"]+"</td>");
    $("#"+result["model_type"]+"-3").replaceWith("<td id=\""+result["model_type"]+"-3\">"+date_formatter(result["last_build"])+"</td>");
    $("#"+result["model_type"]+"-4").replaceWith("<td id=\""+result["model_type"]+"-4\">"+result["rmse"]+"</td>");
    $("#"+result["model_type"]+"-5").replaceWith("<td id=\""+result["model_type"]+"-5\">"+result["smape"]+"</td>");
    $("#"+result["model_type"]+"-6").replaceWith("<td id=\""+result["model_type"]+"-6\">"+result["mase"]+"</td>");
    $("#"+result["model_type"]+"-7").replaceWith("<td id=\""+result["model_type"]+"-7\">"+result["horizon"]+"min</td>");
    $("#"+result["model_type"]+"-button").replaceWith("<button id='"+result["model_type"]+"-button' onclick=\"train('"+result["model_type"]+"')\" class=\"btn btn-sm btn-primary\" type=\"button\">Train</button>");

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
function highlight(value,number){
    for (i=1;i<=number;i++){
        var el = document.getElementById("S"+i);
        el.style.backgroundColor = "#ffffff";
    }
     var el = document.getElementById("Traffic");
    el.style.backgroundColor = "#ffffff";
    var el = document.getElementById("Energy");
    el.style.backgroundColor = "#ffffff";

    var el = document.getElementById(value);
    el.style.backgroundColor = "#cfcdcd";
}
function train(x){
            swal({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 4000,
                icon: 'success',
                title: x+' trainig has started'
            });
                 $("#"+x+"-button").replaceWith("<button id='"+x+"-button' onclick=\"train('S"+i.toString()+"')\" class=\"btn btn-sm btn-primary\" type=\"button\"  disabled><em style='text-align: center' class='fa fa-retweet'></em>  </em></button>");
             $.ajax({
 method: 'POST',
            url: 'http://127.0.0.1:5001/train-info',
contentType: 'application/json;charset=UTF-8',
            data: JSON.stringify(
                {
                    'type': "update",
                    'value': x,
                }),
            dataType: "json",
success: function (result) {
     swal({
         position: 'top-end',
         showConfirmButton: false,
         timer: 4000,
         icon: 'success',
         title: result["model_type"] +' training completed!'
            });
    update_row(result);
     $("#last_build_name").replaceWith("<div class=\"text-muted\" id=\"last_build_name\">Last Model Build ("+result["model_type"]+")</div>");
     $("#last_build_value").replaceWith("<div class=\"large\" id=\"last_build_value\">"+date_formatter(result["last_build"])+"</div>");
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