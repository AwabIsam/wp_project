async function myFetch(url, options) {
	const res = await fetch(`https://127.0.0.1/website/wp_project/server/api${url}`, {
		...options,
		body: options.body && JSON.stringify(options.body),
		headers: { "Content-Type": "application/json" },
	});

	const data = await res.json();

	return data;
}

window.onload = async () => {
	const res = await myFetch(`/getFriendData.php?id=${location.search.split("=")[1]}`, {
		method: "GET",
	});

	if (res.status == "200") {
		document.getElementById("username").textContent = res.user.name;
		document.getElementById("email").textContent = res.user.email;
		res.workouts.forEach((workout) => {
			const descriptions = JSON.parse(workout.description)
				?.map((desc) => `<p>${desc}</p>`)
				.join("");
			document.querySelector(".workouts").innerHTML += `<div style="margin-top: 1rem;" id="${workout.workoutId}" class="workout-section">
                    <div class="workout-meta">
                        <h3 id="${workout.workoutId}_title">${workout.title}</h3>
                        <div style="padding: 1rem 0;" class="workout-meta">
                            <p>
								Due: 
								<span id="${workout.workoutId}_due">${workout.due}</span>
							</p>
                            <p class="priority">
								Priority: 
								<span id="${workout.workoutId}_priority">${workout.priority}</span>
							</p>
                        </div>
                    </div>
                    <hr>
                    <div id="${workout.workoutId}_desc" class="workout-details">
                        ${descriptions}
                    </div>
                </div>`;
		});
	} else {
		document.getElementById("dashboard_err_msg").textContent = "Server Error. Try again later.";
	}
};
