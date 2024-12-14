// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, update, onValue } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCqLjKA9koRQSFR4xMZSPRSGbL2JRFktYo",
  authDomain: "voting-7a6ad.firebaseapp.com",
  databaseURL: "https://voting-7a6ad-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "voting-7a6ad",
  storageBucket: "voting-7a6ad.firebasestorage.app",
  messagingSenderId: "696254912860",
  appId: "1:696254912860:web:be7d19ef81cb4c81374999",
  measurementId: "G-2M61QWDPP0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Wait for the DOM to fully load before accessing elements
document.addEventListener("DOMContentLoaded", () => {
    const yesButton = document.getElementById("yes-button");
    const noButton = document.getElementById("no-button");
    const loginButton = document.getElementById("login-button");
    const adminPasswordInput = document.getElementById("admin-password");
    const resultsSection = document.getElementById("results");
    const adminSection = document.getElementById("admin-section");

    const password = "05190519";

    // Reference to the votes in the database
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
        console.log("Yes button clicked!"); // Debugging log
        votes.agree++;
        updateVotes();
        alert("Thank you for your vote!");
    });

    noButton.addEventListener("click", () => {
        console.log("No button clicked!"); // Debugging log
        votes.disagree++;
        updateVotes();
        alert("Thank you for your vote!");
    });

    // Handle admin login
    loginButton.addEventListener("click", () => {
        const enteredPassword = adminPasswordInput.value;
        if (enteredPassword === password) {
            console.log("Admin logged in"); // Debugging log
            adminSection.classList.remove("hidden");
            document.getElementById("admin-login").classList.add("hidden");
        } else {
            alert("Incorrect password.");
        }
    });
});
