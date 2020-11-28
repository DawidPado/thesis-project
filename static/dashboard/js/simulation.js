
    $('#upload').on('click', function () {
       var form_data = new FormData($('#form')[0]);
       var simulation = $('#simulation').val();
        var sensors = $('#sensors').val();
        var patterns = $('#patterns').val();
        var a = number_validation(simulation);
        var b = number_validation(sensors);
        var c = number_validation(patterns);
         var validation = a && b && c;
         var status=false; // verify if file was uploaded
         if(validation){
        $.ajax({
            type: 'POST',
            url: 'http://127.0.0.1:5003/file',
            data: form_data,
                contentType: false,
                cache: false,
                processData: false,
            success: function (data) {
                console.log(data)
                if(data["status"]==='done')
                status = true
                if(status){
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
                    console.log(data)
                    if (data.status === "success") {
                        swal({
                            title: "simulation saved successfully !",
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
        }
            },
        });

        }
    })

