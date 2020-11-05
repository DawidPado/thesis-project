$(document).ready(function() {
var input = $('.validate-input .input100');

$('.validate-form .input100').each(function(){
        $(this).focus(function(){
           hideValidate(this);
        });
    });

    function validate (input) {
        if($(input).attr('type') == 'username' || $(input).attr('name') == 'username') {
            if($(input).val().trim().match(/^(([a-z]+[A-Z]*[0-9]*)+|([a-z]*[A-Z]+[0-9]*)+)$/) == null) {
                return false;
            }
        }
        else {
            if($(input).val().trim() == ''){
                return false;
            }
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }

	$('#loginSubmit').on('click', function(e) {
		e.preventDefault();
		var check=true;
		var username = $('#username').val();
		var password = $('#password').val();
		 var input = $('.validate-input .input100');
		for(var i=0; i<input.length; i++) {
            if(validate(input[i]) === false){
                showValidate(input[i]);
                check=false;
            }
        }
		if (check===true) {
			$.ajax({
				method: 'POST',
				url: '/login',
				contentType: 'application/json;charset=UTF-8',
				data: JSON.stringify({'username': username, 'password': password}),
				dataType: "json",
				success: function (data) {
					if (data.status == "success") {
						/*if($('#ckb1').is(':checked')){
                            document.cookie = "username="+username;
                            document.cookie = "password="+password;
                        }*/
						window.location.href = "http://127.0.0.1:5000/";
					} else {

						$("#error-alert").replaceWith(
							" <div id=\"error-alert \" >\n" +
							"                        <span style=\"color:red\">\n" +
							"                          Wrong username or password  <em class=\"fa fa-warning\"></em>\n" +
							"                        </span>\n" +
							"                    </div>"
						);
						//	alert( $.cookie("username") );
					}
				},
				statusCode: {
					400: function (response) {
						console.log(response);
					}
				},
				error: function (err) {
					window.location.href = "http://127.0.0.1:5000/login/";
					console.log(err);
				}
			});
		}
	});


});

