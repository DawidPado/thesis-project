//logout
$('#logout').on('click', function(e) {
		e.preventDefault();
	var x =	 swal("Do you really want to logout?", {
		icon: "warning",
		dangerMode: true,
  		buttons: true,
		confirmButtonText: 'Logout',
		timer: 10000,
		});

	console.log(x.value)
	/*	if(confirm("Do you really want to logout?")) {


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
		}*/
	});