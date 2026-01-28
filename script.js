import { collection, doc, setDoc, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Function to count checked checkboxes and create an array of checked IDs
var D1sc;
var D1nm;
var P1sc;
var P1nm;




function countCheckedCheckboxes() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  let checkedCount = 0;
  let checkedBoxIds = []; // Initialize an empty array to store checked IDs

  checkboxes.forEach((checkbox, index) => {
    if (checkbox.checked) {
      checkedCount++;
      checkedBoxIds.push(index + 1); // Add the ID (index + 1) to the array
    }
  });

  document.getElementById('checkedCount').textContent = checkedCount;
  document.getElementById('percent').textContent = ((checkedCount / 50) * 100).toFixed(0);
  message(checkedCount);
}






// Helper function to get an array of checked checkbox IDs
function getCheckedBoxIds() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  let checkedBoxIds = [];
  checkboxes.forEach((checkbox, index) => {
    if (checkbox.checked) {
      checkedBoxIds.push(index + 1);
    }
  });
  return checkedBoxIds;
}

// Function to display the message based on the number of checked checkboxes
function message(checkedCount) {
  let message;
  let percent = ((checkedCount / 50) * 100).toFixed(0); // Calculate percentage here
  if (percent >= 95) {
    message = "Damn Slut";
  } else if (percent >= 85) {
    message = "Thats extreme, are you sure you didn't click any on accident";
  } else if (percent >= 50) {
    message = "Damn you do like getting dirty."
  } else if (percent >= 25) {
    message = "You've been getting a little adventurous"
  } else {
    message = "You're a pure soul, you make a preist jelous."
  }
  document.getElementById('message').textContent = message; // Set the message text
}

// Function to send data to Firestore
async function sendDataToFirestore() {
  const name = document.getElementById('userName').value; // Get the name from the input box
  const checkedBoxes = getCheckedBoxIds(); // Get the array of checked IDs
  const score = parseFloat(document.getElementById('percent').textContent); // Get the score

  // Create a map from the array of checked IDs
  const checkedBoxesMap = {};
  checkedBoxes.forEach(id => {
    checkedBoxesMap[id] = true; // Set the value to true for each checked ID
  });

  try {
    // Add the document to Firestore
    await setDoc(doc(window.db, 'Test Answers', name), {
      checkedBoxes: checkedBoxesMap, // Store the map in the document
      score: score // Store the score in the document
    });
    console.log("Document successfully written!");
  } catch (error) {
    console.error("Error writing document: ", error);
  }
}


// Add event listeners to all checkboxes to update the count when they change
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
checkboxes.forEach(checkbox => {
  checkbox.addEventListener('change', countCheckedCheckboxes);
});


/***************************************************/
function SendButton() {
  sendDataToFirestore();
  updateScores(); // Call the updateScores function here
}

// Function to update the 'Dirtiest' and 'Purest' scores
async function updateScores() {
  const currentScore = parseFloat(document.getElementById('percent').textContent);
  const userName = document.getElementById('userName').value;

  try {
    // Get the current 'Dirtiest' score from Firestore
    const dirtiestDoc = await getDoc(doc(window.db, 'Scores', 'Dirtiest'));
    let dirtiestScore = dirtiestDoc.exists() ? parseFloat(dirtiestDoc.data().score) : 0;
    let dirtiestName = dirtiestDoc.exists() ? dirtiestDoc.data().name : "";
    console.log(dirtiestScore);

    // Get the current 'Purest' score from Firestore
    const purestDoc = await getDoc(doc(window.db, 'Scores', 'Purest'));
    let purestScore = purestDoc.exists() ? parseFloat(purestDoc.data().score) : 100;
    let purestName = purestDoc.exists() ? purestDoc.data().name : "";

    // Update 'Dirtiest' if the current score is higher
    console.log(currentScore, dirtiestScore);
    if (currentScore >= dirtiestScore) {
      console.log(currentScore, dirtiestScore);
      await setDoc(doc(window.db, 'Scores', 'Dirtiest'), {
        name: userName,
        score: currentScore
      });
      console.log("Dirtiest score updated successfully");
      dirtiestName = userName;
      dirtiestScore = currentScore;
      console.log(dirtiestName, dirtiestScore);
    }

    // Update 'Purest' if the current score is lower
    if (currentScore < purestScore) {
      await setDoc(doc(window.db, 'Scores', 'Purest'), {
        name: userName,
        score: currentScore
      });
      console.log("Purest score updated successfully");
      purestName = userName;
      purestScore = currentScore;
      console.log(purestScore, purestName);
    }

    // Display the updated 'Dirtiest' and 'Purest' names and scores on the page
    console.log("D:");
    console.log(dirtiestName, dirtiestScore);
    console.log("P:");
    console.log(purestName, purestScore);
    document.getElementById('Dirtiest').textContent = `Dirtiest: ${dirtiestName} (${dirtiestScore}%)`;
    document.getElementById('Purest').textContent = `Purest: ${purestName} (${purestScore}%)`;
  } catch (error) {
    console.error("Error updating scores:", error);
  }
}

// Add an event listener to the button to send data to Firestore
const sendButton = document.getElementById('sendButton'); // Assuming you have a button with id 'sendButton'
if (sendButton) { // Check if the button exists
  sendButton.addEventListener('click', SendButton);
}

async function fetchLeaderboardData() {
  try {
    const dirtiestDoc = await getDoc(doc(window.db, 'Scores', 'Dirtiest'));
    let dirtiestScore = dirtiestDoc.exists() ? parseFloat(dirtiestDoc.data().score) : 0;
    let dirtiestName = dirtiestDoc.exists() ? dirtiestDoc.data().name : "";
    document.getElementById('Dirtiest').textContent = `Dirtiest: ${dirtiestName} (${dirtiestScore}%)`;

    const purestDoc = await getDoc(doc(window.db, 'Scores', 'Purest'));
    let purestScore = purestDoc.exists() ? parseFloat(purestDoc.data().score) : 100;
    let purestName = purestDoc.exists() ? purestDoc.data().name : "";
    document.getElementById('Purest').textContent = `Purest: ${purestName} (${purestScore}%)`;
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
  }
}
// Event listener for leaderboard button
const leaderboardButton = document.getElementById('LeaderBoard');
if (leaderboardButton) { 
  leaderboardButton.addEventListener('click', fetchLeaderboardData);
}


//*************************************************//
