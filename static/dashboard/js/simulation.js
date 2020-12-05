$(document).ready(function() {
//global variables
// start
    start();
    function start(){
          $.ajax({
            method: 'POST',
            url: 'http://127.0.0.1:5000/configuration',
            success: function (result) {
                $("#status").replaceWith("<div id=\"status\"><div class=\"profile-usertitle-status\"><span class=\"indicator label-success\"></span>Online</div> </div>");
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
    $('#upload').on('click', function () {
        var form_data = new FormData($('#form')[0]);
        var simulation = $('#simulation').val();
        var sensors = $('#sensors').val();
        var patterns = $('#patterns').val();
        var a = number_validation(simulation);
        var b = number_validation(sensors);
        var c = number_validation(patterns);
        var validation = a && b && c;
        var status = false; // verify if file was uploaded

        if (validation) {
            var x = "", y = ""
            $.ajax({
                type: 'POST',
                url: 'http://127.0.0.1:5003/file',
                data: form_data,
                contentType: false,
                cache: false,
                processData: false,
                success: function (data) {
                    console.log(data)
                    if (data["status"] === "success") {
                        x = "file uploaded "
                    }

                },
            });
            $.ajax({
                method: 'POST',
                url: 'http://127.0.0.1:5003/data',
                contentType: 'application/json;charset=UTF-8',
                data: JSON.stringify(
                    {
                        'simulation': simulation,
                        'sensors': sensors,
                        'patterns': patterns
                    }),
                dataType: "json",
                success: function (data) {
                    if (x.length > 0) {
                        y = "and configuration saved successfully"
                    } else {
                        y = "configuration saved successfully"
                    }
                    var z = x + y
                    console.log(z)
                    swal({
                        title: z,
                        icon: "success",
                        button: "ok",
                    });
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
    })
    $('#start').on('click', function () {
        $.ajax({

            method: 'POST',
            url: 'http://127.0.0.1:5000/simulation',
            contentType: 'application/json;charset=UTF-8',
            data: JSON.stringify(
                {
                    'simulation': "on"
                }),
            dataType: "json",
            success: function (data) {
                if (data.status === "success") {
                    $("#stop").attr("disabled", false);
                    $("#start").attr("disabled", true);
                    swal({
                        title: "the simulation has started",
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
    })
    $('#stop').on('click', function () {
        $.ajax({

            method: 'POST',
            url: 'http://127.0.0.1:5000/simulation',
            contentType: 'application/json;charset=UTF-8',
            data: JSON.stringify(
                {
                    'simulation': "off"
                }),
            dataType: "json",
            success: function (data) {
                if (data.status === "success") {
                    $("#start").attr("disabled", false);
                    $("#stop").attr("disabled", true);
                    swal({
                        title: "the simulation has stopped",
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
    })
})