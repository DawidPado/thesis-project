//logout
$('#logout').on('click', function(e) {
		e.preventDefault();
	swal("Do you really want to logout?", {
		icon: "warning",
		dangerMode: true,
  		buttons: true,
		confirmButtonText: 'Logout',
		timer: 10000,
		}).then((value) => {
		if(value===true){
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
	});