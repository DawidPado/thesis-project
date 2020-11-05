$(document).ready(function() {
//global variables

// start
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
                console.log(err);
            }
        });
    }

    $('#1-submit').on('click', function(e) {
        e.preventDefault();
        var dataset_path = $('#1-dataset_path').val();
		var number_of_neurons = $('#1-number_of_neurons').val();
		var cross_validation_ratio = $('#1-cross_validation_ratio').val();
		var model_save_path = $('#1-model_save_path').val();
		var number_of_iteration = $('#1-number_of_iteration').val();

		var dataset_path_validation=path_validation(dataset_path);
		var number_of_neurons_validation=number_validation(number_of_neurons);
		var cross_validation_ratio_validation=validate_ratio(cross_validation_ratio);
		var model_save_path_validation=path_validation(model_save_path);
		var number_of_iteration_validation=number_validation(number_of_iteration);

		var validation = dataset_path_validation && number_of_neurons_validation && cross_validation_ratio_validation
        && model_save_path_validation && number_of_iteration_validation;

		 if(validation===true) {
             $.ajax({
                 method: 'POST',
                 url: '/configuration',
                 contentType: 'application/json;charset=UTF-8',
                 data: JSON.stringify(
                     {
                         'type': "Energy Forecaster",
                         'dataset_path': dataset_path,
                         'number_of_neurons': number_of_neurons,
                         'cross_validation_ratio': cross_validation_ratio,
                         'model_save_path': model_save_path,
                         'number_of_iteration': number_of_iteration
                     }),
                 dataType: "json",
                 success: function (data) {
                     console.log(data)
                     if (data.status === "success") {
                         swal({
                             title: "configurations saved sucessfully !",
                             icon: "success",
                             button: "Aww yiss!",
                         });
                     } else {
                         /*
                         $("#error-alert").replaceWith(
                             " <div id=\"error-alert \" >\n" +
                             "                        <span style=\"color:red\">\n" +
                             "                          Wrong username or password  <em class=\"fa fa-warning\"></em>\n" +
                             "                        </span>\n" +
                             "                    </div>"
                         );
                    */
                         alert("worng!")
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
         }


    })
    $('#2-submit').on('click', function(e) {
        e.preventDefault();
        var dataset_path = $('#2-dataset_path').val();
		var number_of_neurons = $('#2-number_of_neurons').val();
		var cross_validation_ratio = $('#2-cross_validation_ratio').val();
		var model_save_path = $('#2-model_save_path').val();
		var number_of_iteration = $('#2-number_of_iteration').val();

		var dataset_path_validation=path_validation(dataset_path);
		var number_of_neurons_validation=number_validation(number_of_neurons);
		var cross_validation_ratio_validation=validate_ratio(cross_validation_ratio);
		var model_save_path_validation=path_validation(model_save_path);
		var number_of_iteration_validation=number_validation(number_of_iteration);

		var validation = dataset_path_validation && number_of_neurons_validation && cross_validation_ratio_validation
        && model_save_path_validation && number_of_iteration_validation;

		 if(validation===true) {
             $.ajax({
                 method: 'POST',
                 url: '/configuration',
                 contentType: 'application/json;charset=UTF-8',
                 data: JSON.stringify(
                     {
                         'type': "Data Traffic Forecaster",
                         'dataset_path': dataset_path,
                         'number_of_neurons': number_of_neurons,
                         'cross_validation_ratio': cross_validation_ratio,
                         'model_save_path': model_save_path,
                         'number_of_iteration': number_of_iteration
                     }),
                 dataType: "json",
                 success: function (data) {
                     console.log(data)
                     if (data.status === "success") {
                         swal("success", {
                             icon: "success",
                             dangerMode: true,
                             buttons: true,
                             confirmButtonText: 'Logout',
                             timer: 10000,
                         })
                     } else {
                         /*
                         $("#error-alert").replaceWith(
                             " <div id=\"error-alert \" >\n" +
                             "                        <span style=\"color:red\">\n" +
                             "                          Wrong username or password  <em class=\"fa fa-warning\"></em>\n" +
                             "                        </span>\n" +
                             "                    </div>"
                         );
                    */
                         alert("worng!")
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
         }
		 else{

         }
    })
    })
    $('#3-submit').on('click', function(e) {
        e.preventDefault();
        var energy_higher_limit = $('#ehl').val();
		var energy_lower_limit = $('#ell').val();
		var traffic_higher_limit = $('#thl').val();
		var traffic_lower_limit = $('#tll').val();
		var reward_list = $('#rl').val();

		var energy_higher_limit_validation=float_validation(energy_higher_limit);
		var energy_lower_limit_validation=float_validation(energy_lower_limit);
		var traffic_higher_limit_validation=float_validation(traffic_higher_limit);
		var traffic_lower_limit_validation=float_validation(traffic_lower_limit);
		var reward_list_validation=reward_validation(reward_list);

		var validation = energy_higher_limit_validation && energy_lower_limit_validation && traffic_higher_limit_validation
        && traffic_lower_limit_validation && reward_list_validation;

		 if(validation===true) {
             $.ajax({
                 method: 'POST',
                 url: '/configuration',
                 contentType: 'application/json;charset=UTF-8',
                 data: JSON.stringify(
                     {
                         'type': "Decision Maker",
                         'energy_higher_limit': energy_higher_limit,
                         'energy_lower_limit': energy_lower_limit,
                         'traffic_higher_limit': traffic_higher_limit,
                         'traffic_lower_limit': traffic_lower_limit,
                         'reward_list': reward_list
                     }),
                 dataType: "json",
                 success: function (data) {
                     console.log(data)
                     if (data.status === "success") {
                         swal("success", {
                             icon: "success",
                             dangerMode: true,
                             buttons: true,
                             confirmButtonText: 'Logout',
                             timer: 10000,
                         })
                     } else {
                         /*
                         $("#error-alert").replaceWith(
                             " <div id=\"error-alert \" >\n" +
                             "                        <span style=\"color:red\">\n" +
                             "                          Wrong username or password  <em class=\"fa fa-warning\"></em>\n" +
                             "                        </span>\n" +
                             "                    </div>"
                         );
                    */
                         alert("worng!")
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
         }
    })


    $('#4-submit').on('click', function(e) {
       e.preventDefault();
        var kafka_host = $('#kah').val();
		var zookeeper_host = $('#zh').val();
		var spark_host = $('#sh').val();
		var elasticsearch_host = $('#eh').val();
		var kibana_host = $('#kih').val();

		var kafka_host_validation=url_validation(kafka_host);
		var zookeeper_host_validation=url_validation(zookeeper_host);
		var spark_host_validation=url_validation(spark_host);
		var elasticsearch_host_validation=url_validation(elasticsearch_host);
		var kibana_host_validation=url_validation(kibana_host);

		var validation = kafka_host_validation && zookeeper_host_validation && spark_host_validation
        && elasticsearch_host_validation && kibana_host_validation;

		 if(validation===true) {
             $.ajax({
                 method: 'POST',
                 url: '/configuration',
                 contentType: 'application/json;charset=UTF-8',
                 data: JSON.stringify(
                     {
                         'type': "Data Pipeline", 'kafka_host': kafka_host, 'zookeeper_host': zookeeper_host,
                         'spark_host': spark_host, 'elasticsearch_host': elasticsearch_host,
                         'kibana_host': kibana_host
                     }),
                 dataType: "json",
                 success: function (data) {
                     console.log(data)
                     if (data.status === "success") {
                         swal("success", {
                             icon: "success",
                             dangerMode: true,
                             buttons: true,
                             confirmButtonText: 'Logout',
                             timer: 10000,
                         })
                     } else {
                         /*
                         $("#error-alert").replaceWith(
                             " <div id=\"error-alert \" >\n" +
                             "                        <span style=\"color:red\">\n" +
                             "                          Wrong username or password  <em class=\"fa fa-warning\"></em>\n" +
                             "                        </span>\n" +
                             "                    </div>"
                         );
                    */
                         alert("worng!")
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
         }
    })