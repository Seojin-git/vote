import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getDatabase, ref, set, update, onValue } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-app.firebaseapp.com",
    databaseURL: "https://your-database.firebaseio.com",
    projectId: "your-project-id",
    storageBucket: "your-storage-bucket",
    messagingSenderId: "your-messaging-sender-id",
    appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const yesButton = document.getElementById("yes-button");
const noButton = document.getElementById("no-button");
const loginButton = document.getElementById("login-button");
const adminPasswordInput = document.getElementById("admin-password");
const resultsSection = document.getElementById("results");
const adminSection = document.getElementById("admin-section");

const password = "05190519";

// Reference to the database
const votesRef = ref(db, "votes");

// Initialize votes
let votes = {
    agree: 0,
    disagree: 0
};

// Sync votes from Firebase in real-time
onValue(votesRef, (snapshot) => {
    const data = snapshot.val();
    votes = data || { agree: 0, disagree: 0 };
    resultsSection.textContent = `Agree: ${votes.agree}, Disagree: ${votes.disagree}`;
});

// Update votes in Firebase
function updateVotes() {
    update(votesRef, votes);
}

// Handle vote buttons
yesButton.addEventListener("click", () => {
    votes.agree++;
    updateVotes();
    alert("Thank you for your vote!");
});

noButton.addEventListener("click", () => {
    votes.disagree++;
    updateVotes();
    alert("Thank you for your vote!");
});

// Handle admin login
loginButton.addEventListener("click", () => {
    const enteredPassword = adminPasswordInput.value;
    if (enteredPassword === password) {
        adminSection.classList.remove("hidden");
        document.getElementById("admin-login").classList.add("hidden");
    } else {
        alert("Incorrect password.");
    }
});
