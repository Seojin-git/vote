const yesButton = document.getElementById("yes-button");
const noButton = document.getElementById("no-button");
const loginButton = document.getElementById("login-button");
const adminPasswordInput = document.getElementById("admin-password");
const resultsSection = document.getElementById("results");
const adminSection = document.getElementById("admin-section");

const password = "05190519";

let votes = {
    agree: 0,
    disagree: 0
};

// Load votes from JSON file
fetch("votes.json")
    .then((response) => response.json())
    .then((data) => {
        votes = data;
    })
    .catch(() => {
        console.error("Could not load votes.json. Using default values.");
    });

// Save votes to JSON file
function saveVotes() {
    const blob = new Blob([JSON.stringify(votes, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "votes.json";
    a.click();
}

// Handle vote buttons
yesButton.addEventListener("click", () => {
    votes.agree++;
    alert("Thank you for your vote!");
    saveVotes();
});

noButton.addEventListener("click", () => {
    votes.disagree++;
    alert("Thank you for your vote!");
    saveVotes();
});

// Handle admin login
loginButton.addEventListener("click", () => {
    const enteredPassword = adminPasswordInput.value;
    if (enteredPassword === password) {
        adminSection.classList.remove("hidden");
        document.getElementById("admin-login").classList.add("hidden");
        resultsSection.textContent = `Agree: ${votes.agree}, Disagree: ${votes.disagree}`;
    } else {
        alert("Incorrect password.");
    }
});
