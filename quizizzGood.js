let quizDataPath = "https://quizizz.com/api/main/quiz/";
let quizData = getQuizData();
let questionData = quizData.data.quiz.info.questions;
let prevUrl = "";

let currentUrl = window.location.href;
if (prevUrl != currentUrl) {
    prevUrl = currentUrl;
    inject();
}

function inject() {
    document.head.insertAdjacentHTML('beforeend', `<style type="text/css">
    correct-answer-x3Ca8B {
    color: lime !important;
    }
    </style>`);
}

let url = window.location.href.toString();
if (url.includes("quizizz.com/join/quiz/") && url.includes("/start")) {
    setCookie("hackId", url.split("/")[5], 0.1);
    window.open(quizDataPath + getCookie("hackId"));
    // document.querySelector("body > div > div.root-component > div > div > div > div.pre-game-screen > div.main-action-section > div.action-item-wrapper.default-card-styles.cta-section > div > div > button.primary-button.play-again > i").click();
    setTimeout(function() {location.reload();}, 100);
}

let prevQuestionNum;

let tick = setInterval(function() {
    if (document.querySelector("body > div > div.root-component > div > div > div > div.page-container > div > div > div.main-section > div.top-section-wrapper > div > div.actions-container > button.primary-action-btn")) {
        clearInterval(tick);
        clearInterval(next);
        location.reload();
    }
    let newQuestionNum;
    try {
        newQuestionNum = document.getElementsByClassName("current-question")[0].innerHTML;
    } catch(err) {
    }
    if (newQuestionNum != prevQuestionNum) {
        setTimeout(function() {compareQuestion()}, 1000);
        prevQuestionNum = newQuestionNum;
    }
}, 100);

let answer;
function compareQuestion() {
    let Choices = document.getElementsByClassName("options-container")[0].children[0].children;
    let currentQuestionText = document.querySelector("body > div > div.root-component > div > div > div > div.page-container.in-quiz > div.screen.screen-game > div.transitioner.transitioner-component > div > div > div > div > div > div.question-container.themed.black > div > div > div > div > p");
    let submitButton = document.querySelector("body > div > div.root-component > div > div > div > div.page-container.in-quiz > div.screen.screen-game > div.control-center > div > div.submit-actions.flex-view.all-center.exp-subtext > div.show-tooltip.default > button > span");
    if (currentQuestionText == null) currentQuestionText = document.querySelector("body > div > div.root-component > div > div > div > div.page-container.in-quiz > div.screen.screen-game > div.transitioner.transitioner-component > div > div > div > div > div > div.question-container.themed > div > div > div > div > p");
    currentQuestionText = currentQuestionText.parentElement.innerHTML;
    // console.log(currentQuestionText);
    for (let question of Object.keys(questionData)) {
        question = questionData[question];
        let questionText = question.structure.query.text.replaceAll("  ", " ").replace("  ", " ");
        // console.log(questionText);
        if (currentQuestionText == questionText) {
            answer = question.structure.answer;
            if (typeof answer != "object") {
                // console.log(question.structure.options[answer].text);
                for (let i = 0; i < Choices.length; i++) {
                    let option = Choices[i].children[0].children[0].children[1].children[0].children[0].children[0];
                    if (option.outerHTML == question.structure.options[answer].text.replaceAll("  ", " ").replace("  ", " ")) {
                        option.innerHTML = "<correct-answer-x3Ca8B><u>" + option.innerHTML + "</u></correct-answer-x3Ca8B>"
                        option.click();
                    }
                }
            } else {
                for (let i = 0; i < Choices.length; i++) {
                    let option = Choices[i].children[0].children[0].children[1].children[0].children[0].children[0];
                    for (let index of Object.keys(answer)) {
                        index = answer[index];
                        if (option.outerHTML == question.structure.options[index].text.replaceAll("  ", " ").replace("  ", " ")) {
                            option.innerHTML = "<correct-answer-x3Ca8B><u>" + option.innerHTML + "</u></correct-answer-x3Ca8B>"
                            option.click();
                        }
                    }
                }
                setTimeout(function(){submitButton.click();}, 100);
            }
        }
    }
}

let next = setInterval(function(){
    try {
        document.querySelector("div > div.right-navigator-wrapper > div.show-tooltip.error > div.right-navigator:not(.disable)").click();
    } catch(err) {

    }
}, 10);

function getQuizData() {
    let xhttp = new XMLHttpRequest;
    xhttp.open("GET", quizDataPath + getCookie("hackId"), false);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send();
    return JSON.parse(xhttp.responseText);
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
        c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
        }
    }
    return "";
}