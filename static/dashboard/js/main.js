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
function offline(err){
	$("#status").replaceWith("<div id=\"status\"><div class=\"profile-usertitle-status\"><span class=\"indicator label-danger\"></span>Offline</div> </div>");
	$(".main").replaceWith("<div class=\"col-sm-9 col-sm-offset-3 col-lg-10 col-lg-offset-2 main\">\n" +
                    "<div class=\"col-sm-12 text-center\">"+
                    "<h1>Something went wrong</h1> <p>please try to reload page or contact server admin</p> " +
                    "</div>"+
                    "    <div class=\"row\">\n" +
                    "\t\t\t\t<div class=\"col-sm-12 text-center\">\n" +
                    "\t\t\t\t\t<p class=\"back-link\">Thesis project of <a href=\"https://github.com/Xardas7/thesis-project\">Dawid Pado</a></p>\n" +
                    "\t\t\t\t</div>\n" +
                    "\t\t\t</div><!--/.row-->\n" +
                    "    </div>");
	console.log(err)
}

