document.addEventListener("DOMContentLoaded", async function () {
	const res = await fetch(`https://127.0.0.1/website/wp_project/server/api/auth.php`, {
		method: "GET",
		headers: { "Content-Type": "application/json" },
	});

	const data = await res.json();

	const protectedRoutes = [
		"/website/wp_project/client/dashboard/",
		"/website/wp_project/client/about/",
		"/website/wp_project/client/admin/",
		"/website/wp_project/client/friends/",
		"/website/wp_project/client/friends/search/",
	];

	if (data.status == 401 && protectedRoutes.find((route) => route === window.location.pathname)) {
		//! CHANGE LATER

		window.location.href = "/website/wp_project/client";
	} else if (data.status == 200 && !protectedRoutes.find((route) => route === window.location.pathname)) {
		window.location.href = "/website/wp_project/client/dashboard";
	}

	document.getElementById("route_to_admin").addEventListener("click", async (e) => {
		e.preventDefault();

		const res = await fetch(`https://127.0.0.1/website/wp_project/server/api/isAdmin.php`, {
			method: "GET",
			headers: { "Content-Type": "application/json" },
		});

		const data = await res.json();

		if (data.role.admin_control) {
			window.location.href = "/website/wp_project/client/admin";
		} else {
			document.getElementById("admin_err_message").textContent = "Unauthorized";
		}
	});
});
