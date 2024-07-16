async function myFetch(url, options) {
	const res = await fetch(`https://127.0.0.1/website/wp_project/server/api${url}.php`, {
		...options,
		body: options.body && JSON.stringify(options.body),
		headers: { "Content-Type": "application/json" },
	});

	const data = await res.json();

	return data;
}

window.onload = async () => {
	const res = await myFetch("/getAllUsers", {
		method: "GET",
	});

	if (res.status == "200") {
		res.users.forEach((user) => {
			document.getElementById("users").innerHTML += `
            <div id="${user.id}" class="user">
                <p>${user.name}</p>
                <button id="${user.id}_delete" class="delete-btn">
                    Delete
                </button>
            </div>`;
		});
	} else {
		document.getElementById("dashboard_err_msg").textContent = "Server Error. Try again later.";
	}

	document.dispatchEvent(new Event("onloadAdminComplete"));
};
