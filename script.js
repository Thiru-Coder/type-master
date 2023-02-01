// Getting Time Limit Contents
let durationText = document.querySelector(".timeData");
let timeContainer = document.getElementById("timer");

//Getting Popup Contents
let popup = document.querySelector("#popup");

let accuracyContainer = document.getElementById("accuracy");

let accuracyValue = document.querySelector(".accuracyData");

let errorValue = document.querySelector(".errorsData");

//Get Characters Per Minute Data
let cpmValue = document.querySelector(".cpmData");

//Get Words Per Minute Data
let wpmValue = document.querySelector(".wpmData");

let restartBtn = document.getElementById("restartBtn");

//Get Paragraph Text and Prevent from clicking
let paragraphText = document.getElementById("paragraph");
paragraphText.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

// User Input from Text Area
let userInput = document.getElementById("userInput");

// Main Container
let mainContainer = document.getElementById("mainContainer");

// Progress-bar
let progressBar = document.getElementById("progressBar");

// Set Time Limit to Complete the Type Game
let duration = 60;

// Paragraph Content to Type
let paragraph =
  "The greatest glory in living lies not in never falling, but in rising every time we fall.";
// "Thiruvalluvan";

// For Time and Accuracy
let timeRemaining = duration;
let timeSpent = 0;
let totalErrors = 0;
let errors = 0;
let accuracy = 0;
let characterTyped = 0;
let timer = null;

/****** Variables Above *******/

function createSpanForParagraph() {
  paragraphText.textContent = null;

  // Get every characters as a separate span by splitting them
  paragraph.split("").forEach((char) => {
    const charSpan = document.createElement("span");
    charSpan.innerText = char;
    paragraphText.appendChild(charSpan);
  });
}

function handleInput() {
  // get current input text and split it
  currentInput = userInput.value;
  currentInputArray = currentInput.split("");

  // increment total characters typed
  characterTyped++;

  paragraphSpanArray = paragraphText.querySelectorAll("span");

  checkForErrors();

  // number of errors
  errorValue.textContent = totalErrors + errors;

  // update accuracy value of user input
  let correctCharacters = characterTyped - (totalErrors + errors);
  let accuracyVal = (correctCharacters / characterTyped) * 100;
  accuracyValue.textContent = Math.round(accuracyVal);

  checkIfComplete(currentInputArray.length, paragraphSpanArray.length, errors);
}

// Check for Errors and highlight respective colors

function checkForErrors() {
  errors = 0;

  paragraphSpanArray.forEach((char, index) => {
    let typedChar = currentInputArray[index];

    // character not currently typed
    if (typedChar == null) {
      char.classList.remove("correctInput");
      char.classList.remove("wrongInput");

      // correct character with green highlight
    } else if (typedChar === char.innerText) {
      char.classList.add("correctInput");
      char.classList.remove("wrongInput");

      // incorrect character with red highlight
    } else {
      char.classList.add("wrongInput");
      char.classList.remove("correctInput");

      // increment errors
      errors++;
    }
  });
}

// Checking if paragraph is completed with accuracy within time limit

function checkIfComplete(typed, paragraph, errorCount) {
  // console.log(typed, paragraph, errorCount);

  if (typed === paragraph && errorCount === 0) {
    accuracyContainer.classList.add("full"); // Add BG effects only accurate within time limit
    gameComplete();
  }
}

// First Function to be called from textarea

function startGame() {
  resetValues();
  createSpanForParagraph();
  progressBar.style.animationDuration = `${duration}s`;
  progressBar.classList.add("active");

  // clear and start a new timer
  clearInterval(timer);
  timer = setInterval(updateTimer, 1000);
}

// Called from First function as well as reset button
function resetValues() {
  timeContainer.className = "more";
  mainContainer.classList.remove("overlay");
  accuracyContainer.className = "";

  timeRemaining = duration;
  timeSpent = 0;
  errors = 0;
  totalErrors = 0;
  accuracy = 0;
  characterTyped = 0;
  userInput.disabled = false;

  userInput.value = "";
  paragraphText.textContent = "Click below to start the game.";
  accuracyValue.textContent = 100;
  durationText.textContent = timeRemaining + "s";
  errorValue.textContent = 0;
  popup.style.display = "none";
}

// Called from First function for every one second

function updateTimer() {
  if (timeRemaining > 0) {
    // decrease the current time left
    timeRemaining--;

    // increase the time spent
    timeSpent++;

    // update the timer text
    durationText.textContent = timeRemaining + "s";
    // less duration
    if (timeRemaining <= 10) {
      timeContainer.className = "less";
      // Medium duration
    } else if (timeRemaining >= 10 && timeRemaining <= 30) {
      timeContainer.className = "mid";
      // More duration
    } else if (timeRemaining > 30) {
      timeContainer.className = "more";
    }
  } else {
    // finish the game
    gameComplete();
  }
}

function gameComplete() {
  clearInterval(timer);

  userInput.disabled = true;

  restartBtn.style.display = "block";

  // calculate cpm and wpm (per minute)
  cpm = Math.round((characterTyped / timeSpent) * 60);
  wpm = Math.round((characterTyped / 5 / timeSpent) * 60);

  // Handle empty input
  currentInput = userInput.value;
  if (currentInput.length === 0) {
    accuracyValue.textContent = 0;
  }

  // update cpm and wpm text
  cpmValue.textContent = cpm;
  wpmValue.textContent = wpm;

  // Display results on Popup
  popup.style.display = "flex";

  mainContainer.classList.add("overlay");

  progressBar.classList.remove("active");
}
