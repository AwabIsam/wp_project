async function myFetch(url, options) {
	const res = await fetch(`https://127.0.0.1/website/wp_project/server/api${url}.php`, {
		...options,
		body: options.body && JSON.stringify(options.body),
		headers: { "Content-Type": "application/json" },
	});

	const data = await res.json();

	return data;
}

document.addEventListener("onloadFriendsComplete", () => {
	function viewFriendsFlow() {
		document.querySelectorAll(".friend-icon").forEach((elem) => {
			elem.addEventListener("click", (e) => {
				const id = e.currentTarget.id.split("_")[0];

				location.href = `/website/wp_project/client/friends/search/?id=${id}`;
			});
		});
	}
	viewFriendsFlow();

	function searchUsersFlow() {
		document.getElementById("friends_err_msg").innerText = "";
		document.getElementById("search_icon_friends").addEventListener("click", async () => {
			if (!document.getElementById("search-results-friends").classList.contains("hidden")) {
				document.getElementById("search-results-friends").classList.add("hidden");
			} else {
				const searchTerm = document.getElementById("searchTerm").value;

				const res = await myFetch("/searchUsers", {
					method: "POST",
					body: { searchTerm },
				});

				console.log(res);

				if (res.status == "200") {
					document.getElementById("search-results-friends").classList.toggle("hidden");
					document.getElementById("search-results-friends").innerHTML = "";
					res.users.forEach((user) => {
						document.getElementById("search-results-friends").innerHTML += `
                            <button id=${user.id} class="friend-icon-search">
                                <p>${user.name}</p>
                                <hr>
                            </button>
                        `;
					});

					document.querySelectorAll(".friend-icon-search").forEach((elem) => {
						elem.addEventListener("click", (e) => {
							const id = e.currentTarget.id;

							location.href = `/website/wp_project/client/friends/search/?id=${id}`;
						});
					});
				} else {
					document.getElementById("friends_err_msg").textContent = res.msg;
				}
			}
		});
	}
	searchUsersFlow();

	function removeFriendFlow() {
		document.querySelectorAll(".remove-icon").forEach((elem) => {
			elem.addEventListener("click", async (e) => {
				const id = e.currentTarget.id.split("_")[0];
				const friendId = e.currentTarget.id.split("_")[1];

				const res = await myFetch("/removeFriend", {
					method: "POST",
					body: { id },
				});

				console.log(res);

				if (res.status == "200") {
					document.getElementById(`${friendId}_${id}`).remove();
				} else {
					document.getElementById("friends_err_msg").textContent = res.msg;
				}
			});
		});
	}
	removeFriendFlow();

	function addFriendFlow() {
		document.querySelectorAll(".add-icon").forEach((elem) => {
			elem.addEventListener("click", async (e) => {
				const friendId = e.currentTarget.id.split("_")[0];
				const friendName = e.currentTarget.id.split("_")[1];

				const res = await myFetch("/addFriend", {
					method: "POST",
					body: { friendId, friendName },
				});

				console.log(res);

				if (res.status == "200") {
					document.getElementById(friendId)?.remove();
					document.getElementById("friends-list").innerHTML = "";
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
					removeFriendFlow();
					viewFriendsFlow();
				} else {
					document.getElementById("friends_err_msg").textContent = res.msg;
				}
			});
		});
	}
	addFriendFlow();
});
