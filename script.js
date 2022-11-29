// Load and display question:
    fetch("./texts.json")
    .then((res) => res.json())
    .then((data) => {
          questionText = data[Math.floor(Math.random() * data.length)];
          question.innerHTML = questionText;
    });

// Elements:
    const display = document.getElementById("display");
    const question = document.getElementById("question");
    const startBtn = document.getElementById("start");
    const resultModal = document.getElementById("result");
    const modalBackground = document.getElementById("modal-background");
    const countdownOverlay = document.getElementById("countdown");
    const countdownDisplayContainer = document.getElementById('countdown-display-container');

// variables:
    let userText = "";
    let errorCount = 0;
    let startTime;
    let questionText = "";

// checks the user typed character and displays accordingly
const typeController = (e) => {
    const newLetter = e.key;

    // Handle backspace press
    if (newLetter == "Backspace") {
      userText = userText.slice(0, userText.length - 1);
      return display.removeChild(display.lastChild);
    }

    // Stop scrolling after spacebar key down.
    if(newLetter == " "){
      window.addEventListener('keydown', function(e){
        e.preventDefault();
      })
    }

    // these are the valid character we are allowing to type
    const validLetters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ 1234567890!@#$%^&*()_+-={}[].,?''/";

    // if it is not a valid character like Control/Alt then skip displaying anything
    if (!validLetters.includes(newLetter)) {
        return;
    }
  
    // Store key values in the variable userText:
    userText += newLetter;
    const newLetterCorrect = validate(newLetter);

    // Check if it is a space or not and display characters on display div:
    if (newLetterCorrect) {
      display.innerHTML += `<span class="green">${newLetter === " " ? "▪" : newLetter}</span>`;
    } 
    else {
      display.innerHTML += `<span class="red">${newLetter === " " ? "▪" : newLetter}</span>`;
    }

    // check if given question text is equal to user typed text
    if (questionText === userText) {
        gameOver();
    }
};

// Funtion for checking validation:
const validate = (key) => {
      // console.log(key);
      if (key === questionText[userText.length - 1]) {
        return true;
      }
      else{
        // Erorr calculation:
        errorCount += 1;
        return false;
      }
};

// FINISHED TYPING
const gameOver = () => {
    // Reload the page:
  
    // Remove eventListener so use can't type:
    document.removeEventListener("keydown", typeController);

    // the current time is the finish time
    // so total time taken is current time - start time
    const finishTime = new Date().getTime();
    const timeTaken = (finishTime - startTime) / 1000;

    // show result modal
    resultModal.innerHTML = "";
    resultModal.classList.toggle("hidden");
    modalBackground.classList.toggle("hidden");

    // clear user text
    display.innerHTML = "";

    // make it inactive
    display.classList.add("inactive");

    // show result
    resultModal.innerHTML += `
    <h1>Finished!</h1><br>
    <p>You took:  <span class="bold">${timeTaken.toFixed()}</span> seconds</p>
    <p>You made:  <span class="bold red">${errorCount}</span> mistakes</p><br>
    <button class="close-btn" onclick="closeModal()">Close</button>
    `;

    // Add the result as a history:
    addHistory(questionText, timeTaken.toFixed(), errorCount);

    // restart everything
    startTime = null;
    errorCount = 0;
    userText = "";
    display.classList.add("inactive");
};

// close Modal:
const closeModal = () => {
    modalBackground.classList.toggle("hidden");
    resultModal.classList.toggle("hidden");
    window.location.reload();
};


// start funtion:
const start = () => {

    // If already started, do not start again
    if (startTime) return;

    let count = 3;
    countdownOverlay.style.display = "flex";
    const startCountdown = setInterval(() => {
    countdownOverlay.innerHTML = `<h1>${count}</h1>`;

    // Stop Countdown ;
    if (count == 0) {
      countdownDisplayContainer.style.display = "none";

    // -------------- START TYPING -----------------//
    document.addEventListener("keydown", typeController);
    // countdownOverlay.style.display = "block";
    display.classList.remove("inactive");
    clearInterval(startCountdown);
      startTime = new Date().getTime();
    }
    count--;},  1000);
};

    // START Countdown
    startBtn.addEventListener("click", start);

    // If history exists, show it
    displayHistory();

    // Show typing time spent
    setInterval(() => {
        const currentTime = new Date().getTime();
        var timeSpent = (currentTime - startTime) / 1000;
        var timeSpent = timeSpent.toFixed()
        document.getElementById("show-time").innerHTML = `${startTime ? timeSpent : 0} seconds`;
    }, 1000);
