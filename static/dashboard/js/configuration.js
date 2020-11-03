$(document).ready(function() {
//global variables

// start and update data
    start();

// start and update function
    function start() {
        $.ajax({
            method: 'POST',
            url: 'http://127.0.0.1:5000/configuration',
            success: function (result) {
                console.log(result.data_traffic_forecaster.dataset_path)
                //Energy Forecaster Configurations
                $("#1-dataset_path").replaceWith("<input type=\"text\" name=\"regular\" class=\"form-control\" id=\"1-dataset_path\" value=\""+result.energy_forecaster.dataset_path+"\">");
                $("#1-number_of_neurons").replaceWith("<input type=\"text\" name=\"regular\" class=\"form-control\" id=\"1-number_of_neurons\" value=\""+result.energy_forecaster.number_of_neurons+"\">")
                $("#1-cross_validation_ratio").replaceWith("<input type=\"text\" name=\"regular\" class=\"form-control\" id=\"1-cross_validation_ratio\" value=\""+result.energy_forecaster.cross_validation_ratio+"\">")
                $("#1-model_save_path").replaceWith("<input type=\"text\" name=\"regular\" class=\"form-control\" id=\"1-model_save_path\" value=\""+result.energy_forecaster.model_save_path+"\">")
                $("#1-number_of_iteration").replaceWith("<input type=\"text\" name=\"regular\" class=\"form-control\" id=\"1-number_of_iteration\" value=\""+result.energy_forecaster.number_of_iteration+"\">")
                //Data Traffic Forecaster Configurations
                $("#2-dataset_path").replaceWith("<input type=\"text\" name=\"regular\" class=\"form-control\" id=\"2-dataset_path\" value=\""+result.data_traffic_forecaster.dataset_path+"\">")
                $("#2-number_of_neurons").replaceWith("<input type=\"text\" name=\"regular\" class=\"form-control\" id=\"2-number_of_neurons\" value=\""+result.data_traffic_forecaster.number_of_neurons+"\">")
                $("#2-cross_validation_ratio").replaceWith("<input type=\"text\" name=\"regular\" class=\"form-control\" id=\"2-cross_validation_ratio\" value=\""+result.data_traffic_forecaster.cross_validation_ratio+"\">")
                $("#2-model_save_path").replaceWith("<input type=\"text\" name=\"regular\" class=\"form-control\" id=\"2-model_save_path\" value=\""+result.data_traffic_forecaster.model_save_path+"\">")
                $("#2-number_of_iteration").replaceWith("<input type=\"text\" name=\"regular\" class=\"form-control\" id=\"2-number_of_iteration\" value=\""+result.data_traffic_forecaster.number_of_iteration+"\">")
                //Decision Maker Configuration
                $("#ehl").replaceWith("<input type=\"text\" name=\"regular\" class=\"form-control\" id=\"ehl\" value=\""+result.decision_maker.energy_higher_limit+"\">")
                $("#ell").replaceWith("<input type=\"text\" name=\"regular\" class=\"form-control\" id=\"ell\" value=\""+result.decision_maker.energy_lower_limit+"\">")
                $("#thl").replaceWith("<input type=\"text\" name=\"regular\" class=\"form-control\" id=\"thl\" value=\""+result.decision_maker.traffic_higher_limit+"\">")
                $("#tll").replaceWith("<input type=\"text\" name=\"regular\" class=\"form-control\" id=\"tll\" value=\""+result.decision_maker.traffic_lower_limit+"\">")
                $("#rl").replaceWith("<input type=\"text\" name=\"regular\" class=\"form-control\" id=\"rl\" value=\""+result.decision_maker.reward_list+"\">")
                //Data Pipeline Configurations
                $("#kah").replaceWith("<input type=\"url\" name=\"regular\" class=\"form-control\" id=\"kah\" value=\""+result.data_pipeline.kafka_host+"\">")
                $("#zh").replaceWith("<input type=\"url\" name=\"regular\" class=\"form-control\" id=\"zh\" value=\""+result.data_pipeline.zookeeper_host+"\">")
                $("#sh").replaceWith("<input type=\"url\" name=\"regular\" class=\"form-control\" id=\"sh\" value=\""+result.data_pipeline.spark_host+"\">")
                $("#eh").replaceWith("<input type=\"url\" name=\"regular\" class=\"form-control\" id=\"eh\" value=\""+result.data_pipeline.elasticsearch_host+"\">")
                $("#kih").replaceWith("<input type=\"url\" name=\"regular\" class=\"form-control\" id=\"kih\" value=\""+result.data_pipeline.kibana_host+"\">")
            },
            statusCode: {
                400: function (response) {
                    console.log(response);
                }

            },
            error: function (err) {
                window.location.href = "http://127.0.0.1:5000/login/";
            }
        });
    }

})