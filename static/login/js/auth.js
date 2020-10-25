$(document).ready(function() {

	$('#loginSubmit').on('click', function(e) {
		e.preventDefault();

		var username = $('#username').val();
		var password = $('#password').val();
				$.ajax({
					method: 'POST',
					url: '/login',
					contentType: 'application/json;charset=UTF-8',
					data: JSON.stringify({'username': username, 'password': password}),
					dataType: "json",
					success: function(data) {
					    if (data.status=="success") {
					    	/*if($('#ckb1').is(':checked')){
					    		document.cookie = "username="+username;
					    		document.cookie = "password="+password;
							}*/
                            window.location.href = "http://127.0.0.1:5000/";
                        }
					    else{

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
						400: function(response) {
                            console.log(response);
						}
					},
					error: function(err) {
					    window.location.href = "http://127.0.0.1:5000/login/";
						console.log(err);
					}
				});
	});

	$('#logout').on('click', function(e) {
		e.preventDefault();

		$.ajax({
			url: '/logout',
			dataType: "json",
			success: function(data) {
				localStorage.setItem('loggedin', 0);
				$('#sign').show();
				$('#logoff').hide();
				$('#msg').html('<span style="color: green;">You are logged off</span>');
			},
			error: function(err) {
				console.log(err);
			}
		});
	});
});

