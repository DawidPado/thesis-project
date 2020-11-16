$(document).ready(function() {
//global variables
// start
    start();
    setInterval(checkonline, 30000);
// start and update function
    function start() {

        $.ajax({
            method: 'POST',
            url: 'http://127.0.0.1:5000/configuration',
            success: function (result) {

                $("#status").replaceWith("<div id=\"status\"><div class=\"profile-usertitle-status\"><span class=\"indicator label-success\"></span>Online</div> </div>");
                //Energy Forecaster Configurations
                $("#1-dataset_path").replaceWith("<input type=\"text\" name=\"regular\" class=\"form-control\" id=\"1-dataset_path\" value=\"" + result.energy_forecaster.dataset_path + "\">");
                $("#1-number_of_neurons").replaceWith("<input type=\"text\" name=\"regular\" class=\"form-control\" id=\"1-number_of_neurons\" value=\"" + result.energy_forecaster.number_of_neurons + "\">")
                $("#1-cross_validation_ratio").replaceWith("<input type=\"text\" name=\"regular\" class=\"form-control\" id=\"1-cross_validation_ratio\" value=\"" + result.energy_forecaster.cross_validation_ratio + "\">")
                $("#1-model_save_path").replaceWith("<input type=\"text\" name=\"regular\" class=\"form-control\" id=\"1-model_save_path\" value=\"" + result.energy_forecaster.model_save_path + "\">")
                $("#1-number_of_iteration").replaceWith("<input type=\"text\" name=\"regular\" class=\"form-control\" id=\"1-number_of_iteration\" value=\"" + result.energy_forecaster.number_of_iteration + "\">")
                //Data Traffic Forecaster Configurations
                $("#2-dataset_path").replaceWith("<input type=\"text\" name=\"regular\" class=\"form-control\" id=\"2-dataset_path\" value=\"" + result.data_traffic_forecaster.dataset_path + "\">")
                $("#2-number_of_neurons").replaceWith("<input type=\"text\" name=\"regular\" class=\"form-control\" id=\"2-number_of_neurons\" value=\"" + result.data_traffic_forecaster.number_of_neurons + "\">")
                $("#2-cross_validation_ratio").replaceWith("<input type=\"text\" name=\"regular\" class=\"form-control\" id=\"2-cross_validation_ratio\" value=\"" + result.data_traffic_forecaster.cross_validation_ratio + "\">")
                $("#2-model_save_path").replaceWith("<input type=\"text\" name=\"regular\" class=\"form-control\" id=\"2-model_save_path\" value=\"" + result.data_traffic_forecaster.model_save_path + "\">")
                $("#2-number_of_iteration").replaceWith("<input type=\"text\" name=\"regular\" class=\"form-control\" id=\"2-number_of_iteration\" value=\"" + result.data_traffic_forecaster.number_of_iteration + "\">")
                //Decision Maker Configuration
                $("#ehl").replaceWith("<input type=\"text\" name=\"regular\" class=\"form-control\" id=\"ehl\" value=\"" + result.decision_maker.energy_higher_limit + "\">")
                $("#ell").replaceWith("<input type=\"text\" name=\"regular\" class=\"form-control\" id=\"ell\" value=\"" + result.decision_maker.energy_lower_limit + "\">")
                $("#thl").replaceWith("<input type=\"text\" name=\"regular\" class=\"form-control\" id=\"thl\" value=\"" + result.decision_maker.traffic_higher_limit + "\">")
                $("#tll").replaceWith("<input type=\"text\" name=\"regular\" class=\"form-control\" id=\"tll\" value=\"" + result.decision_maker.traffic_lower_limit + "\">")
                $("#rl").replaceWith("<input type=\"text\" name=\"regular\" class=\"form-control\" id=\"rl\" value=\"" + result.decision_maker.reward_list + "\">")
                //Data Pipeline Configurations
                $("#kah").replaceWith("<input type=\"url\" name=\"regular\" class=\"form-control\" id=\"kah\" value=\"" + result.data_pipeline.kafka_host + "\">")
                $("#zh").replaceWith("<input type=\"url\" name=\"regular\" class=\"form-control\" id=\"zh\" value=\"" + result.data_pipeline.zookeeper_host + "\">")
                $("#sh").replaceWith("<input type=\"url\" name=\"regular\" class=\"form-control\" id=\"sh\" value=\"" + result.data_pipeline.spark_host + "\">")
                $("#eh").replaceWith("<input type=\"url\" name=\"regular\" class=\"form-control\" id=\"eh\" value=\"" + result.data_pipeline.elasticsearch_host + "\">")
                $("#kih").replaceWith("<input type=\"url\" name=\"regular\" class=\"form-control\" id=\"kih\" value=\"" + result.data_pipeline.kibana_host + "\">")
                var d = new Date();
                $("#time").replaceWith("<p id=\"time\">"+date_formatter(d)+"</p>");
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

    $('#1-submit').on('click', function () {
        var dataset_path = $('#1-dataset_path').val();
        var number_of_neurons = $('#1-number_of_neurons').val();
        var cross_validation_ratio = $('#1-cross_validation_ratio').val();
        var model_save_path = $('#1-model_save_path').val();
        var number_of_iteration = $('#1-number_of_iteration').val();

        var a = path_validation(dataset_path);
        var b = number_validation(number_of_neurons);
        var c = validate_ratio(cross_validation_ratio);
        var d = path_validation(model_save_path);
        var e = number_validation(number_of_iteration);

        var validation = a && b && c && d && e;

        if (validation === true) {
            val = $('.fg-1');
            validation_success_all(val)
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
                            button: "ok",
                        });
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
            });
        } else {
            var title = "wrong or blank input of:"
            var message = "";
            if (a) {
                var val = $('.fg-1-a')
                validation_success(val)
            } else {
                var val = $('.fg-1-a')
                validation_fail(val)
                message = append_message(message, "Dataset Path")
            }
            if (b) {
                var val = $('.fg-1-b')
                validation_success(val)

            } else {
                var val = $('.fg-1-b')
                validation_fail(val)
                message = append_message(message, "Number of Neurons")
            }
            if (c) {
                var val = $('.fg-1-c')
                validation_success(val)
            } else {
                var val = $('.fg-1-c')
                validation_fail(val)
                message = append_message(message, "Cross Validation Ratio")
            }
            if (d) {
                var val = $('.fg-1-d')
                validation_success(val)
            } else {
                var val = $('.fg-1-d')
                validation_fail(val)
                message = append_message(message, "Model Save Path")
            }
            if (e) {
                var val = $('.fg-1-e')
                validation_success(val)
            } else {
                var val = $('.fg-1-e')
                validation_fail(val)
                message = append_message(message, "Number of Iteration")

            }
            swal({
                title: title,
                text: message,
                icon: "error",
                button: "close",
            });
        }

    })
    $('#2-submit').on('click', function () {
        var dataset_path = $('#2-dataset_path').val();
        var number_of_neurons = $('#2-number_of_neurons').val();
        var cross_validation_ratio = $('#2-cross_validation_ratio').val();
        var model_save_path = $('#2-model_save_path').val();
        var number_of_iteration = $('#2-number_of_iteration').val();

        var a = path_validation(dataset_path);
        var b = number_validation(number_of_neurons);
        var c = validate_ratio(cross_validation_ratio);
        var d = path_validation(model_save_path);
        var e = number_validation(number_of_iteration);

        var validation = a && b && c && d && e;

        if (validation === true) {
            var val = $('.fg-2');
            validation_success_all(val)
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
                        swal({
                            title: "configurations saved sucessfully !",
                            icon: "success",
                            button: "ok",
                        });
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
        } else {
            var title = "wrong or blank input of:"
            var message = "";
            if (a) {
                var val = $('.fg-2-a')
                validation_success(val)
            } else {
                var val = $('.fg-2-a')
                validation_fail(val)
                message = append_message(message, "Dataset Path")
            }
            if (b) {
                var val = $('.fg-2-b')
                validation_success(val)

            } else {
                var val = $('.fg-2-b')
                validation_fail(val)
                message = append_message(message, "Number of Neurons")
            }
            if (c) {
                var val = $('.fg-2-c')
                validation_success(val)
            } else {
                var val = $('.fg-2-c')
                validation_fail(val)
                message = append_message(message, "Cross Validation Ratio")
            }
            if (d) {
                var val = $('.fg-2-d')
                validation_success(val)
            } else {
                var val = $('.fg-2-d')
                validation_fail(val)
                message = append_message(message, "Model Save Path")
            }
            if (e) {
                var val = $('.fg-2-e')
                validation_success(val)
            } else {
                var val = $('.fg-2-e')
                validation_fail(val)
                message = append_message(message, "Number of Iteration")

            }
             swal({
                title: title,
                text: message,
                icon: "error",
                button: "close!",
            });
        }
    })

    $('#3-submit').on('click', function () {
        var energy_higher_limit = $('#ehl').val();
        var energy_lower_limit = $('#ell').val();
        var traffic_higher_limit = $('#thl').val();
        var traffic_lower_limit = $('#tll').val();
        var reward_list = $('#rl').val();

        var a = float_validation(energy_higher_limit);
        var b = float_validation(energy_lower_limit);
        var c = float_validation(traffic_higher_limit);
        var d = float_validation(traffic_lower_limit);
        var e = reward_validation(reward_list);

        var validation = a && b && c && d && e;

        if (validation === true) {
            var val = $('.fg-3');
            validation_success_all(val)
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
                       swal({
                            title: "configurations saved sucessfully !",
                            icon: "success",
                            button: "ok",
                        });
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
        } else {
            var title = "wrong or blank input of:"
            var message = ""
            if (a) {
                var val = $('.fg-3-a')
                validation_success(val)
            } else {
                var val = $('.fg-3-a')
                validation_fail(val)
                 message =append_message(message, "Energy Higher Limit")
            }
            if (b) {
                var val = $('.fg-3-b')
                validation_success(val)

            } else {
                var val = $('.fg-3-b')
                validation_fail(val)
                 message =append_message(message, "Energy Lower Limit")
            }
            if (c) {
                var val = $('.fg-3-c')
                validation_success(val)
            } else {
                var val = $('.fg-3-c')
                validation_fail(val)
                 message =append_message(message, "Traffic Higher Limit")
            }
            if (d) {
                var val = $('.fg-3-d')
                validation_success(val)
            } else {
                var val = $('.fg-3-d')
                validation_fail(val)
                 message =append_message(message, "Traffic Lower Limit")
            }
            if (e) {
                var val = $('.fg-3-e')
                validation_success(val)
            } else {
                var val = $('.fg-3-e')
                validation_fail(val)
                 message =append_message(message, "Reward List")

            }
            swal({
                title: title,
                text: message,
                icon: "error",
                button: "close",
            });
        }

    })


    $('#4-submit').on('click', function () {
        var kafka_host = $('#kah').val();
        var zookeeper_host = $('#zh').val();
        var spark_host = $('#sh').val();
        var elasticsearch_host = $('#eh').val();
        var kibana_host = $('#kih').val();

        var a = url_validation(kafka_host);
        var b = url_validation(zookeeper_host);
        var c = url_validation(spark_host);
        var d = url_validation(elasticsearch_host);
        var e = url_validation(kibana_host);

        var validation = a && b && c && d && e;

        if (validation === true) {
            var val = $('.fg-4');
            validation_success_all(val)
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
                        swal({
                            title: "configurations saved sucessfully !",
                            icon: "success",
                            button: "ok",
                        });
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
        } else {
            var title = "wrong or blank input of:"
            var message = ""
            if (a) {
                var val = $('.fg-4-a')
                validation_success(val)
            } else {
                var val = $('.fg-4-a')
                validation_fail(val)
                 message =append_message(message, "Kafka Host")
            }
            if (b) {
                var val = $('.fg-4-b')
                validation_success(val)

            } else {
                var val = $('.fg-4-b')
                validation_fail(val)
                 message =append_message(message, "Zookeeper Host")
            }
            if (c) {
                var val = $('.fg-4-c')
                validation_success(val)
            } else {
                var val = $('.fg-4-c')
                validation_fail(val)
                 message =append_message(message, "Spark Host")
            }
            if (d) {
                var val = $('.fg-4-d')
                validation_success(val)
            } else {
                var val = $('.fg-4-d')
                validation_fail(val)
                 message =append_message(message, "Elasticsearch Host")
            }
            if (e) {
                var val = $('.fg-4-e')
                validation_success(val)
            } else {
                var val = $('.fg-4-e')
                validation_fail(val)
                 message =append_message(message, "Kibana Host")

            }
            swal({
                title: title,
                text: message,
                icon: "error",
                button: "close",
            });
        }
    })
})
function checkonline(){
    var d = new Date();

    $.ajax({

        method: 'POST',
        url: 'http://127.0.0.1:5000/configuration',
        success: function (result) {
            $("#time").replaceWith("<p id=\"time\">"+date_formatter(d)+"</p>");
        },
        error: function (err) {
            offline(err)
        }
    })
}
$('#refresh-content').on('click', function(e) {
		e.preventDefault();
		checkonline()
	});
//other function
    function validation_success(val) {
        $(val).removeClass('has-error');
        $(val).addClass('has-success');
    }

    function validation_success_all(val) {
        $(val).removeClass('has-success');
        $(val).removeClass('has-error');
    }

    function validation_fail(val) {
        $(val).removeClass('has-success');
        $(val).addClass('has-error');
    }

    function append_message(message, input) {
        if (!message.length > 0) {
            message += input;
        } else {
            message += ", " + input;
        }
        return message;
    }
