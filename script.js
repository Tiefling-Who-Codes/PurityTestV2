/* Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBJOda2IU8dOm3t6sAEwKOLNZyH4kmBa6Y", // Your API key
  authDomain: "purity-test-803d3.firebaseapp.com", // Your auth domain
  databaseURL: "https://purity-test-803d3-default-rtdb.firebaseio.com", // Your database URL
  projectId: "purity-test-803d3", // Your project ID
  storageBucket: "purity-test-803d3.appspot.com", // Your storage bucket
  messagingSenderId: "793571026689", // Your messaging sender ID
  appId: "1:793571026689:web:b31b91ca11f39f1e355d00" // Your app ID
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(); // Access Firestore
*/
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
function sendDataToFirestore() {
  const name = document.getElementById('userName').value; // Get the name from the input box
  const checkedBoxes = getCheckedBoxIds(); // Get the array of checked IDs
  const score = parseFloat(document.getElementById('percent').textContent); // Get the score

  // Create a map from the array of checked IDs
  const checkedBoxesMap = {};
  checkedBoxes.forEach(id => {
    checkedBoxesMap[id] = true; // Set the value to true for each checked ID
  });

  // Add the document to Firestore
  db.collection('Test Answers').doc(name).set({
    checkedBoxes: checkedBoxesMap, // Store the map in the document
    score: score // Store the score in the document
  })
    .then(() => {
      console.log("Document successfully written!");
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    });
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
function updateScores() {
  const currentScore = parseFloat(document.getElementById('percent').textContent);
  const userName = document.getElementById('userName').value;

  // Get the current 'Dirtiest' and 'Purest' scores from Firestore
  db.collection('Scores').doc('Dirtiest').get()
    .then(doc => {
      let dirtiestScore = doc.data() ? parseFloat(doc.data().score) : 0; // Initialize with 0 if no doc exists
      let dirtiestName = doc.data() ? doc.data().name : "";
      console.log(dirtiestScore)
      db.collection('Scores').doc('Purest').get()
        .then(doc => {
          let purestScore = doc.data() ? parseFloat(doc.data().score) : 100;
          let purestName = doc.data() ? doc.data().name : "";

          // Update 'Dirtiest' if the current score is higher
          console.log(currentScore, dirtiestScore)
          if (currentScore >= dirtiestScore) { // Changed to >=
            console.log(currentScore, dirtiestScore)
            db.collection('Scores').doc('Dirtiest').set({
              name: userName,
              score: currentScore
            })
              .then(() => {
                console.log("Dirtiest score updated successfully");
                dirtiestName = userName; // Update the name
                dirtiestScore = currentScore; // Update the score
                console.log(dirtiestName, dirtiestScore)
                document.getElementById('Dirtiest').textContent = `Dirtiest: ${dirtiestName} (${dirtiestScore}%)`;
                document.getElementById('Purest').textContent = `Purest: ${purestName} (${purestScore}%)`;
              })
              .catch(error => {
                console.error("Error updating Dirtiest score:", error);
              });
          }

          // Update 'Purest' if the current score is lower
          if (currentScore < purestScore) {
            db.collection('Scores').doc('Purest').set({
              name: userName,
              score: currentScore
            })
              .then(() => {
                console.log("Purest score updated successfully");
                purestName = userName; // Update the name
                purestScore = currentScore; // Update the score
                console.log(purestScore, purestName)
                document.getElementById('Dirtiest').textContent = `Dirtiest: ${dirtiestName} (${dirtiestScore}%)`;
                document.getElementById('Purest').textContent = `Purest: ${purestName} (${purestScore}%)`;
              })
              .catch(error => {
                console.error("Error updating Purest score:", error);

              });
          }

          // Display the updated 'Dirtiest' and 'Purest' names and scores on the page
          console.log("D:")
          console.log(dirtiestName, dirtiestScore)
          console.log("P:")
          console.log(purestName, purestScore)
          document.getElementById('Dirtiest').textContent = `Dirtiest: ${dirtiestName} (${dirtiestScore}%)`;
          document.getElementById('Purest').textContent = `Purest: ${purestName} (${purestScore}%)`;
        })
        .catch(error => {
          console.error("Error getting Purest score:", error);
        });
    })
    .catch(error => {
      console.error("Error getting Dirtiest score:", error);
    });
}

// Add an event listener to the button to send data to Firestore
const sendButton = document.getElementById('sendButton'); // Assuming you have a button with id 'sendButton'
if (sendButton) { // Check if the button exists
  sendButton.addEventListener('click', SendButton);
}

function fetchLeaderboardData() {
  db.collection('Scores').doc('Dirtiest').get()
    .then(doc => {
      let dirtiestScore = doc.data() ? parseFloat(doc.data().score) : 0;
      let dirtiestName = doc.data() ? doc.data().name : "";
      document.getElementById('Dirtiest').textContent = `Dirtiest: ${dirtiestName} (${dirtiestScore}%)`;
      db.collection('Scores').doc('Purest').get()
        .then(doc => {
          let purestScore = doc.data() ? parseFloat(doc.data().score) : 100;
          let purestName = doc.data() ? doc.data().name : "";
          document.getElementById('Purest').textContent = `Purest: ${purestName} (${purestScore}%)`;
        })
        .catch(error => {
          console.error("Error getting Purest score:", error);
        });
    })
    .catch(error => {
      console.error("Error getting Dirtiest score:", error);
    });
}
// Event listener for leaderboard button
const leaderboardButton = document.getElementById('LeaderBoard');
if (leaderboardButton) { 
  leaderboardButton.addEventListener('click', fetchLeaderboardData);
}


//*************************************************//
