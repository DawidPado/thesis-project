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