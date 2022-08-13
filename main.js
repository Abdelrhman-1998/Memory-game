var dashboardMenu = document.querySelector(".startGame");
var selectionButtons = document.querySelectorAll(".startGame .buttonsContainer button");
var submitDashboard = document.querySelector(".startGame .startGameContainer .submitDashboard button");
var gameBoard = document.querySelector(".gameBoard");
var gridContainer = document.querySelector(".gameBoard .gridContainer");
var gameScore = document.querySelector(".gameBoard .gameScore");
var gameStatusModal = document.getElementById("gameStatus");
var restartGameStatusBtn = gameStatusModal.querySelector(".restart");
var choiceCard = document.createElement("div");
var menuList = document.getElementById("menuList");
var restartMenuList = menuList.querySelector(".restart");
var menuButton = document.querySelector(".gameOptions button:last-child");
var resumeButton = document.querySelector("#menuList .modal-body button:last-child");
var newGameButtons = document.querySelectorAll(".newGame");
choiceCard.classList.add("choice");
var gameIcons = {
    "type": "fa-solid",
    "icons": [
        "fa-anchor", "fa-bug", "fa-flask", "fa-futbol", "fa-hand-spock",
        "fa-turkish-lira-sign", "fa-moon", "fa-snowflake", "fa-sun", "fa-car"
    ]
};
var restartButtons = document.querySelectorAll(".restart");
var newGameMenuList = menuList.querySelector(".newGame");
var newGameGameStatus = gameStatusModal.querySelector(".newGame");
var soloModeHTMLTags = "\n<div class=\"time\">\n<!-- replace player1 with time -->\n<p>\n\n</p>\n<p >\n    <span class=\"minutes\">0</span>\n    <span class=\"colon\">:</span>\n    <span class=\"seconds\">00</span>\n    <span>0</span>\n</p>\n</div>\n<div class=\"moves\">\n<!-- replace player2 with moves -->\n  <p>\n\n  </p>\n  <p >\n      0\n  </p>\n</div>\n<div class=\"player3 d-none \">\n<!-- display none in solo -->\n<p>\n\n</p>\n<p >\n    0\n</p>\n</div>\n<div class=\"player4 d-none \">\n<!-- display none in solo -->\n<p>\n\n</p>\n<p >\n  0\n</p>\n</div>\n";
var dashboardSelections = { "theme": "numbers", "playerNumbers": 1, "gridSize": 4 };
var selectedPairs = [];
var movesToSloveGame = 0;
var playerScores = [0, 0, 0, 0];
var nextTurn = 1;
var singleSecondsCounter = 0;
var tensSecondsCounter = 0;
var minutesCounter = 0;
var intervalId;
selectionButtons.forEach(function (ele) {
    ele.addEventListener("click", function () {
        if (!ele.classList.contains("active")) {
            ele.parentElement.querySelectorAll("button").forEach(function (ele) {
                ele.classList.replace("active", "idle");
            });
            ele.classList.replace("idle", "active");
            if (ele.parentElement.parentElement.classList.contains("themeMenu")) {
                var themeMenu = ele.innerHTML.trim().toLowerCase();
                dashboardSelections.theme = themeMenu;
            }
            else if (ele.parentElement.parentElement.classList.contains("playersNumbers")) {
                var playersNumbers = ele.innerHTML.trim();
                dashboardSelections.playerNumbers = +playersNumbers;
            }
            else if (ele.parentElement.parentElement.classList.contains("gridSize")) {
                var gridSize = ele.innerHTML.trim();
                ;
                gridSize.includes("4") ? dashboardSelections.gridSize = 4 : dashboardSelections.gridSize = 6;
            }
            //    console.log(dashboardSelections)
        }
    });
});
submitDashboard.addEventListener("click", function () {
    setGridSystem(gridContainer, dashboardSelections);
    fillGridSystem(dashboardSelections);
    var choices = document.querySelectorAll(".choice");
    choices.forEach(function (ele) {
        ele.addEventListener("click", function () {
            if ((!ele.classList.toString().includes("selected")) && (!ele.classList.toString().includes("solved"))) {
                ele.classList.add("selected");
                selectedPairs.push(ele);
                ele.children[0].classList.remove("d-none");
                // console.log(selectedPairs)
            }
            if (selectedPairs.length == 2) {
                movesToSloveGame++;
                if (dashboardSelections.playerNumbers > 1) {
                    if (nextTurn < dashboardSelections.playerNumbers) {
                        ++nextTurn;
                    }
                    else {
                        nextTurn = 1;
                    }
                }
                stopPointerEvent(choices);
                if ((selectedPairs[0].children[0].classList.toString() === selectedPairs[1].children[0].classList.toString()) && (selectedPairs[0].children[0].textContent === selectedPairs[1].children[0].textContent)) {
                    var currentPlayerTurn_1 = nextTurn - 1;
                    var oldPlayerScore = void 0;
                    if (currentPlayerTurn_1 === 0) {
                        oldPlayerScore = playerScores[dashboardSelections.playerNumbers - 1];
                        playerScores[dashboardSelections.playerNumbers - 1] = ++oldPlayerScore;
                    }
                    else {
                        oldPlayerScore = playerScores[currentPlayerTurn_1 - 1];
                        playerScores[currentPlayerTurn_1 - 1] = ++oldPlayerScore;
                    }
                    setTimeout(function () {
                        selectedPairs.forEach(function (ele) {
                            ele.classList.replace("selected", "solved");
                            selectedPairs = [];
                            if (dashboardSelections.playerNumbers === 1) {
                                gameScore.querySelector(".moves p:nth-child(2)").textContent = movesToSloveGame + "";
                            }
                            else {
                                //   gameScore.querySelector(`.player${nextTurn-1}.turn`)!.children[1]!.textContent=score+"";
                                if (currentPlayerTurn_1 === 0) {
                                    gameScore.querySelector(".player".concat(dashboardSelections.playerNumbers)).children[1].textContent = playerScores[dashboardSelections.playerNumbers - 1] + "";
                                    gameScore.querySelector(".player".concat(dashboardSelections.playerNumbers)).classList.remove("turn");
                                }
                                else {
                                    gameScore.querySelector(".player".concat(currentPlayerTurn_1)).children[1].textContent = playerScores[currentPlayerTurn_1 - 1] + "";
                                    gameScore.querySelector(".player".concat(currentPlayerTurn_1)).classList.remove("turn");
                                }
                                gameScore.querySelector(".player".concat(nextTurn)).classList.add("turn");
                            }
                        });
                    }, 800);
                    // showResults
                    setTimeout(function () {
                        var solvedChoice = document.querySelectorAll(".choice.solved");
                        if (solvedChoice.length === Math.pow(dashboardSelections.gridSize, 2)) {
                            if (dashboardSelections.playerNumbers > 1) {
                                var scoreDetails = document.querySelectorAll(".scoreDetails");
                                var playerNumbers = playerScores.slice(0, dashboardSelections.playerNumbers);
                                var MaxScore_1 = Math.max.apply(Math, playerScores);
                                scoreDetails.forEach(function (ele, index) {
                                    if (index < 2) {
                                        ele.classList.add("d-none");
                                    }
                                    else if (index < dashboardSelections.playerNumbers + 2) {
                                        ele.classList.remove("d-none");
                                        var playerScoreIndex = index - 2;
                                        var playerScore = playerScores[playerScoreIndex];
                                        ele.children[1].querySelector(".score").textContent = playerScores[playerScoreIndex] + "";
                                        if (playerScore === MaxScore_1) {
                                            ele.classList.add("winner");
                                            document.querySelector(".winMessage").textContent = "Player ".concat(playerScoreIndex + 1, " Wins!");
                                        }
                                    }
                                });
                                if (document.querySelectorAll(".winner").length > 1) {
                                    document.querySelector(".winMessage").textContent = "It’s a tie!";
                                }
                                gameStatusModal.classList.remove("d-none");
                                gameStatusModal.classList.add("show", "d-block");
                            }
                            else {
                                clearInterval(intervalId);
                                document.querySelectorAll(".scoreDetails").forEach(function (ele, index) {
                                    if (index < 2) {
                                        ele.classList.remove("d-none");
                                    }
                                });
                                var timeSpans = document.querySelectorAll(".time span:not(:last-child)");
                                var elapsedTime_1 = "";
                                timeSpans.forEach(function (ele) {
                                    elapsedTime_1 = elapsedTime_1 + ele.textContent.trim();
                                });
                                document.querySelector(".scoreDetails:first-child  .score +span").textContent = elapsedTime_1;
                                document.querySelector(".scoreDetails:nth-child(2) .score +span").textContent = movesToSloveGame + '';
                                gameStatusModal.classList.remove("d-none");
                                gameStatusModal.classList.add("show", "d-block");
                            }
                        }
                    }, 800);
                }
                else {
                    // console.log(selectedPairs)
                    setTimeout(function () {
                        selectedPairs.forEach(function (ele) {
                            ele.classList.remove("selected");
                            ele.children[0].classList.add("d-none");
                            selectedPairs = [];
                            if (dashboardSelections.playerNumbers === 1) {
                                gameScore.querySelector(".moves p:nth-child(2)").textContent = movesToSloveGame + "";
                            }
                            else {
                                gameScore.querySelector(".turn").classList.remove("turn");
                                gameScore.children[0].children[nextTurn - 1].classList.add("turn");
                            }
                        });
                    }, 800);
                }
                // change turn and score
            }
        });
    });
    setPlayerNumbers(dashboardSelections);
    if (dashboardSelections.playerNumbers === 1) {
        //   incrementTimer();
        intervalId = setTimer();
    }
    showGameBoard();
});
menuButton.addEventListener(("click"), onClickMenu);
resumeButton.addEventListener("click", onClickResume);
restartButtons.forEach(function (ele) {
    ele.addEventListener("click", restart);
});
newGameButtons.forEach(function (ele) {
    ele.addEventListener("click", newGame);
});
restartMenuList.addEventListener("click", function () {
    menuList.classList.remove("d-block");
    menuList.classList.add("d-none");
});
restartGameStatusBtn.addEventListener("click", function () {
    gameStatusModal.classList.remove("d-block", "show");
    gameStatusModal.classList.add("d-none");
});
newGameMenuList.addEventListener("click", function () {
    menuList.classList.remove("d-block", "show");
    menuList.classList.add("d-none");
});
newGameGameStatus.addEventListener("click", function () {
    gameStatusModal.classList.remove("d-block", "show");
    gameStatusModal.classList.add("d-none");
});
function setGridSystem(gridContainer, dashboardSelections) {
    gridContainer.classList.add(dashboardSelections.theme, "grid-".concat(dashboardSelections.gridSize, "x").concat(dashboardSelections.gridSize));
    for (var i = 0; i < dashboardSelections.gridSize * dashboardSelections.gridSize; ++i) {
        var choice = choiceCard.cloneNode(true);
        if (dashboardSelections.theme === "icons") {
            var icon = document.createElement("i");
            icon.classList.add("".concat(gameIcons.type), "d-none");
            choice.appendChild(icon);
            gridContainer.append(choice);
        }
        else {
            var span = document.createElement("span");
            span.classList.add("d-none");
            choice.appendChild(span);
            gridContainer.append(choice);
        }
    }
}
function showGameBoard() {
    dashboardMenu.classList.add("d-none");
    gameBoard.classList.remove("d-none");
    document.body.style.backgroundColor = "#FCFCFC";
}
function setPlayerNumbers(dashboardSelections) {
    if (dashboardSelections.playerNumbers > 1) {
        gameScore.children[0].classList.replace("solo", "multi");
        var allPlayers = gameScore.children[0].children;
        for (var i = 0; i < dashboardSelections.playerNumbers; i++) {
            allPlayers[i].setAttribute("class", "player".concat(i + 1));
            if (i === 0) {
                allPlayers[i].classList.add("turn");
                allPlayers[i].classList.replace("time", "player".concat(i));
            }
        }
        var hiddenElements = gameScore.children[0].querySelectorAll(".d-none");
        // console.log(hiddenElements)
        if (allPlayers.length - hiddenElements.length > 2) {
            gameScore.children[0].classList.remove("d-45");
            gameScore.children[0].classList.replace("t-50", "t-100");
        }
    }
}
function randomSet(arrLength, range) {
    var arr = [];
    while (arr.length !== arrLength) {
        var randomIndex = Math.floor(Math.random() * range);
        if (!arr.includes(randomIndex)) {
            arr.push(randomIndex);
        }
    }
    return arr;
}
function setRandomPositions(dashboardSelections) {
    var choicesNumber = dashboardSelections.gridSize * dashboardSelections.gridSize;
    var choicesIndices = [];
    var randomIcons = [];
    var range = choicesNumber / 2;
    for (var i = 0; i < choicesNumber; i++) {
        choicesIndices.push(i);
    }
    if (choicesNumber / 2 > gameIcons.icons.length) {
        var counter = Math.ceil((choicesNumber / 2) / gameIcons.icons.length);
        // console.log(counter)
        range = (choicesNumber / 2) / counter;
        for (var i = 0; i < counter; i++) {
            var randomIconsIndices = randomSet(range, gameIcons.icons.length);
            randomIconsIndices.forEach(function (ele) {
                randomIcons.push(gameIcons.icons[ele]);
            });
        }
    }
    else {
        var randomIconsIndices = randomSet(range, gameIcons.icons.length);
        randomIconsIndices.forEach(function (ele) {
            randomIcons.push(gameIcons.icons[ele]);
        });
    }
    var quesionsIndices = randomSet(choicesNumber / 2, choicesNumber);
    var answerIndices = choicesIndices.filter(function (ele) {
        return !quesionsIndices.includes(ele);
    });
    var randomNumbers = quesionsIndices.map(function (ele) {
        return ele + 1 + "";
    });
    // console.log(setIconsOrNumbers(dashboardSelections,quesionsIndices,answerIndices,randomIcons,randomNumbers))
    return setIconsOrNumbers(dashboardSelections, quesionsIndices, answerIndices, randomIcons, randomNumbers);
}
function setIconsOrNumbers(dashboardSelections, quesionsIndices, answerIndices, randomIcons, randomNumbers) {
    var resultArray = [];
    var randomElement;
    if (dashboardSelections.theme === "icons") {
        randomElement = randomIcons;
    }
    else if (dashboardSelections.theme === "numbers") {
        randomElement = randomNumbers;
    }
    quesionsIndices.forEach(function (ele, index) {
        var resultObj = { "index": ele, "theme": randomElement[index] };
        resultArray.push(resultObj);
    });
    answerIndices.forEach(function (ele, index) {
        var resultObj = { "index": ele, "theme": randomElement[index] };
        resultArray.push(resultObj);
    });
    return resultArray;
}
function fillGridSystem(dashboardSelections) {
    var allChoices = gridContainer.querySelectorAll(".choice");
    var randomFill = setRandomPositions(dashboardSelections);
    if (dashboardSelections.theme === "icons") {
        randomFill.forEach(function (ele) {
            var icon = allChoices[ele.index].querySelector("i");
            //    icon!.classList.add(ele.theme);
            icon.setAttribute("class", "".concat(ele.theme, " ").concat(gameIcons.type, " d-none"));
        });
    }
    else {
        randomFill.forEach(function (ele) {
            var span = allChoices[ele.index].querySelector("span");
            span.classList.add("d-none");
            span.innerText = ele.theme;
        });
    }
}
function stopPointerEvent(choices) {
    choices.forEach(function (ele) {
        ele.setAttribute("style", "pointer-events:none;");
        // console.log(ele)
    });
    setTimeout(function () {
        choices.forEach(function (ele) {
            ele.removeAttribute("style");
        });
    }, 800);
}
function setTimer() {
    var timer = setInterval(function () {
        incrementTimer();
    }, 1000);
    return timer;
}
function incrementTimer() {
    if ((singleSecondsCounter <= 9)) {
        ++singleSecondsCounter;
    }
    if (singleSecondsCounter === 10) {
        if (tensSecondsCounter < 5) {
            singleSecondsCounter = 0;
            ++tensSecondsCounter;
        }
        else {
            ++minutesCounter;
            singleSecondsCounter = 0;
            tensSecondsCounter = 0;
        }
    }
    gameScore.querySelector(".seconds").textContent = tensSecondsCounter + "" + singleSecondsCounter;
    gameScore.querySelector(".minutes").textContent = "" + minutesCounter;
}
function resetTimer() {
    gameScore.querySelector(".seconds").textContent = 0 + "" + 0;
    gameScore.querySelector(".minutes").textContent = "" + 0;
}
function onClickMenu() {
    // stop timer
    if (dashboardSelections.playerNumbers === 1) {
        clearInterval(intervalId);
    }
    menuList.classList.remove("d-none");
    menuList.classList.add("d-block", "show");
}
function onClickResume() {
    if (dashboardSelections.playerNumbers === 1) {
        // incrementTimer();
        intervalId = setTimer();
    }
    menuList.classList.remove("d-block", "show");
    menuList.classList.add("d-none");
}
function restart() {
    selectedPairs = [];
    movesToSloveGame = 0;
    playerScores = [0, 0, 0, 0];
    nextTurn = 1;
    singleSecondsCounter = 0;
    tensSecondsCounter = 0;
    minutesCounter = 0;
    if (document.querySelectorAll(".winner").length !== 0) {
        document.querySelectorAll(".winner").forEach(function (ele) {
            ele.classList.remove("winner");
        });
    }
    var choices = document.querySelectorAll(".choice");
    choices.forEach(function (ele) {
        ele.classList.remove("solved", "selected");
    });
    fillGridSystem(dashboardSelections);
    if (dashboardSelections.playerNumbers === 1) {
        resetTimer();
        clearInterval(intervalId);
        intervalId = setTimer();
        gameScore.querySelector(".moves p:nth-child(2)").textContent = "0";
    }
    else {
        var playersScore = gameScore.querySelectorAll("p:nth-child(2)");
        var players = document.querySelectorAll(".multi >div");
        players.forEach(function (ele, index) {
            if (index === 0) {
                if (!ele.classList.toString().includes("turn")) {
                    ele.classList.add("turn");
                }
            }
            else {
                ele.classList.remove("turn");
            }
        });
        playersScore.forEach(function (ele) {
            ele.textContent = "0";
        });
    }
}
function newGame() {
    selectedPairs = [];
    movesToSloveGame = 0;
    playerScores = [0, 0, 0, 0];
    nextTurn = 1;
    singleSecondsCounter = 0;
    tensSecondsCounter = 0;
    minutesCounter = 0;
    document.querySelector(".winMessage").textContent = "You did it!";
    document.querySelectorAll(".scoreDetails").forEach(function (ele) {
        ele.setAttribute("class", "scoreDetails d-none");
    });
    if (dashboardSelections.playerNumbers === 1) {
        resetTimer();
        clearInterval(intervalId);
        gameScore.querySelector(".moves p:nth-child(2)").textContent = "0";
    }
    else {
        var playersScore = gameScore.querySelectorAll("p:nth-child(2)");
        var players = document.querySelectorAll(".multi >div");
        players.forEach(function (ele, index) {
            if (index === 0) {
                if (!ele.classList.toString().includes("turn")) {
                    ele.classList.add("turn");
                }
            }
            else {
                ele.classList.remove("turn");
            }
        });
        playersScore.forEach(function (ele) {
            ele.textContent = "0";
        });
    }
    if (dashboardSelections.playerNumbers === 1) {
        clearInterval(intervalId);
    }
    else {
        gameScore.children[0].classList.remove("multi", "t-100");
        gameScore.children[0].classList.add("solo", "t-50", "d-45");
        gameScore.children[0].innerHTML = soloModeHTMLTags;
    }
    dashboardSelections = { "theme": "numbers", "playerNumbers": 1, "gridSize": 4 };
    gridContainer.classList.remove("grid-6x6");
    gridContainer.classList.remove("grid-4x4");
    document.querySelectorAll(".choice").forEach(function (ele) {
        ele.remove();
    });
    document.querySelectorAll(".startGameContainer .buttonsContainer button:first-child").forEach(function (ele, index) {
        ele.setAttribute("class", "active");
    });
    document.querySelectorAll(".startGameContainer .buttonsContainer button:not(:first-child)").forEach(function (ele, index) {
        ele.setAttribute("class", "idle");
    });
    document.body.style.backgroundColor = "#152938";
    gameBoard.classList.add("d-none");
    dashboardMenu.classList.remove("d-none");
}
// setRandomPositions(dashboardSelections);
