import { setCoordinates, fillInputDots, objectDisappear, objectAppear, fillColor, setColor, unsetColor } from "./animation-utility.js";
'use strict';

window.simulationStatus = simulationStatus;
window.restartCircuit = restartCircuit;
window.setSpeed = setSpeed;
window.appendInput1=appendInput1
window.appendInput2=appendInput2
window.appendInput3=appendInput3
window.appendInput4=appendInput4
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
const STATUS = document.getElementById("play-or-pause");
const OBSERV = document.getElementById("observations");
const SPEED = document.getElementById("speed");

let currPos = 0;

const OBJECTS = [document.getElementById("a1"), document.getElementById("a0"), document.getElementById("b1"), document.getElementById("b0"),document.getElementById("a1"), document.getElementById("a0"), document.getElementById("b1"), document.getElementById("b0"), document.getElementById("c3"), document.getElementById("c2"),document.getElementById("c1"), document.getElementById("c0")];
const ARRAYA = [document.getElementById("a1"), document.getElementById("a0")];
const ARRAYB = [document.getElementById("b1"), document.getElementById("b0")];
const TEXTINPUT = [document.createElementNS(svgns, "text"), document.createElementNS(svgns, "text"),document.createElementNS(svgns, "text"), document.createElementNS(svgns, "text")];
//const TEXTCLOCK = [document.createElementNS(svgns, "text")];
const TEXTOUTPUT = [document.createElementNS(svgns, "text"),document.createElementNS(svgns, "text"),document.createElementNS(svgns, "text"),document.createElementNS(svgns, "text")];
const INPUTDOTS = [document.createElementNS(svgns, "circle"), document.createElementNS(svgns, "circle"), document.createElementNS(svgns, "circle"),document.createElementNS(svgns, "circle"),document.createElementNS(svgns, "circle"),document.createElementNS(svgns, "circle"),document.createElementNS(svgns, "circle"),document.createElementNS(svgns, "circle")];

const inputStream = [[0, 0, 1, 1, 0, 0, 1, 1], [0, 1, 0, 1, 0, 1, 0, 1]];
const outputStream = [0, 1, 0, 0, 0, 1, 0, 0];


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

function setActive(i) {
    if (i === 0) {
        ARRAYA[i].style.fill = "#eeeb22";
        ARRAYB[i].style.fill = "#eeeb22";
    }
    else {
        ARRAYA[i - 1].style.fill = "#29e";
        ARRAYB[i - 1].style.fill = "#29e";
        ARRAYA[i].style.fill = "#eeeb22";
        ARRAYB[i].style.fill = "#eeeb22";
    }
}

//initialise input text
function textIOInit() {
    for (const text of TEXTINPUT) {
        text.textContent = 2;
    }
}
//initialise clock text
// function textClockInit() {
//     for (const text of TEXTCLOCK) {
//         text.textContent = 2;
//     }
// }

function outputCoordinates() {
    let xcor = 700;
    setCoordinates(xcor, 205, TEXTOUTPUT[0]);
    svg.append(TEXTOUTPUT[0]);
    setCoordinates(xcor, 340, TEXTOUTPUT[1]);
    svg.append(TEXTOUTPUT[1]);
    setCoordinates(xcor, 460, TEXTOUTPUT[2]);
    svg.append(TEXTOUTPUT[2]);
    setCoordinates(xcor, 540, TEXTOUTPUT[3]);
    svg.append(TEXTOUTPUT[3]);    
}


function inputDots() {
    //sets the coordinates of the input dots
    //for (const inputDot of INPUTDOTS) {
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

    //}
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
    if(currPos===0)
    {
        if(TEXTINPUT[0].textContent==0 || TEXTINPUT[2].textContent==0)
        {
            setter("0",INPUTDOTS[0]);
            setter("0",INPUTDOTS[2]);
        }
        if(TEXTINPUT[0].textContent==0 || TEXTINPUT[3].textContent==0)
        {
            setter("0",INPUTDOTS[4]);
            setter("0",INPUTDOTS[3]);
        }
        if(TEXTINPUT[1].textContent==0 || TEXTINPUT[2].textContent==0)
        {
            setter("0",INPUTDOTS[5]);
            setter("0",INPUTDOTS[6]);
        }
        if(TEXTINPUT[1].textContent==0 || TEXTINPUT[3].textContent==0)
        {
            setter("0",INPUTDOTS[7]);
            setter("0",INPUTDOTS[1]);
        }
        currPos=1;;
    }
    else if(currPos==1)
    {
        console.log(String(INPUTDOTS[4].style.fill))
        if(String(INPUTDOTS[4].style.fill)==="rgb(34, 153, 238)"|| String(INPUTDOTS[6].style.fill)==="rgb(34, 153, 238)")
        {
            console.log("and");
            setter("0",INPUTDOTS[4]);
            setter("0",INPUTDOTS[6]);
        }
        currPos++;
    }
    else if(currPos==2)
    {
        if(String(INPUTDOTS[4].style.fill)==="rgb(34, 153, 238)"||INPUTDOTS[0].style.fill==="rgb(34, 153, 238)")
        {
            
            setter("0",INPUTDOTS[4]);
            setter("0",INPUTDOTS[0]);
        }
        
    }
    
}

function computeXor() {
    console.log(currPos)
    if(currPos==1)
    {
        console.log("here");
        if(INPUTDOTS[3].style.fill!=INPUTDOTS[5].style.fill)
        {
            console.log("xor");
            setter("1",INPUTDOTS[3]);
            setter("1",INPUTDOTS[5]);
        }
        else{
            setter("0",INPUTDOTS[3]);
            setter("0",INPUTDOTS[5]);
        }
        
    }
    if(currPos==2)
    {
        console.log("here");
        if(INPUTDOTS[6].style.fill!=INPUTDOTS[2].style.fill)
        {
            
            setter("1",INPUTDOTS[6]);
            setter("1",INPUTDOTS[2]);
        }
        else{
            setter("0",INPUTDOTS[6]);
            setter("0",INPUTDOTS[2]);
        }
        
    }
}


function inputDotDisappear() {
    for (const inputDot of INPUTDOTS) {
        fillColor(inputDot, "#008000");
    }
}

function yDotDisappear() {
    objectDisappear(INPUTDOTS[1]);
}

function ffDotDisapper() {
    objectDisappear(INPUTDOTS[2]);
}

// function to disappear the output text
function outputDisappear() {
    for (const text of TEXTOUTPUT) {
        objectDisappear(text);
    }
}
// function to appear the input text
function outputVisible() {
    for (const text of TEXTOUTPUT) {
        objectAppear(text);
    }
}
function inputTextDisappear() {
    //objectDisappear(TEXTINPUT[0]);
    for(const text of TEXTINPUT) {
        objectDisappear(text);
    }
}
function inputTextAppear() {
    for(const text of TEXTINPUT) {
        if(text.textContent!=="2")
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
    //yTextDisappear();
    //clockDisappear();
    outputDisappear();
    //  for (const object of OBJECTS) {
    //      fillColor(object, "#008000");
    //  }
}
function outputHandler() {
    let state = currPos;
    TEXTOUTPUT[0].textContent = outputStream[state];
    setter(TEXTOUTPUT[0].textContent,OBJECTS[3]);
    setter(outputStream[state], INPUTDOTS[2]);
}
function appendInput1() {
    if (TEXTINPUT[0].textContent !== "0" && timeline.progress() === 0) {
        changeto0(20,220,0,0);
        //changeto0(20,220,4,4);
    }
    else if (TEXTINPUT[0].textContent !== "1" && timeline.progress() === 0) {
        changeto1(20,220,0,0);
        //changeto0(20,220,4,4);
    }
    setter(TEXTINPUT[0].textContent,INPUTDOTS[0]);
    setter(TEXTINPUT[0].textContent,INPUTDOTS[4]);
}


function appendInput2() {
    if (TEXTINPUT[1].textContent !== "0" && timeline.progress() === 0) {
        changeto0(20,560,1,1);
        //changeto0(20,560,5,5);
    }
    else if (TEXTINPUT[1].textContent !== "1" && timeline.progress() === 0) {
        changeto1(20,560,1,1);
        //changeto0(20,560,5,5);
    }
    setter(TEXTINPUT[1].textContent,INPUTDOTS[1]);
    setter(TEXTINPUT[1].textContent,INPUTDOTS[5]);
}
function appendInput3() {
    if (TEXTINPUT[2].textContent !== "0" && timeline.progress() === 0) {
        changeto0(20,340,2,2);
        //changeto0(20,340,6,6);
    }
    else if (TEXTINPUT[1].textContent !== "1" && timeline.progress() === 0) {
        changeto1(20,340,2,2);
        //changeto0(20,340,6,6);
    }
    setter(TEXTINPUT[2].textContent,INPUTDOTS[2]);
    setter(TEXTINPUT[2].textContent,INPUTDOTS[6]);
}
function appendInput4() {
    if (TEXTINPUT[3].textContent !== "0" && timeline.progress() === 0) {
        changeto0(20,440,3,3);
        //changeto0(20,340,7,7);
    }
    else if (TEXTINPUT[3].textContent !== "1" && timeline.progress() === 0) {
        changeto1(20,440,3,3);
        //changeto0(20,340,7,7);
    }
    setter(TEXTINPUT[3].textContent,INPUTDOTS[3]);
    setter(TEXTINPUT[3].textContent,INPUTDOTS[7]);
}

function changeto1(coordinateX,coordinateY,object,textObject) {
    
    TEXTINPUT[textObject].textContent = 1;
    svg.appendChild(TEXTINPUT[textObject]);
    setCoordinates(coordinateX,coordinateY,TEXTINPUT[textObject]);
    
    fillColor(OBJECTS[object],"#29e");
    fillColor(OBJECTS[object+4],"#29e");
    inputTextAppear();
    clearObservation();
}

function changeto0(coordinateX,coordinateY,object,textObject) {
    
    TEXTINPUT[textObject].textContent = 0;
    svg.appendChild(TEXTINPUT[textObject]);
    setCoordinates(coordinateX,coordinateY,TEXTINPUT[textObject]);
    
    fillColor(OBJECTS[object],"#eeeb22");
    fillColor(OBJECTS[object+4],"#eeeb22");
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
    // for (const text of TEXTCLOCK) {
    //     text.textContent = 2;
    // }
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

    if (TEXTINPUT[0].textContent !== "2" && TEXTINPUT[1].textContent !== "2" && TEXTINPUT[2].textContent !== "2" && TEXTINPUT[3].textContent !== "2"  && timeline.progress() !== 1) {
        timeline.resume();
        timeline.timeScale(newSpeed);
        OBSERV.innerHTML = newSpeed + "x speed";
        decide = 1;
        STATUS.innerHTML = "Pause";
    }
}
function setSpeed(speed) {
    if (circuitStarted != 0) {


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
// need to fix this up a bit
function startCircuit() {
    console.log("start");
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

function simulator() {
    timeline.to(INPUTDOTS[0], {
        motionPath: {
            path: "#path1",
            align: "#path1",
            autoRotate: true,
            alignOrigin: [0.5, 0.5]
        },
    
        duration: 4,
        //delay: 12*currPos,
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
        //delay: 12*currPos,
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
        //delay: 12*currPos,
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
        //delay: 12*currPos,
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
        //delay: 12*currPos,
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
        //delay: 12*currPos,
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
        //delay: 12*currPos+4,
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
        //delay: 12*currPos+4,
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
//textClockInit();
outputCoordinates();
inputDots();
outputDisappear();
// calling all the functions that are going to initialise 
//timeline.add(clockToZero, 0);
//timeline.add(clockAppear, 0);
//timeline.add(TextAppear, 0);

timeline.add(inputTextAppear, 0);
timeline.add(dotsAppear, 0);
timeline.add(simulator, 0);
timeline.add(computeAnd,5);
timeline.add(simulator, 6);
timeline.add(computeXor,11);
timeline.add(computeAnd,11);
timeline.add(simulator, 12);
timeline.add(computeXor,17);
timeline.add(computeAnd,17);
timeline.add(simulator, 18);
timeline.add(dotsDisappear,22);
timeline.add(display, 24);
timeline.eventCallback("onComplete", outputVisible);
timeline.eventCallback("onComplete", display);
timeline.pause();
dotsDisappear();

