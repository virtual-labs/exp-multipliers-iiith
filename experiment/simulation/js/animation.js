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
const instructionBox = document.getElementsByClassName("instructions-box")[0];
const svg = document.querySelector(".svg");
const svgns = "http://www.w3.org/2000/svg";

const EMPTY = "";
const ZERO="rgb(238, 235, 34)"
const STATUS = document.getElementById("play-or-pause");
const OBSERV = document.getElementById("observations");
const SPEED = document.getElementById("speed");

let currPos = 0;

const OBJECTS = [document.getElementById("a1"), document.getElementById("a0"), document.getElementById("b1"), document.getElementById("b0"), document.getElementById("a1"), document.getElementById("a0"), document.getElementById("b1"), document.getElementById("b0"), document.getElementById("c3"), document.getElementById("c2"), document.getElementById("c1"), document.getElementById("c0")];
const ARRAYA = [document.getElementById("a1"), document.getElementById("a0")];
const ARRAYB = [document.getElementById("b1"), document.getElementById("b0")];
const TEXTINPUT = [document.createElementNS(svgns, "text"), document.createElementNS(svgns, "text"), document.createElementNS(svgns, "text"), document.createElementNS(svgns, "text")];
const TEXTOUTPUT = [document.createElementNS(svgns, "text"), document.createElementNS(svgns, "text"), document.createElementNS(svgns, "text"), document.createElementNS(svgns, "text")];
const INPUTDOTS = [document.createElementNS(svgns, "circle"), document.createElementNS(svgns, "circle"), document.createElementNS(svgns, "circle"), document.createElementNS(svgns, "circle"), document.createElementNS(svgns, "circle"), document.createElementNS(svgns, "circle"), document.createElementNS(svgns, "circle"), document.createElementNS(svgns, "circle")];

let timeline = gsap.timeline({ repeat: 0, repeatDelay: 0 });
let decide = 0;
let circuitStarted = 0;

function demoWidth() {
    if (width < 1024) {
        circuitBoard.style.height = "600px";
    } else {
        circuitBoard.style.height = `${windowHeight - circuitBoardTop - 20}px`;
    }
    sidePanels[0].style.height = circuitBoard.style.height;
}
// Instruction box
function instructionBoxInit() {
    instructionBox.addEventListener("click", () => {
        instructionBox.classList.toggle("expand");
    });
}
//initialise input text
function textIOInit() {
    for (const text of TEXTINPUT) {
        text.textContent = 2;
    }
}

function outputCoordinates() {
    let xcor = 695;
    setCoordinates(xcor, 210, TEXTOUTPUT[0]);
    svg.append(TEXTOUTPUT[0]);
    setCoordinates(xcor, 345, TEXTOUTPUT[1]);
    svg.append(TEXTOUTPUT[1]);
    setCoordinates(xcor, 465, TEXTOUTPUT[2]);
    svg.append(TEXTOUTPUT[2]);
    setCoordinates(xcor, 545, TEXTOUTPUT[3]);
    svg.append(TEXTOUTPUT[3]);
}


function inputDots() {
    //sets the coordinates of the input dots
    fillInputDots(INPUTDOTS[0], 20, 220, 15, "#FF0000");
    svg.append(INPUTDOTS[0]);
    fillInputDots(INPUTDOTS[1], 20, 560, 15, "#FF0000");
    svg.append(INPUTDOTS[1]);
    fillInputDots(INPUTDOTS[2], 20, 340, 15, "#FF0000");
    svg.append(INPUTDOTS[2]);
    fillInputDots(INPUTDOTS[3], 20, 440, 15, "#FF0000");
    svg.append(INPUTDOTS[3]);
    fillInputDots(INPUTDOTS[4], 20, 220, 15, "#FF0000");
    svg.append(INPUTDOTS[4]);
    fillInputDots(INPUTDOTS[5], 20, 560, 15, "#FF0000");
    svg.append(INPUTDOTS[5]);
    fillInputDots(INPUTDOTS[6], 20, 340, 15, "#FF0000");
    svg.append(INPUTDOTS[6]);
    fillInputDots(INPUTDOTS[7], 20, 440, 15, "#FF0000");
    svg.append(INPUTDOTS[7]);
}
function dotsDisappear() {
    for (const inputDot of INPUTDOTS) {
        objectDisappear(inputDot);
    }
}
function dotsAppear() {
    for (const inputDot of INPUTDOTS) {
        objectAppear(inputDot);
    }
}

function computeAnd() {
    if (currPos === 0) {
        if (TEXTINPUT[0].textContent === "0" || TEXTINPUT[2].textContent === "0") {
            setter("0", INPUTDOTS[0]);
            setter("0", INPUTDOTS[2]);
        }
        if (TEXTINPUT[0].textContent === "0" || TEXTINPUT[3].textContent === "0") {
            setter("0", INPUTDOTS[4]);
            setter("0", INPUTDOTS[3]);
        }
        if (TEXTINPUT[1].textContent === "0" || TEXTINPUT[2].textContent === "0") {
            setter("0", INPUTDOTS[5]);
            setter("0", INPUTDOTS[6]);
        }
        if (TEXTINPUT[1].textContent === "0" || TEXTINPUT[3].textContent === "0") {
            setter("0", INPUTDOTS[7]);
            setter("0", INPUTDOTS[1]);
        }
        currPos = 1;
        objectDisappear(INPUTDOTS[7]);
    }
    else if (currPos === 1) {
        if (String(INPUTDOTS[4].style.fill) === ZERO || String(INPUTDOTS[6].style.fill) === ZERO) {
            setter("0", INPUTDOTS[4]);
            setter("0", INPUTDOTS[6]);
        }
        else {
            setter("1", INPUTDOTS[4]);
            setter("1", INPUTDOTS[6]);
        }
        currPos++;
        objectDisappear(INPUTDOTS[5]);
    }
    else if (currPos === 2) {
        if (String(INPUTDOTS[4].style.fill) === ZERO || INPUTDOTS[0].style.fill === ZERO) {

            setter("0", INPUTDOTS[4]);
            setter("0", INPUTDOTS[0]);
        }
        objectDisappear(INPUTDOTS[6]);
        objectDisappear(INPUTDOTS[4]);
    }

}

function computeXor() {
    if (currPos === 1) {
        if (INPUTDOTS[3].style.fill !== INPUTDOTS[5].style.fill) {
            setter("1", INPUTDOTS[3]);
            setter("1", INPUTDOTS[5]);
        }
        else {
            setter("0", INPUTDOTS[3]);
            setter("0", INPUTDOTS[5]);
        }

    }
    if (currPos === 2) {
        if (INPUTDOTS[6].style.fill !== INPUTDOTS[2].style.fill) {

            setter("1", INPUTDOTS[6]);
            setter("1", INPUTDOTS[2]);
        }
        else {
            setter("0", INPUTDOTS[6]);
            setter("0", INPUTDOTS[2]);
        }

    }
}
function inputDotDisappear() {
    for (const inputDot of INPUTDOTS) {
        fillColor(inputDot, "#008000");
    }
}

// function to disappear the output text
function outputDisappear() {
    for (const text of TEXTOUTPUT) {
        objectDisappear(text);
    }
}
// function to appear the output text
function outputVisible() {
    for (const text of TEXTOUTPUT) {
        objectAppear(text);
    }
}
function inputTextDisappear() {
    for (const text of TEXTINPUT) {
        objectDisappear(text);
    }
}
function inputTextAppear() {
    for (const text of TEXTINPUT) {
        if (text.textContent !== "2")
            objectAppear(text);
    }
}

function clearObservation() {
    OBSERV.innerHTML = EMPTY;
}
function allDisappear() {
    dotsDisappear();
    inputDotDisappear();
    inputTextDisappear();
    outputDisappear();
    for (const object of OBJECTS) {
        fillColor(object, "#008000");
    }
}
function outputSetter() {

    for (let index = 0; index < TEXTOUTPUT.length; index++) {
        setter(TEXTOUTPUT[index].textContent, OBJECTS[index + 8]);
    }

}
function outputHandler() {
    let a1 = parseInt(TEXTINPUT[0].textContent);
    let a0 = parseInt(TEXTINPUT[1].textContent);
    let b1 = parseInt(TEXTINPUT[2].textContent);
    let b0 = parseInt(TEXTINPUT[3].textContent);
    let num1 = (a1 * 2) + a0;
    let num2 = (b1 * 2) + b0;
    let product = num1 * num2;
    let ans = product.toString(2).padStart(4, "0");
    for (let i = 0; i < TEXTOUTPUT.length; i++) {
        TEXTOUTPUT[i].textContent = (ans[i]);
    }

}
function appendInput1() {
    if (TEXTINPUT[0].textContent !== "0" && timeline.progress() === 0) {
        changeTo0(15, 225, 0, 0);
    }
    else if (TEXTINPUT[0].textContent !== "1" && timeline.progress() === 0) {
        changeTo1(15, 225, 0, 0);
    }
    setter(TEXTINPUT[0].textContent, INPUTDOTS[0]);
    setter(TEXTINPUT[0].textContent, INPUTDOTS[4]);
}


function appendInput2() {
    if (TEXTINPUT[1].textContent !== "0" && timeline.progress() === 0) {
        changeTo0(15, 565, 1, 1);
    }
    else if (TEXTINPUT[1].textContent !== "1" && timeline.progress() === 0) {
        changeTo1(15, 565, 1, 1);
    }
    setter(TEXTINPUT[1].textContent, INPUTDOTS[1]);
    setter(TEXTINPUT[1].textContent, INPUTDOTS[5]);
}
function appendInput3() {
    if (TEXTINPUT[2].textContent !== "0" && timeline.progress() === 0) {
        changeTo0(15, 345, 2, 2);
    }
    else if (TEXTINPUT[1].textContent !== "1" && timeline.progress() === 0) {
        changeTo1(15, 345, 2, 2);
    }
    setter(TEXTINPUT[2].textContent, INPUTDOTS[2]);
    setter(TEXTINPUT[2].textContent, INPUTDOTS[6]);
}
function appendInput4() {
    if (TEXTINPUT[3].textContent !== "0" && timeline.progress() === 0) {
        changeTo0(15, 445, 3, 3);
    }
    else if (TEXTINPUT[3].textContent !== "1" && timeline.progress() === 0) {
        changeTo1(15, 445, 3, 3);
    }
    setter(TEXTINPUT[3].textContent, INPUTDOTS[3]);
    setter(TEXTINPUT[3].textContent, INPUTDOTS[7]);
}

function changeTo1(coordinateX, coordinateY, object, textObject) {

    TEXTINPUT[textObject].textContent = 1;
    svg.appendChild(TEXTINPUT[textObject]);
    setCoordinates(coordinateX, coordinateY, TEXTINPUT[textObject]);

    fillColor(OBJECTS[object], "#29e");
    fillColor(OBJECTS[object + 4], "#29e");
    inputTextAppear();
    clearObservation();
}

function changeTo0(coordinateX, coordinateY, object, textObject) {

    TEXTINPUT[textObject].textContent = 0;
    svg.appendChild(TEXTINPUT[textObject]);
    setCoordinates(coordinateX, coordinateY, TEXTINPUT[textObject]);

    fillColor(OBJECTS[object], "#eeeb22");
    fillColor(OBJECTS[object + 4], "#eeeb22");
    inputTextAppear();
    clearObservation();
}

function reboot() {
    for (const elements of ARRAYA) {
        elements.style.fill = "#008000";
    }
    for (const elements of ARRAYB) {
        elements.style.fill = "#008000";
    }
    for (const text of TEXTINPUT) {
        text.textContent = 2;
    }

}
function display() {
    OBSERV.innerHTML = "Simulation has finished. Press Reset to start again";
    OBSERV.innerHTML += "<br />";
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

function changeSpeed(newSpeed) {

    if (TEXTINPUT[0].textContent !== "2" && TEXTINPUT[1].textContent !== "2" && TEXTINPUT[2].textContent !== "2" && TEXTINPUT[3].textContent !== "2" && timeline.progress() !== 1) {
        timeline.resume();
        timeline.timeScale(newSpeed);
        OBSERV.innerHTML = newSpeed + "x speed";
        decide = 1;
        STATUS.innerHTML = "Pause";
    }
}
function setSpeed(speed) {
    if (circuitStarted !== 0) {


        if (speed === "1") {
            startCircuit();
        }
        else if (speed === "2") {
            changeSpeed(2);
        }
        else if (speed === "4") {
            changeSpeed(4);
        }
    }


}
function restartCircuit() {
    if (circuitStarted === 0) {
        circuitStarted = 1;
    }
    timeline.seek(0);
    timeline.pause();
    allDisappear();
    reboot();
    currPos = 0;
    clearObservation();
    decide = 0;
    STATUS.innerHTML = "Start";
    OBSERV.innerHTML = "Successfully restored";
    SPEED.selectedIndex = 0;
}

function simulationStatus() {
    if (decide === 0) {
        startCircuit();

    }
    else if (decide === 1) {
        stopCircuit();

    }
}
function stopCircuit() {
    if (timeline.time() !== 0 && timeline.progress() !== 1) {
        timeline.pause();
        OBSERV.innerHTML = "Simulation has been stopped.";
        decide = 0;
        STATUS.innerHTML = "Start";
        SPEED.selectedIndex = 0;
    }
    else if (timeline.progress() === 1) {
        OBSERV.innerHTML = "Please Restart the simulation";
    }
}
function startCircuit() {
    if(TEXTINPUT[0].textContent !== "2" && TEXTINPUT[1].textContent !== "2" && TEXTINPUT[2].textContent !== "2" && TEXTINPUT[3].textContent !== "2"){
        if (circuitStarted === 0) {
            circuitStarted = 1;
        }
        timeline.play();
        timeline.timeScale(1);
        OBSERV.innerHTML = "Simulation has started.";
        decide = 1;
        STATUS.innerHTML = "Pause";
        SPEED.selectedIndex = 0;
        if (timeline.progress() === 1) {
            OBSERV.innerHTML = "Please Restart the simulation";
        }
    }
    else if (TEXTINPUT[0].textContent === "2" ){
        OBSERV.innerHTML = "Please set the value of A1 to 0 or 1";
    }
    else if (TEXTINPUT[1].textContent === "2" ){
        OBSERV.innerHTML = "Please set the value of A0 to 0 or 1";
    }
    else if (TEXTINPUT[2].textContent === "2" ){
        OBSERV.innerHTML = "Please set the value of B1 to 0 or 1";
    }
    else if (TEXTINPUT[3].textContent === "2" ){
        OBSERV.innerHTML = "Please set the value of B0 to 0 or 1";
    }
}

function simulator() {
    timeline.to(INPUTDOTS[0], {
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
    timeline.to(INPUTDOTS[0], {
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
    timeline.to(INPUTDOTS[0], {
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
    timeline.to(INPUTDOTS[4], {
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
    timeline.to(INPUTDOTS[4], {
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
    timeline.to(INPUTDOTS[4], {
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
    timeline.to(INPUTDOTS[1], {
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
    timeline.to(INPUTDOTS[1], {
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
    timeline.to(INPUTDOTS[5], {
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
    timeline.to(INPUTDOTS[5], {
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
    timeline.to(INPUTDOTS[2], {
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
    timeline.to(INPUTDOTS[2], {
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
    timeline.to(INPUTDOTS[2], {
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
    timeline.to(INPUTDOTS[6], {
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
    timeline.to(INPUTDOTS[6], {
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
    timeline.to(INPUTDOTS[6], {
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

    timeline.to(INPUTDOTS[3], {
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
    timeline.to(INPUTDOTS[3], {
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
    timeline.to(INPUTDOTS[3], {
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
    timeline.to(INPUTDOTS[7], {
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
gsap.registerPlugin(MotionPathPlugin);
demoWidth();
instructionBoxInit();
textIOInit();
outputCoordinates();
inputDots();
outputDisappear();

timeline.add(inputTextAppear, 0);
timeline.add(dotsAppear, 0);
timeline.add(simulator, 0);
timeline.add(computeAnd, 5);
timeline.add(simulator, 6);
timeline.add(computeXor, 11);
timeline.add(computeAnd, 11);
timeline.add(simulator, 12);
timeline.add(computeXor, 17);
timeline.add(computeAnd, 17);
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