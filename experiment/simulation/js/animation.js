import { setCoordinates, fillInputDots, objectDisappear, objectAppear, fillColor, setColor, unsetColor } from "./animation-utility.js";
'use strict';

window.simulationStatus = simulationStatus;
window.restartCircuit = restartCircuit;
window.setSpeed = setSpeed;
window.appendInput1 = appendInput1
window.appendInput2 = appendInput2
window.appendInput3 = appendInput3
window.appendInput4 = appendInput4
// Dimensions of working area
const circuitBoard = document.getElementById("circuit-board");
const sidePanels = document.getElementsByClassName("v-datalist-container");

// Distance of working area from top
const circuitBoardTop = circuitBoard.offsetTop;

// Full height of window
const windowHeight = window.innerHeight;
const width = window.innerWidth;
const svg = document.querySelector(".svg");
const svgns = "http://www.w3.org/2000/svg";

const EMPTY = "";
const ZERO = "rgb(238, 235, 34)"
const status = document.getElementById("play-or-pause");
const observ = document.getElementById("observations");
const speed = document.getElementById("speed");

let currPos = 0;

const objects = [document.getElementById("a1"), document.getElementById("a0"), document.getElementById("b1"), document.getElementById("b0"), document.getElementById("a1"), document.getElementById("a0"), document.getElementById("b1"), document.getElementById("b0"), document.getElementById("c3"), document.getElementById("c2"), document.getElementById("c1"), document.getElementById("c0")];
const textInput = [
    document.createElementNS(svgns, "text"), 
    document.createElementNS(svgns, "text"), 
    document.createElementNS(svgns, "text"), 
    document.createElementNS(svgns, "text")
];
const textOutput = [
    document.createElementNS(svgns, "text"), 
    document.createElementNS(svgns, "text"), 
    document.createElementNS(svgns, "text"), 
    document.createElementNS(svgns, "text")
];
const inputDots = [
    document.createElementNS(svgns, "circle"),
    document.createElementNS(svgns, "circle"),
    document.createElementNS(svgns, "circle"),
    document.createElementNS(svgns, "circle"),
    document.createElementNS(svgns, "circle"),
    document.createElementNS(svgns, "circle"),
    document.createElementNS(svgns, "circle"),
    document.createElementNS(svgns, "circle")
];
let decide = false;
let circuitStarted = false;

function demoWidth() {
    if (width < 1024) {
        circuitBoard.style.height = "600px";
    } else {
        circuitBoard.style.height = `${windowHeight - circuitBoardTop - 20}px`;
    }
    sidePanels[0].style.height = circuitBoard.style.height;
}

//initialise input text
function textIOInit() {
    for (const text of textInput) {
        text.textContent = 2;
    }
}

function outputCoordinates() {
    let xcor = 695;
    setCoordinates(xcor, 210, textOutput[0]);
    svg.append(textOutput[0]);
    setCoordinates(xcor, 345, textOutput[1]);
    svg.append(textOutput[1]);
    setCoordinates(xcor, 465, textOutput[2]);
    svg.append(textOutput[2]);
    setCoordinates(xcor, 545, textOutput[3]);
    svg.append(textOutput[3]);
}


function initInputDots() {
    //sets the coordinates of the input dots
    fillInputDots(inputDots[0], 20, 220, 15, "#FF0000");
    svg.append(inputDots[0]);
    fillInputDots(inputDots[1], 20, 560, 15, "#FF0000");
    svg.append(inputDots[1]);
    fillInputDots(inputDots[2], 20, 340, 15, "#FF0000");
    svg.append(inputDots[2]);
    fillInputDots(inputDots[3], 20, 440, 15, "#FF0000");
    svg.append(inputDots[3]);
    fillInputDots(inputDots[4], 20, 220, 15, "#FF0000");
    svg.append(inputDots[4]);
    fillInputDots(inputDots[5], 20, 560, 15, "#FF0000");
    svg.append(inputDots[5]);
    fillInputDots(inputDots[6], 20, 340, 15, "#FF0000");
    svg.append(inputDots[6]);
    fillInputDots(inputDots[7], 20, 440, 15, "#FF0000");
    svg.append(inputDots[7]);
}
function dotsDisappear() {
    for (const inputDot of inputDots) {
        objectDisappear(inputDot);
    }
}
function dotsAppear() {
    for (const inputDot of inputDots) {
        objectAppear(inputDot);
    }
}

function calculateAnd() {
    if (currPos === 0) {
        if (textInput[0].textContent === "0" || textInput[2].textContent === "0") {
            setter("0", inputDots[0]);
            setter("0", inputDots[2]);
        }
        if (textInput[0].textContent === "0" || textInput[3].textContent === "0") {
            setter("0", inputDots[4]);
            setter("0", inputDots[3]);
        }
        if (textInput[1].textContent === "0" || textInput[2].textContent === "0") {
            setter("0", inputDots[5]);
            setter("0", inputDots[6]);
        }
        if (textInput[1].textContent === "0" || textInput[3].textContent === "0") {
            setter("0", inputDots[7]);
            setter("0", inputDots[1]);
        }
        currPos = 1;
        objectDisappear(inputDots[7]);
    }
    else if (currPos === 1) {
        if (String(inputDots[4].style.fill) === ZERO || String(inputDots[6].style.fill) === ZERO) {
            setter("0", inputDots[4]);
            setter("0", inputDots[6]);
        }
        else {
            setter("1", inputDots[4]);
            setter("1", inputDots[6]);
        }
        currPos++;
        objectDisappear(inputDots[5]);
    }
    else if (currPos === 2) {
        if (String(inputDots[4].style.fill) === ZERO || inputDots[0].style.fill === ZERO) {

            setter("0", inputDots[4]);
            setter("0", inputDots[0]);
        }
        objectDisappear(inputDots[6]);
        objectDisappear(inputDots[4]);
    }

}

function calculateXOR() {
    if (currPos === 1) {
        if (inputDots[3].style.fill !== inputDots[5].style.fill) {
            setter("1", inputDots[3]);
            setter("1", inputDots[5]);
        }
        else {
            setter("0", inputDots[3]);
            setter("0", inputDots[5]);
        }

    }
    if (currPos === 2) {
        if (inputDots[6].style.fill !== inputDots[2].style.fill) {

            setter("1", inputDots[6]);
            setter("1", inputDots[2]);
        }
        else {
            setter("0", inputDots[6]);
            setter("0", inputDots[2]);
        }

    }
}
function inputDotDisappear() {
    for (const inputDot of inputDots) {
        fillColor(inputDot, "#008000");
    }
}

// function to disappear the output text
function outputDisappear() {
    for (const text of textOutput) {
        objectDisappear(text);
    }
}
// function to appear the output text
function outputVisible() {
    for (const text of textOutput) {
        objectAppear(text);
    }
}
function inputTextDisappear() {
    for (const text of textInput) {
        objectDisappear(text);
    }
}
function inputTextAppear() {
    for (const text of textInput) {
        if (text.textContent !== "2")
            objectAppear(text);
    }
}

function clearObservation() {
    observ.innerHTML = EMPTY;
}
function allDisappear() {
    dotsDisappear();
    inputDotDisappear();
    inputTextDisappear();
    outputDisappear();
    for (const object of objects) {
        fillColor(object, "#008000");
    }
}
function outputSetter() {

    for (let index = 0; index < textOutput.length; index++) {
        setter(textOutput[index].textContent, objects[index + 8]);
    }

}
function outputHandler() {
    let a1 = parseInt(textInput[0].textContent);
    let a0 = parseInt(textInput[1].textContent);
    let b1 = parseInt(textInput[2].textContent);
    let b0 = parseInt(textInput[3].textContent);
    let num1 = (a1 * 2) + a0;
    let num2 = (b1 * 2) + b0;
    let product = num1 * num2;
    let ans = product.toString(2).padStart(4, "0");
    for (let i = 0; i < textOutput.length; i++) {
        textOutput[i].textContent = (ans[i]);
    }

}
function appendInput1() {
    if (textInput[0].textContent !== "0" && timeline.progress() === 0) {
        changeTo0(15, 225, 0, 0);
    }
    else if (textInput[0].textContent !== "1" && timeline.progress() === 0) {
        changeTo1(15, 225, 0, 0);
    }
    setter(textInput[0].textContent, inputDots[0]);
    setter(textInput[0].textContent, inputDots[4]);
}


function appendInput2() {
    if (textInput[1].textContent !== "0" && timeline.progress() === 0) {
        changeTo0(15, 565, 1, 1);
    }
    else if (textInput[1].textContent !== "1" && timeline.progress() === 0) {
        changeTo1(15, 565, 1, 1);
    }
    setter(textInput[1].textContent, inputDots[1]);
    setter(textInput[1].textContent, inputDots[5]);
}
function appendInput3() {
    if (textInput[2].textContent !== "0" && timeline.progress() === 0) {
        changeTo0(15, 345, 2, 2);
    }
    else if (textInput[1].textContent !== "1" && timeline.progress() === 0) {
        changeTo1(15, 345, 2, 2);
    }
    setter(textInput[2].textContent, inputDots[2]);
    setter(textInput[2].textContent, inputDots[6]);
}
function appendInput4() {
    if (textInput[3].textContent !== "0" && timeline.progress() === 0) {
        changeTo0(15, 445, 3, 3);
    }
    else if (textInput[3].textContent !== "1" && timeline.progress() === 0) {
        changeTo1(15, 445, 3, 3);
    }
    setter(textInput[3].textContent, inputDots[3]);
    setter(textInput[3].textContent, inputDots[7]);
}

function changeTo1(coordinateX, coordinateY, object, textObject) {

    textInput[textObject].textContent = 1;
    svg.appendChild(textInput[textObject]);
    setCoordinates(coordinateX, coordinateY, textInput[textObject]);

    fillColor(objects[object], "#29e");
    fillColor(objects[object + 4], "#29e");
    inputTextAppear();
    clearObservation();
}

function changeTo0(coordinateX, coordinateY, object, textObject) {

    textInput[textObject].textContent = 0;
    svg.appendChild(textInput[textObject]);
    setCoordinates(coordinateX, coordinateY, textInput[textObject]);

    fillColor(objects[object], "#eeeb22");
    fillColor(objects[object + 4], "#eeeb22");
    inputTextAppear();
    clearObservation();
}

function reboot() {
    for (const elements of objects) {
        elements.style.fill = "#008000";
    }
    for (const text of textInput) {
        text.textContent = 2;
    }

}
function display() {
    observ.innerHTML = "Simulation has finished. Please click on Reset and repeat the instructions given to start again.";
    observ.innerHTML += "<br />";
}
function setter(value, component) {
    //toggles the text content a of input/output component b
    if (value === "1") {
        unsetColor(component);

    }
    else if (value === "0") {
        setColor(component);
    }
}
function setSpeed(speed) {
    if (circuitStarted) {
        timeline.timeScale(parseInt(speed));
        observ.innerHTML = `${speed}x speed`;
    }
}
function restartCircuit() {
    if (!circuitStarted) {
        circuitStarted = true;
    }
    timeline.seek(0);
    timeline.pause();
    allDisappear();
    reboot();
    currPos = 0;
    clearObservation();
    decide = false;
    status.innerHTML = "Start";
    observ.innerHTML = "Successfully restored";
    speed.selectedIndex = 0;
}

function simulationStatus() {
    if (!decide) {
        startCircuit();

    }
    else if (decide) {
        stopCircuit();

    }
}
function stopCircuit() {
    if (timeline.time() !== 0 && timeline.progress() !== 1) {
        timeline.pause();
        observ.innerHTML = "Simulation has been Paused. Please click on the 'Start' button to Resume.";
        decide = false;
        status.innerHTML = "Start";
        speed.selectedIndex = 0;
    }
    else if (timeline.progress() === 1) {
        observ.innerHTML = "Please Restart the simulation";
    }
}
function startCircuit() {
    if (textInput[0].textContent !== "2" && textInput[1].textContent !== "2" && textInput[2].textContent !== "2" && textInput[3].textContent !== "2") {
        if (!circuitStarted) {
            circuitStarted = true;
        }
        timeline.play();
        timeline.timeScale(1);
        observ.innerHTML = "Simulation has started.";
        decide = true;
        status.innerHTML = "Pause";
        speed.selectedIndex = 0;
        if (timeline.progress() === 1) {
            observ.innerHTML = "Please Restart the simulation";
        }
    }
    else if (textInput[0].textContent === "2") {
        observ.innerHTML = "Please set the value of A1 to 0 or 1";
    }
    else if (textInput[1].textContent === "2") {
        observ.innerHTML = "Please set the value of A0 to 0 or 1";
    }
    else if (textInput[2].textContent === "2") {
        observ.innerHTML = "Please set the value of B1 to 0 or 1";
    }
    else if (textInput[3].textContent === "2") {
        observ.innerHTML = "Please set the value of B0 to 0 or 1";
    }
}

function simulator() {
    timeline.to(inputDots[0], {
        motionPath: {
            path: "#path1",
            align: "#path1",
            autoRotate: true,
            alignOrigin: [0.5, 0.5]
        },

        duration: 4,
        repeat: 0,
        repeatDelay: 3,
        yoyo: true,
        ease: "none",
        paused: false,

    }, 0);
    timeline.to(inputDots[0], {
        motionPath: {
            path: "#path13",
            align: "#path13",
            autoRotate: true,
            alignOrigin: [0.5, 0.5]
        },

        duration: 10,
        delay: 6,
        repeat: 0,
        repeatDelay: 3,
        yoyo: true,
        ease: "none",
        paused: false,

    }, 0);
    timeline.to(inputDots[0], {
        motionPath: {
            path: "#path16",
            align: "#path16",
            autoRotate: true,
            alignOrigin: [0.5, 0.5]
        },

        duration: 4,
        delay: 18,
        repeat: 0,
        repeatDelay: 3,
        yoyo: true,
        ease: "none",
        paused: false,

    }, 0);
    timeline.to(inputDots[4], {
        motionPath: {
            path: "#path2",
            align: "#path2",
            autoRotate: true,
            alignOrigin: [0.5, 0.5]
        },

        duration: 4,
        repeat: 0,
        repeatDelay: 3,
        yoyo: true,
        ease: "none",
        paused: false,

    }, 0);
    timeline.to(inputDots[4], {
        motionPath: {
            path: "#path9",
            align: "#path9",
            autoRotate: true,
            alignOrigin: [0.5, 0.5]
        },

        duration: 4,
        delay: 6,
        repeat: 0,
        repeatDelay: 3,
        yoyo: true,
        ease: "none",
        paused: false,

    }, 0);
    timeline.to(inputDots[4], {
        motionPath: {
            path: "#path20",
            align: "#path20",
            autoRotate: true,
            alignOrigin: [0.5, 0.5]
        },

        duration: 4,
        delay: 12,
        repeat: 0,
        repeatDelay: 3,
        yoyo: true,
        ease: "none",
        paused: false,

    }, 0);
    timeline.to(inputDots[1], {
        motionPath: {
            path: "#path7",
            align: "#path7",
            autoRotate: true,
            alignOrigin: [0.5, 0.5]
        },

        duration: 4,
        repeat: 0,
        repeatDelay: 3,
        yoyo: true,
        ease: "none",
        paused: false,

    }, 0);
    timeline.to(inputDots[1], {
        motionPath: {
            path: "#path19",
            align: "#path19",
            autoRotate: true,
            alignOrigin: [0.5, 0.5]
        },

        duration: 16,
        delay: 6,
        repeat: 0,
        repeatDelay: 3,
        yoyo: true,
        ease: "none",
        paused: false,

    }, 0);
    timeline.to(inputDots[5], {
        motionPath: {
            path: "#path8",
            align: "#path8",
            autoRotate: true,
            alignOrigin: [0.5, 0.5]
        },

        duration: 4,
        repeat: 0,
        repeatDelay: 3,
        yoyo: true,
        ease: "none",
        paused: false,

    }, 0);
    timeline.to(inputDots[5], {
        motionPath: {
            path: "#path11",
            align: "#path11",
            autoRotate: true,
            alignOrigin: [0.5, 0.5]
        },

        duration: 4,
        delay: 6,
        repeat: 0,
        repeatDelay: 3,
        yoyo: true,
        ease: "none",
        paused: false,

    }, 0);
    timeline.to(inputDots[2], {
        motionPath: {
            path: "#path3",
            align: "#path3",
            autoRotate: true,
            alignOrigin: [0.5, 0.5]
        },

        duration: 4,
        repeat: 0,
        repeatDelay: 3,
        yoyo: true,
        ease: "none",
        paused: false,

    }, 0);
    timeline.to(inputDots[2], {
        motionPath: {
            path: "#path14",
            align: "#path14",
            autoRotate: true,
            alignOrigin: [0.5, 0.5]
        },

        duration: 10,
        delay: 6,
        repeat: 0,
        repeatDelay: 3,
        yoyo: true,
        ease: "none",
        paused: false,

    }, 0);
    timeline.to(inputDots[2], {
        motionPath: {
            path: "#path17",
            align: "#path17",
            autoRotate: true,
            alignOrigin: [0.5, 0.5]
        },

        duration: 4,
        delay: 18,
        repeat: 0,
        repeatDelay: 3,
        yoyo: true,
        ease: "none",
        paused: false,

    }, 0);
    timeline.to(inputDots[6], {
        motionPath: {
            path: "#path4",
            align: "#path4",
            autoRotate: true,
            alignOrigin: [0.5, 0.5]
        },

        duration: 4,
        repeat: 0,
        repeatDelay: 3,
        yoyo: true,
        ease: "none",
        paused: false,

    }, 0);
    timeline.to(inputDots[6], {
        motionPath: {
            path: "#path12",
            align: "#path12",
            autoRotate: true,
            alignOrigin: [0.5, 0.5]
        },

        duration: 4,
        delay: 6,
        repeat: 0,
        repeatDelay: 3,
        yoyo: true,
        ease: "none",
        paused: false,

    }, 0);
    timeline.to(inputDots[6], {
        motionPath: {
            path: "#path15",
            align: "#path15",
            autoRotate: true,
            alignOrigin: [0.5, 0.5]
        },

        duration: 4,
        delay: 12,
        repeat: 0,
        repeatDelay: 3,
        yoyo: true,
        ease: "none",
        paused: false,

    }, 0);

    timeline.to(inputDots[3], {
        motionPath: {
            path: "#path5",
            align: "#path5",
            autoRotate: true,
            alignOrigin: [0.5, 0.5]
        },

        duration: 4,
        repeat: 0,
        repeatDelay: 3,
        yoyo: true,
        ease: "none",
        paused: false,

    }, 0);
    timeline.to(inputDots[3], {
        motionPath: {
            path: "#path10",
            align: "#path10",
            autoRotate: true,
            alignOrigin: [0.5, 0.5]
        },

        duration: 4,
        delay: 6,
        repeat: 0,
        repeatDelay: 3,
        yoyo: true,
        ease: "none",
        paused: false,

    }, 0);
    timeline.to(inputDots[3], {
        motionPath: {
            path: "#path18",
            align: "#path18",
            autoRotate: true,
            alignOrigin: [0.5, 0.5]
        },

        duration: 10,
        delay: 12,
        repeat: 0,
        repeatDelay: 3,
        yoyo: true,
        ease: "none",
        paused: false,

    }, 0);
    timeline.to(inputDots[7], {
        motionPath: {
            path: "#path6",
            align: "#path6",
            autoRotate: true,
            alignOrigin: [0.5, 0.5]
        },

        duration: 4,
        repeat: 0,
        repeatDelay: 3,
        yoyo: true,
        ease: "none",
        paused: false,

    }, 0);

}

//execution starts here
let timeline = gsap.timeline({ repeat: 0, repeatDelay: 0 });
gsap.registerPlugin(MotionPathPlugin);
demoWidth();
textIOInit();
outputCoordinates();
initInputDots();
outputDisappear();

timeline.add(inputTextAppear, 0);
timeline.add(dotsAppear, 0);
timeline.add(simulator, 0);
timeline.add(calculateAnd, 5);
timeline.add(simulator, 6);
timeline.add(calculateXOR, 11);
timeline.add(calculateAnd, 11);
timeline.add(simulator, 12);
timeline.add(calculateXOR, 17);
timeline.add(calculateAnd, 17);
timeline.add(simulator, 18);
timeline.add(outputHandler, 22);
timeline.add(outputSetter, 22);
timeline.add(outputVisible, 22);
timeline.add(dotsDisappear, 22);
timeline.add(outputVisible, 23);

timeline.add(display, 24);
timeline.eventCallback("onComplete", outputVisible);
timeline.eventCallback("onComplete", display);
timeline.pause();
dotsDisappear();