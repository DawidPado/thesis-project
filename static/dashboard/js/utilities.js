
function sum(obj,components_number,custom){
    var sum=0;
    for(i=1;i<=components_number;i++){
        var name="S"+i.toString();
        if(custom){ //if get data with different timestamp that now
            sum=sum+Number(obj[name]["value"].toFixed(2))
        }
        else{
            sum=sum+obj[name]
        }

    }
    return sum;
    }

function get_sensor_data(input,sensor,custom){
       var name="S"+sensor.toString();
       if(custom){
           return (input[name]["value"].toFixed(2))
       }
       return input[name]
    }

function sensor_iterate(components_number){
    var sensors=[]
    for(i=1;i<=components_number;i++) {
        sensors.push("S" + i.toString());
    }
    return sensors;
}

function fill_data(result,data,components,custom){
    if (data.length==0){
        for (i=0;i<components;i++){
            data[i]=0;
        }
    }
    if(custom){
        for(i=1;i<=components;i++){
        var name='S'+i.toString();
        data[i-1]=data[i-1]+Number(result[name]["value"].toFixed(2));
    }
    }
    else{
       for(i=1;i<=components;i++){
        var name='S'+i.toString();
        data[i-1]=data[i-1]+result[name];
    }
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
function update_row(result){
    $("#"+result["model_type"]+"-2").replaceWith("<td id=\""+result["model_type"]+"-2\">"+result["model_name"]+"</td>");
    $("#"+result["model_type"]+"-3").replaceWith("<td id=\""+result["model_type"]+"-3\">"+date_formatter(result["last_build"])+"</td>");
    $("#"+result["model_type"]+"-4").replaceWith("<td id=\""+result["model_type"]+"-4\">"+result["rmse"]+"</td>");
    $("#"+result["model_type"]+"-5").replaceWith("<td id=\""+result["model_type"]+"-5\">"+result["smape"]+"</td>");
    $("#"+result["model_type"]+"-6").replaceWith("<td id=\""+result["model_type"]+"-6\">"+result["mase"]+"</td>");
    $("#"+result["model_type"]+"-7").replaceWith("<td id=\""+result["model_type"]+"-7\">"+result["horizon"]+"min</td>");

    $("#Energy-button").replaceWith("<button id='"+result["model_type"]+"-button' onclick=\"train('"+result["model_type"]+"')\" class=\"btn btn-sm btn-primary\" type=\"button\" disabled>Train</button>");
    $("#Traffic-button").replaceWith("<button id='"+result["model_type"]+"-button' onclick=\"train('"+result["model_type"]+"')\" class=\"btn btn-sm btn-primary\" type=\"button\" disabled>Train</button>");
    for(i=1;i<=22; i++){
        if("S"+i.toString()===result["model_type"]){
            continue;
        }
            $("#S"+i.toString()+"-button").replaceWith("<button id='"+result["model_type"]+"-button' onclick=\"train('"+result["model_type"]+"')\" class=\"btn btn-sm btn-primary\" type=\"button\" disabled>Train</button>");
    }
}
function train(x){
            swal({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 4500,
                icon: 'success',
                title: x+' trainig has started'
            });
                 $("#"+x+"-button").replaceWith("<button id='"+x+"-button' onclick=\"train('S"+i.toString()+"')\" class=\"btn btn-sm btn-primary\" type=\"button\"  disabled>Train  </em></button>");
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
         title: result["model_type"] +' training started!'
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