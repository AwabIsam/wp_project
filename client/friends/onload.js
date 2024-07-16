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
	const res = await myFetch("/getFriends", {
		method: "GET",
	});

	if (res.status == "200") {
		res.friends?.forEach((friend) => {
			document.getElementById("friends-list").innerHTML += `<li id="${friend.friendId}_${friend.id}">
                <span>${friend.friendName}</span>
                <div>
                    <button id="${friend.friendId}_view" class="friend-icon"><i class="fas fa-users"></i></button>
                    <button id="${friend.id}_${friend.friendId}_friend" class="remove-icon"><i class="fas fa-user-minus"></i></button>
                </div>
            </li>
            `;
		});

		res.users?.forEach((user) => {
			document.getElementById("users-list").innerHTML += `<li id="${user.id}">
                <span>${user.name}</span>
                <div>
                    <button id="${user.id}_view" class="friend-icon"><i class="fas fa-users"></i></button>
                    <button id="${user.id}_${user.name}_user" class="add-icon"><i class="fas fa-user-plus"></i></button>
                </div>
            </li>
            `;
		});
	} else {
		document.getElementById("dashboard_err_msg").textContent = "Server Error. Try again later.";
	}

	document.dispatchEvent(new Event("onloadFriendsComplete"));
};
