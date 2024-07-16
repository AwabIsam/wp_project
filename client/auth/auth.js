async function myFetch(url, options) {
	const res = await fetch(`https://127.0.0.1/website/wp_project/server/api${url}.php`, {
		...options,
		body: options.body && JSON.stringify(options.body),
		headers: { "Content-Type": "application/json" },
	});

	const data = await res.json();

	return data;
}

document.getElementById("sign-up")?.addEventListener("click", async (e) => {
	const errMsg = document.getElementById("err-msg-u");
	errMsg.textContent = "";
	e.preventDefault();

	const name = document.getElementById("s-name").value;
	const email = document.getElementById("s-email").value;
	const password = document.getElementById("s-password").value;

	const res = await myFetch(`/signup`, {
		method: "POST",
		body: { name, email, password },
	});

	if (res.status == 200) {
		window.location.replace("dashboard");
	} else if (res.status == 400 || res.status == 409 || res.status == 500) {
		errMsg.textContent = res.msg;
	}
});

document.getElementById("sign-in")?.addEventListener("click", async (e) => {
	const errMsg = document.getElementById("err-msg-i");
	errMsg.textContent = "";
	e.preventDefault();

	const email = document.getElementById("l-email").value;
	const password = document.getElementById("l-password").value;

	const res = await myFetch(`/signin`, {
		method: "POST",
		body: { email, password },
	});

	if (res.status == 200) {
		console.log("redirecting");
		window.location.replace("dashboard");
	} else if (res.status == 404 || res.status == 409 || res.status == 500) {
		errMsg.textContent = res.msg;
	}
});

document.getElementById("logout")?.addEventListener("click", async (e) => {
	e.preventDefault();

	console.log("hoshad");

	const res = await myFetch("/logout", {
		method: "POST",
	});

	console.log(res);

	//! CHANGE LATER

	window.location.href = "/website/wp_project/client/";
});
