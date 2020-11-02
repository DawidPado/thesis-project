//logout
	$('#logout').on('click', function(e) {
		e.preventDefault();
		if(confirm("Do you really want to logout?")) {


			$.ajax({
				url: 'http://127.0.0.1:5000/logout',
				method: 'POST',
				success: function (data) {
					window.location.href = "http://127.0.0.1:5000/login/";
				},
				error: function (err) {
					console.log(err);
				}
			});
		}
	});