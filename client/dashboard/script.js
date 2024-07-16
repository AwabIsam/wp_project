async function myFetch(url, options) {
	const res = await fetch(`https://127.0.0.1/website/wp_project/server/api${url}.php`, {
		...options,
		body: options.body && JSON.stringify(options.body),
		headers: { "Content-Type": "application/json" },
	});

	const data = await res.json();

	return data;
}

document.addEventListener("onloadComplete", () => {
	// ! PRIORITY FILTER

	document.getElementById("filter_priority").addEventListener("change", (e) => {
		const priority = e.currentTarget.value;
		const workouts = document.querySelector(".workouts").children;
		const newWorkouts = [];

		for (let i = 0; i < workouts.length; i++) {
			const elem = workouts[i];
			if (priority === "high") {
				const elem_priority = elem.children[0].children[1].children[2].firstElementChild.textContent;

				if (elem_priority === "high") {
					newWorkouts.push(elem);
				}
			} else if (priority === "medium") {
				const elem_priority = elem.children[0].children[1].children[2].firstElementChild.textContent;

				if (elem_priority === "medium") {
					newWorkouts.push(elem);
				}
			} else if (priority === "low") {
				const elem_priority = elem.children[0].children[1].children[2].firstElementChild.textContent;

				if (elem_priority === "low") {
					newWorkouts.push(elem);
				}
			}
		}

		for (let i = 0; i < workouts.length; i++) {
			const elem = workouts[i];
			if (priority === "high") {
				const elem_priority = elem.children[0].children[1].children[2].firstElementChild.textContent;

				if (elem_priority !== "high") {
					newWorkouts.push(elem);
				}
			} else if (priority === "medium") {
				const elem_priority = elem.children[0].children[1].children[2].firstElementChild.textContent;

				if (elem_priority !== "medium") {
					newWorkouts.push(elem);
				}
			} else if (priority === "low") {
				const elem_priority = elem.children[0].children[1].children[2].firstElementChild.textContent;

				if (elem_priority !== "low") {
					newWorkouts.push(elem);
				}
			}
		}

		if (newWorkouts.length > 0) {
			document.querySelector(".workouts").innerHTML = "";
			newWorkouts.forEach((workout) => {
				document.querySelector(".workouts").appendChild(workout);
			});
		}
	});

	// ! STATUS FILTER

	document.getElementById("filter_status").addEventListener("change", (e) => {
		const status = e.currentTarget.value;
		const workouts = document.querySelector(".workouts").children;
		const newWorkouts = [];

		for (let i = 0; i < workouts.length; i++) {
			const elem = workouts[i];
			if (status === "completed") {
				const elem_status = elem.children[0].children[1].children[0].children[0].classList.contains("hidden") ? "pending" : "completed";

				if (elem_status === "completed") {
					newWorkouts.push(elem);
				}
			} else if (status === "pending") {
				const elem_status = elem.children[0].children[1].children[0].children[0].classList.contains("hidden") ? "pending" : "completed";

				if (elem_status === "pending") {
					newWorkouts.push(elem);
				}
			}
		}

		for (let i = 0; i < workouts.length; i++) {
			const elem = workouts[i];
			if (status === "completed") {
				const elem_status = elem.children[0].children[1].children[0].children[0].classList.contains("hidden") ? "pending" : "completed";

				if (elem_status !== "completed") {
					newWorkouts.push(elem);
				}
			} else if (status === "pending") {
				const elem_status = elem.children[0].children[1].children[0].children[0].classList.contains("hidden") ? "pending" : "completed";

				if (elem_status !== "pending") {
					newWorkouts.push(elem);
				}
			}
		}

		if (newWorkouts.length > 0) {
			document.querySelector(".workouts").innerHTML = "";
			newWorkouts.forEach((workout) => {
				document.querySelector(".workouts").appendChild(workout);
			});
		}
	});

	// ! DUE FILTER

	document.getElementById("filter_due_date").addEventListener("change", (e) => {
		const due_date = e.currentTarget.value;
		const workouts = document.querySelector(".workouts").children;
		const newWorkouts = [];

		for (let i = 0; i < workouts.length; i++) {
			const elem = workouts[i];
			const elem_due_date = elem.children[0].children[1].children[1].children[0].textContent;
			if (due_date === elem_due_date) {
				newWorkouts.push(elem);
			}
		}

		for (let i = 0; i < workouts.length; i++) {
			const elem = workouts[i];
			const elem_due_date = elem.children[0].children[1].children[1].children[0].textContent;
			if (due_date !== elem_due_date) {
				newWorkouts.push(elem);
			}
		}

		if (newWorkouts.length > 0) {
			document.querySelector(".workouts").innerHTML = "";
			newWorkouts.forEach((workout) => {
				document.querySelector(".workouts").appendChild(workout);
			});
		}
	});

	// ! STATUS BTN

	async function updateStatus(e) {
		e.preventDefault();

		const workoutId = e.currentTarget.id.split("_")[0];
		const status = e.currentTarget.id.split("_")[1];

		const res = await myFetch("/updateWorkoutStatus", {
			method: "POST",
			body: { workoutId, status: status === "completed" ? "pending" : "completed" },
		});

		console.log(res);
		if (res.status == "200") {
			const descriptions = JSON.parse(res.workout.description)
				?.map((desc) => `<p>${desc}</p>`)
				.join("");

			document.getElementById(workoutId).innerHTML = `<div class="workout-meta">
		<h3>${res.workout.title}</h3>
		<div class="workout-meta">
			<button class="status_btn" id="${res.workout.workoutId}_${res.workout.status}">
				${
					res.workout.status === "completed"
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
			<p>Due: ${res.workout.due}</p>
			<p id="priority">Priority: ${res.workout.priority}</p>
			<button><i class="fa-solid fa-pen" style="color:#26710C"></i></button>
			<button><i class="fa-solid fa-trash" style="color:#883434"></i></button>
		</div>
	</div>
	<hr>
	<div class="workout-details">
		${descriptions}
	</div>`;
		} else {
			document.getElementById("dashboard_err_msg").textContent = "Server Error. Try again later.";
		}
		document.querySelectorAll(".status_btn").forEach((elem) => {
			elem.removeEventListener("click", updateStatus);
			elem.addEventListener("click", updateStatus);
		});
	}

	function updateStatusFlow() {
		document.querySelectorAll(".status_btn").forEach((elem) => {
			elem.addEventListener("click", updateStatus);
		});
	}
	updateStatusFlow();

	// ! DELETE BTN

	function deletingWorkoutFlow() {
		document.querySelectorAll(".delete_btn").forEach((elem) => {
			elem.addEventListener("click", async (e) => {
				e.preventDefault();

				const workoutId = e.currentTarget.id.split("_")[0];

				const res = await myFetch("/deleteWorkout", {
					method: "POST",
					body: { workoutId },
				});

				if (res.status == "200") {
					document.getElementById(workoutId).remove();
				} else {
					document.getElementById("dashboard_err_msg").textContent = "Server Error. Try again later.";
				}
			});
		});
	}
	deletingWorkoutFlow();

	// ! ADD BTN

	document.getElementById("add_workout_btn").addEventListener("click", (e) => {
		document.getElementById("add_modal").classList.remove("hidden");
		document.body.style.overflow = "hidden";

		document.getElementById("add_close_btn")?.addEventListener("click", (e) => {
			e.preventDefault();
			document.getElementById("add_modal").classList.add("hidden");
			document.body.style.overflow = "auto";
		});

		document.getElementById("add_desc").addEventListener("click", () => {
			document.getElementById("desc_add_list").innerHTML += `<input type="text" class="add_desc" placeholder="Enter description">`;
		});

		document.getElementById("submit_add_btn").addEventListener("click", async () => {
			e.preventDefault();

			const title = document.getElementById("add_title").value;
			const descriptions = document.querySelectorAll(".add_desc");
			const priority = document.getElementById("add_priority").value;
			const due = document.getElementById("add_due").value;

			const desc = [];
			descriptions.forEach((elem) => desc.push(elem.value));

			console.log(title, desc, priority, due);

			const res = await myFetch("/addWorkout", {
				method: "POST",
				body: { title, due, priority, desc },
			});

			console.log(res);
			if (res.status == "200") {
				const newDescriptions = JSON.parse(res.workout.description)
					?.map((desc) => `<p>${desc}</p>`)
					.join("");

				document.querySelector(".workouts").innerHTML += `<div id="${res.workout.workoutId}" class="workout-section">
                    <div class="workout-meta">
                        <h3 id="${res.workout.workoutId}_title">${res.workout.title}</h3>
                        <div class="workout-meta">
                            <button class="status_btn" id="${res.workout.workoutId}_${res.workout.status}">
                                ${
									res.workout.status === "completed"
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
								<span id="${res.workout.workoutId}_due">${res.workout.due}</span>
							</p>
                            <p class="priority">
								Priority: 
								<span id="${res.workout.workoutId}_priority">${res.workout.priority}</span>
							</p>
                            <button class="edit_btn" id="${res.workout.workoutId}_edit"><i class="fa-solid fa-pen" style="color:#26710C"></i></button>
                            <button class="delete_btn" id="${
								res.workout.workoutId
							}_delete"><i class="fa-solid fa-trash" style="color:#883434"></i></button>
                        </div>
                    </div>
                    <hr>
                    <div id="${res.workout.workoutId}_desc" class="workout-details">
                        ${newDescriptions}
                    </div>
                </div>`;
				document.getElementById("add_modal").classList.add("hidden");
				document.body.style.overflow = "auto";
				updateStatusFlow();
				edittingWorkoutsFlow();
				deletingWorkoutFlow();
			} else {
				document.getElementById("dashboard_err_msg").textContent = "Server Error, couldn't change. Try again later.";
			}
		});
	});

	// ! EDIT BTN
	// ! EDIT BUTTON WORKS ONCE, IF THE UI UPDATES IT STOPS WORKING
	function edittingWorkoutsFlow() {
		document.querySelectorAll(".edit_btn").forEach((elem) => {
			elem.addEventListener("click", (e) => {
				document.getElementById("edit_modal").classList.remove("hidden");
				document.body.style.overflow = "hidden";

				const workoutId = e.currentTarget.id.split("_")[0];

				const oldTitle = document.getElementById(`${workoutId}_title`).textContent;
				const oldDesc = document.getElementById(`${workoutId}_desc`);
				const oldPriority = document.getElementById(`${workoutId}_priority`).textContent;
				const oldDue = document.getElementById(`${workoutId}_due`).textContent;

				let descriptions = [];
				for (let i = 0; i < oldDesc.children.length; i++) {
					const child = oldDesc.children[i];
					descriptions.push(`<input type="text" class="edit_desc" value="${child.textContent}">
				`);
				}

				descriptions = descriptions.join("");

				document.querySelector(".edit_container").innerHTML = `<div>
					<h3>Edit workout</h3>
					<button id="edit_close_btn"><i class="fa-solid fa-x"
							style="font-size: 1.2rem; color: #883434;"></i></button>
				</div>
				<label for="edit_title">Title: </label>
				<input type="text" id="edit_title" value="${oldTitle}">
				<label for="edit_desc">Description: </label>
				<div id="desc_edit_list">
					${descriptions}
				</div>
				<button id="add_edit_desc"><i class="fa-solid fa-circle-plus" style="font-size: 1rem;
						color: #ffffff;"></i></button>
				<label for="priority">Priority: </label>
				<select name="priority" id="edit_priority">
					<option value="${oldPriority}">${oldPriority}...</option>
					<option value="high">High</option>
					<option value="medium">Medium</option>
					<option value="low">Low</option>
				</select>
				<label for="edit_due">Due Date: </label>
				<input type="date" id="edit_due" value="${oldDue}">
				<button id="submit_edit_btn">Submit</button>`;

				document.getElementById("edit_close_btn")?.addEventListener("click", (e) => {
					e.preventDefault();
					document.getElementById("edit_modal").classList.add("hidden");
					document.body.style.overflow = "auto";
				});

				document.getElementById("add_edit_desc").addEventListener("click", () => {
					document.getElementById("desc_edit_list").innerHTML += `<input type="text" class="edit_desc" placeholder="Enter description">`;
				});

				document.getElementById("submit_edit_btn").addEventListener("click", async () => {
					e.preventDefault();

					const title = document.getElementById("edit_title").value;
					const descriptions = document.querySelectorAll(".edit_desc");
					const priority = document.getElementById("edit_priority").value;
					const due = document.getElementById("edit_due").value;

					const desc = [];
					descriptions.forEach((elem) => desc.push(elem.value));

					const res = await myFetch("/editWorkout", {
						method: "POST",
						body: { workoutId, title, due, priority, desc },
					});

					const newDescriptions = JSON.parse(res.workout.description)
						?.map((desc) => `<p>${desc}</p>`)
						.join("");

					if (res.status == "200") {
						document.getElementById(workoutId).innerHTML = `<div class="workout-meta">
					<h3 id="${res.workout.workoutId}_title">${res.workout.title}</h3>
					<div class="workout-meta">
						<button class="status_btn" id="${res.workout.workoutId}_${res.workout.status}">
							${
								res.workout.status === "completed"
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
							<span id="${res.workout.workoutId}_due">${res.workout.due}</span>
						</p>
						<p class="priority">
							Priority: 
							<span id="${res.workout.workoutId}_priority">${res.workout.priority}</span>
						</p>
						<button class="edit_btn" id="${res.workout.workoutId}_edit"><i class="fa-solid fa-pen" style="color:#26710C"></i></button>
						<button class="delete_btn" id="${res.workout.workoutId}_delete"><i class="fa-solid fa-trash" style="color:#883434"></i></button>
					</div>
				</div>
				<hr>
				<div id="${res.workout.workoutId}_desc" class="workout-details">
					${newDescriptions}
				</div>`;
						document.getElementById("edit_modal").classList.add("hidden");
						document.body.style.overflow = "auto";
						updateStatusFlow();
						edittingWorkoutsFlow();
						deletingWorkoutFlow();
					} else {
						document.getElementById("dashboard_err_msg").textContent = "Server Error, couldn't change. Try again later.";
					}
				});
			});
		});
	}
	edittingWorkoutsFlow();
});
