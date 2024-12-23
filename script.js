// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getDatabase, ref, set, update, onValue, runTransaction } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCqLjKA9koRQSFR4xMZSPRSGbL2JRFktYo",
  authDomain: "voting-7a6ad.firebaseapp.com",
  databaseURL: "https://voting-7a6ad-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "voting-7a6ad",
  storageBucket: "voting-7a6ad.appspot.com", // 수정된 부분
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
    const resetButton = document.getElementById("reset-button");
    const adminPasswordInput = document.getElementById("admin-password");
    const resultsSection = document.getElementById("results");
    const adminSection = document.getElementById("admin-section");
    const votedMessage = document.getElementById("voted-message");

    const password = "05190519";

    // References to the votes and version in the database
    const votesRef = ref(db, "votes");
    const versionRef = ref(db, "voteVersion");

    // Initialize votes
    let votes = {
        agree: 0,
        disagree: 0
    };

    // Initialize vote version
    let currentVoteVersion = null;

    // Function to initialize votes and version if they don't exist
    function initializeDatabase() {
        set(votesRef, votes)
            .then(() => {
                console.log("Initialized votes in Firebase:", votes);
            })
            .catch((error) => {
                console.error("Error initializing votes:", error);
            });

        set(versionRef, 1)
            .then(() => {
                console.log("Initialized voteVersion in Firebase:", 1);
            })
            .catch((error) => {
                console.error("Error initializing voteVersion:", error);
            });
    }

    // Sync votes from Firebase in real-time
    onValue(votesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            votes = data;
            console.log("Votes updated from Firebase:", votes);
        } else {
            // If no data exists, initialize it in Firebase
            initializeDatabase();
        }
        resultsSection.textContent = `이성민: ${votes.agree}, 안은혜: ${votes.disagree}`;
    }, (error) => {
        console.error("Error fetching votes:", error);
    });

    // Sync voteVersion from Firebase in real-time
    onValue(versionRef, (snapshot) => {
        const data = snapshot.val();
        if (data !== null) {
            currentVoteVersion = Number(data);
            console.log("voteVersion updated from Firebase:", currentVoteVersion);
            checkVotingStatus();
        } else {
            // If no version exists, initialize it
            set(versionRef, 1)
                .then(() => {
                    currentVoteVersion = 1;
                    console.log("Initialized voteVersion in Firebase:", currentVoteVersion);
                })
                .catch((error) => {
                    console.error("Error initializing voteVersion:", error);
                });
        }
    }, (error) => {
        console.error("Error fetching voteVersion:", error);
    });

    // Function to check if user has voted in the current version
    function checkVotingStatus() {
        const votedData = localStorage.getItem("hasVoted");
        console.log("Checking voting status...");
        if (votedData) {
            try {
                const votedObj = JSON.parse(votedData);
                const storedVersion = Number(votedObj.version);
                console.log("VotedObj.version:", storedVersion, "currentVoteVersion:", currentVoteVersion);
                if (storedVersion === currentVoteVersion) {
                    // User has voted in the current version
                    yesButton.disabled = true;
                    noButton.disabled = true;
                    votedMessage.classList.remove("hidden");
                    console.log("User has already voted in the current version.");
                    return;
                }
            } catch (e) {
                console.error("Error parsing hasVoted from localStorage:", e);
            }
        }
        // User has not voted in the current version
        yesButton.disabled = false;
        noButton.disabled = false;
        votedMessage.classList.add("hidden");
        console.log("User has not voted in the current version.");
    }

    // Update votes in Firebase
    function updateVotes() {
        update(votesRef, votes)
            .then(() => {
                console.log("Votes updated in Firebase:", votes);
            })
            .catch((error) => {
                console.error("Error updating votes:", error);
                alert("There was an error updating your vote. Please try again.");
            });
    }

    // Handle vote buttons
    yesButton.addEventListener("click", () => {
        console.log("Yes button clicked!");
        votes.agree++;
        updateVotes();
        alert("Thank you for your vote!");
        // Set voted flag in localStorage with current version
        localStorage.setItem("hasVoted", JSON.stringify({ version: currentVoteVersion }));
        // Disable buttons and show message
        yesButton.disabled = true;
        noButton.disabled = true;
        votedMessage.classList.remove("hidden");
    });

    noButton.addEventListener("click", () => {
        console.log("No button clicked!");
        votes.disagree++;
        updateVotes();
        alert("Thank you for your vote!");
        // Set voted flag in localStorage with current version
        localStorage.setItem("hasVoted", JSON.stringify({ version: currentVoteVersion }));
        // Disable buttons and show message
        yesButton.disabled = true;
        noButton.disabled = true;
        votedMessage.classList.remove("hidden");
    });

    // Handle admin login
    loginButton.addEventListener("click", () => {
        const enteredPassword = adminPasswordInput.value;
        if (enteredPassword === password) {
            console.log("Admin logged in");
            adminSection.classList.remove("hidden");
            document.getElementById("admin-login").classList.add("hidden");
        } else {
            alert("Incorrect password.");
            console.log("Incorrect admin password entered.");
        }
    });

    // Handle reset button
    resetButton.addEventListener("click", () => {
        if (confirm("Are you sure you want to reset the votes?")) {
            // Use transaction to increment voteVersion atomically
            runTransaction(versionRef, (currentData) => {
                if (currentData === null) {
                    return 1;
                } else {
                    return currentData + 1;
                }
            })
            .then((result) => {
                if (!result.committed) {
                    console.log("Transaction not committed");
                    return;
                }
                // 'onValue' listener will handle updating 'currentVoteVersion' and calling 'checkVotingStatus()'
                console.log("voteVersion has been incremented to:", result.snapshot.val());
                // Reset votes
                return set(votesRef, { agree: 0, disagree: 0 });
            })
            .then(() => {
                console.log("Votes have been reset.");
                alert("Votes have been reset. Users can vote again.");
            })
            .catch((error) => {
                console.error("Error resetting votes:", error);
                alert("There was an error resetting the votes. Please try again.");
            });
        }
    });
});
