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
	const res = await myFetch("/getUserData", {
		method: "GET",
	});

	if (res.status == "200") {
		document.getElementById("username").textContent = res.user.name;
		document.getElementById("email").textContent = res.user.email;
		res.workouts.forEach((workout) => {
			const descriptions = JSON.parse(workout.description)
				?.map((desc) => `<p>${desc}</p>`)
				.join("");
			document.querySelector(".workouts").innerHTML += `<div id="${workout.workoutId}" class="workout-section">
                    <div class="workout-meta">
                        <h3 id="${workout.workoutId}_title">${workout.title}</h3>
                        <div class="workout-meta">
                            <button class="status_btn" id="${workout.workoutId}_${workout.status}">
                                ${
									workout.status === "completed"
										? `
									<i class="fa-solid fa-toggle-on" style="font-size: 1.5rem; color: #4dd52b;"></i>	
									<i class="fa-solid fa-toggle-off hidden" style="font-size: 1.5rem; color: #883434;"></i>
									`
										: `
									<i class="fa-solid fa-toggle-on hidden" style="font-size: 1.5rem; color: #4dd52b;"></i>
									<i class="fa-solid fa-toggle-off" style="font-size: 1.5rem; color: #883434;"></i>
									`
								}
                            </button>
                            <p>
								Due: 
								<span id="${workout.workoutId}_due">${workout.due}</span>
							</p>
                            <p class="priority">
								Priority: 
								<span id="${workout.workoutId}_priority">${workout.priority}</span>
							</p>
                            <button class="edit_btn" id="${workout.workoutId}_edit"><i class="fa-solid fa-pen" style="color:#26710C"></i></button>
                            <button class="delete_btn" id="${
								workout.workoutId
							}_delete"><i class="fa-solid fa-trash" style="color:#883434"></i></button>
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

	document.dispatchEvent(new Event("onloadComplete"));
};
