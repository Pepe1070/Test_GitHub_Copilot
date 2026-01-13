document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Fetch and display activities
  async function loadActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();
      renderActivities(activities);
      populateSignupOptions(activities);
    } catch (error) {
      activitiesList.innerHTML = "<p>Error loading activities.</p>";
    }
  }

  // Render activity cards with participants section
  function renderActivities(activities) {
    activitiesList.innerHTML = "";
    for (const [name, details] of Object.entries(activities)) {
      const card = document.createElement("div");
      card.className = "activity-card";
      card.innerHTML = `
                <h4>${name}</h4>
                <p><strong>Description:</strong> ${details.description}</p>
                <p><strong>Schedule:</strong> ${details.schedule}</p>
                <p><strong>Max Participants:</strong> ${details.max_participants}</p>
                <div class="participants">
                    <h5>Participants:</h5>
                    <ul>
                        ${details.participants.length > 0 
                          ? details.participants.map(p => `<li>${p}</li>`).join('') 
                          : '<li>No participants yet.</li>'}
                    </ul>
                </div>
            `;
      activitiesList.appendChild(card);
    }
  }

  // Populate signup form options
  function populateSignupOptions(activities) {
    activitySelect.innerHTML = '<option value="">-- Select an activity --</option>';
    for (const name of Object.keys(activities)) {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      activitySelect.appendChild(option);
    }
  }

  // Handle signup form submission
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const activity = activitySelect.value;
    messageDiv.className = "hidden";

    try {
      const response = await fetch(`/activities/${activity}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      messageDiv.textContent = result.message;
      messageDiv.className = "message success";
      loadActivities(); // Refresh to show updated participants
    } catch (error) {
      messageDiv.textContent = error.message || "Signup failed.";
      messageDiv.className = "message error";
    }
  });

  loadActivities();
});
