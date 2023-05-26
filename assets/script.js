
// variables for page elements
// time and score
let timeEl = document.querySelector("p.time");
let secondsLeft = 75;
let scoreEl = document.querySelector("#score");

// sections
// section intro
const introEl = document.querySelector("#intro");

// section questions
//question section
const questionsEl = document.querySelector("#questions");
//where question goes
let questionEl = document.querySelector("#question");
// how many questions they have answered
let questionCount = 0;
// div yaynay
const yaynayEl = document.querySelector("#yaynay");

// section final
const finalEl = document.querySelector("#final");
// user initials
let initialsInput = document.querySelector("#initials");

// section highscores
const highscoresEl = document.querySelector("#highscores");
// ordered list
let scoreListEl = document.querySelector("#score-list");
// array of scores
let scoreList = [];

// buttons
// start
const startBtn = document.querySelector("#start");
// answer button class
const ansBtn = document.querySelectorAll("button.ansBtn")
// answer1
const ans1Btn = document.querySelector("#answer1");
// answer2
const ans2Btn = document.querySelector("#answer2");
// answer3
const ans3Btn = document.querySelector("#answer3");
// answer4 
const ans4Btn = document.querySelector("#answer4");
// submit-score
const submitScrBtn = document.querySelector("#submit-score");
// goback
const goBackBtn = document.querySelector("#goback");
// clearscores
const clearScrBtn = document.querySelector("#clearscores");
// view-scores
const viewScrBtn = document.querySelector("#view-scores");

// Object for question, answer, true/false
const questions = [ // array of objects
    {
        // question 0
        question: "How do you write 'Hello World' in an alert box?",
        answers: ["1.msg('Hello World')", "2. alert('Hello World')", "3. prompt('Hello World')", "4. alertBox('Hello World')"],
        correctAnswer: "1"
    },
    {
        // question 1
        question: "Which of the following function of Array object calls a function for each element in the array?",
        answers: ["1. concat()", "2. filter()", "3. forEach()", "4. split()"],
        correctAnswer: "2"
    },
    {
        // question 2
        question:"How to write an IF statement for executing some code if 'i' is NOT equal to 8?",
        answers: ["1. if (i != 8)", "2. if i =! 8", "3. if (i <> 8)", "4. if (i !=== 8)"],
        correctAnswer: "0"
    },
    {
        // question 3
        question: "What is the correct way to write a JavaScript array?",
        answers: ["1.var vegetable = (0:'kale', 1:'lettuce', 2:'spinach')", "2. var vegetable = ['kale', 'lettuce', 'spinach']", "3. var vegetable = (kale, lettuce, spinach)", "4. None of the above"],
        correctAnswer: "1"
    },
    {
        // question 4
        question: "How do you round the number 102.456, to the nearest integer?",
        answers: ["1. Math.random(102.456)", "2. Math.rnd(102.456)", "3.round(102.456)", "4. None of the above"],
        correctAnswer: "3"
    }
];


// Functions

// timer
function setTime() {
    let timerInterval = setInterval(function () {
        secondsLeft--;
        timeEl.textContent = `Time:${secondsLeft}s`;

        if (secondsLeft === 0 || questionCount === questions.length) {
            clearInterval(timerInterval);
            questionsEl.style.display = "none";
            finalEl.style.display = "block";
            scoreEl.textContent = secondsLeft;
        }
    }, 1000);
}

// start quiz with timer and set up questions
function startQuiz() {
    introEl.style.display = "none";
    questionsEl.style.display = "block";
    questionCount = 0;

    setTime();
    setQuestion(questionCount);
}

// function to set question; takes in a count and displays the next question/answers
function setQuestion(id) {
    if (id < questions.length) {
        questionEl.textContent = questions[id].question;
        ans1Btn.textContent = questions[id].answers[0];
        ans2Btn.textContent = questions[id].answers[1];
        ans3Btn.textContent = questions[id].answers[2];
        ans4Btn.textContent = questions[id].answers[3];
    }
}

// function to check answer and then move to next question
function checkAnswer(event) {
    event.preventDefault();

    // show section for yaynay and append message
    yaynayEl.style.display = "block";
    let p = document.createElement("p");
    yaynayEl.appendChild(p);

    // time out after 1 second
    setTimeout(function () {
        p.style.display = 'none';
    }, 1000);

    // answer checker
    if (questions[questionCount].correctAnswer === event.target.value) {
        p.textContent = "Correct!";
    } else if (questions[questionCount].correctAnswer !== event.target.value) {
        secondsLeft = secondsLeft - 10;
        p.textContent = "Wrong!";
    }

    // increment so the questions index is increased
    if (questionCount < questions.length) {
        questionCount++;
    }
    // call setQuestion to bring in next question when any ansBtn is clicked
    setQuestion(questionCount);
}

function addScore(event) {
    event.preventDefault();

    finalEl.style.display = "none";
    highscoresEl.style.display = "block";

    let init = initialsInput.value.toUpperCase();
    scoreList.push({ initials: init, score: secondsLeft });

    // sort scores
    scoreList = scoreList.sort((a, b) => {
        if (a.score < b.score) {
          return 1;
        } else {
          return -1;
        }
      });
    
    scoreListEl.innerHTML="";
    for (let i = 0; i < scoreList.length; i++) {
        let li = document.createElement("li");
        li.textContent = `${scoreList[i].initials}: ${scoreList[i].score}`;
        scoreListEl.append(li);
    }

    // Add to local storage
    storeScores();
    displayScores();
}

function storeScores() {
    localStorage.setItem("scoreList", JSON.stringify(scoreList));
}

function displayScores() {
    // Get stored scores from localStorage
    // Parsing the JSON string to an object
    let storedScoreList = JSON.parse(localStorage.getItem("scoreList"));

    // If scores were retrieved from localStorage, update the scorelist array to it
    if (storedScoreList !== null) {
        scoreList = storedScoreList;
    }
}

// clear scores
function clearScores() {
    localStorage.clear();
    scoreListEl.innerHTML="";
}

// EventListeners
// Start timer and display first question when click start quiz
startBtn.addEventListener("click", startQuiz);

// Check answers loop
ansBtn.forEach(item => {
    item.addEventListener('click', checkAnswer);
});

// Add score
submitScrBtn.addEventListener("click", addScore);

// Go Back Button
goBackBtn.addEventListener("click", function () {
    highscoresEl.style.display = "none";
    introEl.style.display = "block";
    secondsLeft = 75;
    timeEl.textContent = `Time:${secondsLeft}s`;
});

// Clear the scores
clearScrBtn.addEventListener("click", clearScores);

// View/Hide High Scores Button
viewScrBtn.addEventListener("click", function () {
    if (highscoresEl.style.display === "none") {
        highscoresEl.style.display = "block";
    } else if (highscoresEl.style.display === "block") {
        highscoresEl.style.display = "none";
    } else {
        return alert("No scores to show.");
    }
});
