//set up to effectively use the database. importing from supabase and creates some constants.
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://ngnylpyfinouxuylfgwr.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5nbnlscHlmaW5vdXh1eWxmZ3dyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODU0NzY5ODIsImV4cCI6MjAwMTA1Mjk4Mn0.0R8ynT679HkGUy-za8kGU637ZUwPHD2SK0yT7Y5hQi0"
const supabase = createClient(supabaseUrl, supabaseKey)
const table = 'scores'

//this async function gets the data from supabase. gets the top 5 scores and the names of the users
//does this by limiting five scores, ordering by score, and in descending order. also returns the data. 
async function getScoreData() {
    const { data, error } = await supabase
        .from(table)
        .select('id, name, score')
        .limit(5)
        .order('score', { ascending: false })
    console.log(data)
    return data
}

//this async function inserts the score the user just scored to the table in supabase. records the inputted name and their score. 
//essentially creates new rows of data in supabase for each time the game is played. 
async function insertScore(name, score) {
    const { error } = await supabase
        .from(table)
        .insert({ name: name, score: score })
}

//the following code creates variables that will be used later on. 
start()
let change = 0;
let winScore = 100;
let loseScore = -50;
let drawScore = 30;
let score = 0;
let plusScore = document.querySelector("#plus");
let currentScore = document.querySelector("#score");
let byteOutput = document.querySelector("#byte-output")
let introMessage = document.getElementById("message")
let titleScore = document.getElementById("title")
let scoreList = document.querySelector("#scores")
let winNotify = document.querySelector("#winner")
var startGame = document.getElementById("start")
let modal = document.querySelector(".modalcontainer")

//prompts user to put in name to customize game and record the high score. will display the name on screen after inputted. 
let person = prompt("Please enter your name", "Player")
if (person != null) {
    document.getElementById("user-name").innerHTML = person
}

//start function
async function start() {

    //this is the start of the game. 
    //a start button on the modal is clicked, and then the timer starts running and the modal disappears. 
    var startGame = document.getElementById("start")
    startGame.addEventListener('click', () => {
        modal.style.display = "none";
        timer()
    })

    //calls the getScoreData function to access the top 5 scores. 
    let remoteData = await getScoreData()

    //this for loop creates 5 new divs using createElement, each div contains a high score and a name.
    //for every increase in "i," the next highest score is recorded. 
    //scoreList is the "big" div that holds all 5 of the high scores.
    for (let i = 0; i < 5; i++) {
        const newDiv = document.createElement("div");
        newDiv.innerHTML = (remoteData[i]["name"]) + " · · · · · · · · · · · · · · · · · · · " + (remoteData[i]["score"])
        scoreList.appendChild(newDiv)
    }

    //the scoreList is initially hidden because it's using the same modal as the directions
    scoreList.style.display = "none"

    //more set up to the rest of the code. 
    let user = "output";
    let computer = "computer choice"

    //this array holds the 3 possible computer outputs: rock, paper, and scissors. 
    //one output is chosen with a random Number function. Rock = 1, Paper = 2, Scissors = 3.
    const computerOutput = ["Rock", "Paper", "Scissors"];

    //more code setup
    let outcome = "none";
    let addPoints = "none"

    //displays the user's current score the screen
    currentScore.innerHTML = "Score: " + score + change

    //when the rock picture is clicked, functions are ran to check if the user won or lost. Depending on the result, the score will increment appropriately. 
    let rock = document.querySelector("#rock");
    rock.addEventListener('click', () => {
        user = "rockU"
        computer = random(computerOutput)
        outcome = win(user, computer)
        addPoints = addScore(outcome, plusScore)
        changeScore(currentScore)
        displayComputer(computer)
    })

    //when the paper picture is clicked, functions are ran to check if the user won or lost. Depending on the result, the score will increment appropriately. 
    let paper = document.querySelector("#paper");
    paper.addEventListener('click', () => {
        user = "paperU"
        computer = random(computerOutput)
        outcome = win(user, computer)
        addPoints = addScore(outcome, plusScore)
        changeScore(currentScore)
        displayComputer(computer)
    })

    //when the scissors picture is clicked, functions are ran to check if the user won or lost. Depending on the result, the score will increment appropriately. 
    let scissors = document.querySelector("#scissors");
    scissors.addEventListener('click', () => {
        user = "scissorsU"
        computer = random(computerOutput)
        outcome = win(user, computer)
        addPoints = addScore(outcome, plusScore)
        changeScore(currentScore)
        displayComputer(computer)
    })

    //this function checks each possible output to determine whether the user won or lost. depending on the result, the score will increment appropriately and the computer displays its output as well.  
    //each "check" will determine if the outcome is a win or loss, and what to increment the score by.  
    function win(user, computer) {
        if (user == "rockU" && computer == "Scissors") {
            outcome = "win"
            change = winScore
            byteOutput.innerHTML = computer
        } else if (user == "paperU" && computer == "Rock") {
            outcome = "win"
            change = winScore
            byteOutput.innerHTML = computer
        } else if (user == "scissorsU" && computer == "Paper") {
            outcome = "win"
            change = winScore
            byteOutput.innerHTML = computer
        } else if (user == "rockU" && computer == "Paper") {
            outcome = "lose"
            change = loseScore
            byteOutput.innerHTML = computer
        } else if (user == "paperU" && computer == "Scissors") {
            outcome = "lose"
            change = loseScore
            byteOutput.innerHTML = computer
        } else if (user == "scissorsU" && computer == "Rock") {
            outcome = "lose"
            change = loseScore
            byteOutput.innerHTML = computer
        } else if (user == "rockU" && computer == "Rock") {
            outcome = "draw"
            change = drawScore
            byteOutput.innerHTML = computer
        } else if (user == "paperU" && computer == "Paper") {
            outcome = "draw"
            change = drawScore
            byteOutput.innerHTML = computer
        } else if (user == "scissorsU" && computer == "Scissors") {
            outcome = "draw"
            change = drawScore
            byteOutput.innerHTML = computer
        }
        return outcome;
    }
}

//this function randomizes a number. each number is assigned to a specific computer output based on the array at the top of the code. returns the computer output. 
function random(computerChoices) {
    let randomNum = Math.floor(Math.random() * 3);
    let computer = computerChoices[randomNum]
    console.log(computer)
    return computer
}

//this function shows the result and how the amount the score changes by. For example, if the user wins, it'll say "WIN!" and display +100 to the screen. 
//also adds color to the text (win = green, draw = yellow, lose = red)
function addScore(outcome, increase) {
    if (outcome == "win") {
        increase.style.color = "green"
        increase.innerHTML = "+" + winScore + "!"
        winNotify.style.color = "green"
        winNotify.innerHTML = "WIN :)"
    }
    if (outcome == "lose") {
        increase.style.color = "red"
        increase.innerHTML = loseScore + "!"
        winNotify.style.color = "red"
        winNotify.innerHTML = "LOSE :("
    }
    if (outcome == "draw") {
        increase.style.color = "yellow"
        increase.innerHTML = "+" + drawScore + "!"
        winNotify.style.color = "yellow"
        winNotify.innerHTML = "DRAW :|"
    }
}

//this function actually changes the total score amount that is displayed on the upper left. the score is unable to go below zero.  
function changeScore(currentScore) {
    score = score + change;
    if (score < 0) {
        score = 0;
    }
    currentScore.innerHTML = "Score: " + score;
}

//this is the timer function that counts down from 30 seconds. 
function timer() {
    let sec = 30;
    let timer = setInterval(function () {
        document.getElementById('timer').innerHTML = '0:' + sec;

        //if the time goes below 10 seconds, a slight adjustment is made to the display.
        if (sec < 10) {
            document.getElementById('timer').innerHTML = '0:0' + sec;
        }
        sec--;

        //if the time goes below zero, the game ends and the following code will run.
        if (sec < 0) {

            //time is reset and the user's score is inserted into the database using the insertScore function.   
            clearInterval(timer);
            insertScore(person, score)

            //using the same modal as the directions, the title is changed to "High Scores"
            //the introduction message is hidden (display is none)
            //the modal popup box is shown (display is block)
            //the list of high scores is shown (display is block)
            titleScore.innerHTML = "High Scores"
            introMessage.style.display = "none";
            modal.style.display = "block";
            scoreList.style.display = "block";

            //all of the following code removes the event listeners on the user selections (rock, paper, scissors)
            //does this by cloning the original element and then by replacing it, which will remove all the event listeners.
            //computer output will no longer change and score will not increase. 
            let clone = rock.cloneNode(true);
            rock.parentNode.replaceChild(clone, rock);
            clone = paper.cloneNode(true);
            paper.parentNode.replaceChild(clone, paper);
            clone = scissors.cloneNode(true);
            scissors.parentNode.replaceChild(clone, scissors);

            //makes the computer's output a black image. 
            byteOutput.src = "assets/images/dark.png"

            //the original start button is now changed to "New Game"
            //when the new game button is clicked, the page reloads and starts a new game. 
            startGame.innerHTML = "New Game"
            startGame.addEventListener('click', () => {
                location.reload()
            })
        }
    }, 1000);
}

//this function displays the computer's output by using images in the folder. 
//each output is sourced to a specific image. 
function displayComputer(computer) {
    if (computer == "Rock") {
        byteOutput.src = "assets/images/rock.png"
    } else if (computer == "Paper") {
        byteOutput.src = "assets/images/paper.jpg"
    } else if (computer == "Scissors") {
        byteOutput.src = "assets/images/scissors.jpg"
    }
}