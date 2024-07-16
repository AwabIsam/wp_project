async function myFetch(url, options) {
	const res = await fetch(`https://127.0.0.1/website/wp_project/server/api${url}.php`, {
		...options,
		body: options.body && JSON.stringify(options.body),
		headers: { "Content-Type": "application/json" },
	});

	const data = await res.json();

	return data;
}

document.addEventListener("onloadAdminComplete", () => {
	document.querySelectorAll(".delete-btn").forEach((elem) => {
		elem.addEventListener("click", async (e) => {
			const id = e.currentTarget.id.split("_")[0];

			const res = await myFetch("/deleteUser", {
				method: "POST",
				body: { id },
			});

			if (res.status == "200") {
				document.getElementById(id).remove();
			} else {
				document.getElementById("admin_err_msg").textContent = res.msg;
			}
		});
	});
});
