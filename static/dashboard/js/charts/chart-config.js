function sum(obj){
        return obj.S1+obj.S2+obj.S3+obj.S4+obj.S5+obj.S6+obj.S7+obj.S8+obj.S9+obj.S10+obj.S11+obj.S12+obj.S13+
            obj.S14+obj.S15+obj.S16+obj.S17+obj.S18+obj.S19+obj.S20+obj.S21+obj.S22;
    }

function get_sensor_data(input,sensor){
       var name="S"+sensor.toString();
       return input[name]
    }
