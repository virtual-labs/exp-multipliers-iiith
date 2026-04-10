import { simulate } from "./gate.js";
import {
  connectGate,
  unbindEvent,
  initMultiplier,
  refreshWorkingArea,
} from "./main.js";

("use strict");
// Wires Colours
export const wireColours = [
  "#ff0000",
  "#00ff00",
  "#0000ff",
  "#bf6be3",
  "#ff00ff",
  "#00ffff",
  "#ff8000",
  "#00ff80",
  "#80ff00",
  "#ff0080",
  "#8080ff",
  "#c0c0c0",
];

// Contextmenu
// Tabs

function changeTabs(e) {
  const task = e.target.parentNode.id;
  if (window.currentTab === task) {
    return;
  }

  if (window.currentTab !== null) {
    document.getElementById(window.currentTab).classList.remove("is-active");
  }
  window.currentTab = task;
  document.getElementById(task).classList.add("is-active");

  // Update instruction title and load appropriate components
  const instructionTitle = document.getElementById("instruction-title");
  switch (task) {
    case "task1":
      instructionTitle.innerHTML =
        "2-Bit Multiplier Practice<br />Implement a 2-Bit Multiplier using 4 AND gates and 2 Half Adders";
      loadTask1Components();
      break;
    case "task2":
      instructionTitle.innerHTML =
        "4-Bit Array Multiplier Practice<br />Implement a 4-Bit Array Multiplier using AND gates and Half Adders";
      loadTask2Components();
      break;
    case "task3":
      instructionTitle.innerHTML =
        "4-Bit Advanced Multiplier Practice<br />Implement a 4-Bit Advanced Multiplier using AND gates, Half Adders, and Full Adders";
      loadTask3Components();
      break;
    case "task4":
      instructionTitle.innerHTML =
        "Wallace Tree Multiplier Practice<br />Implement a Wallace Tree Multiplier using advanced techniques";
      loadTask4Components();
      break;
    default:
      instructionTitle.innerHTML =
        "2-Bit Multiplier Practice<br />Implement a 2-Bit Multiplier using AND gates and Half Adders";
      loadTask1Components();
  }

  // Reset circuit and reinitialize
  unbindEvent();
  connectGate();
  refreshWorkingArea();
  initMultiplier();
  window.simulate = simulate;
  clearObservations();
  resize();
}

window.changeTabs = changeTabs;

// Toolbar

// Component loading functions for each task
function loadTask1Components() {
  const toolbar = document.getElementById("toolbar");
  toolbar.innerHTML = `
    <div class="component-button and" onclick="addGate(event)">AND</div>
    <div class="component-button or" onclick="addGate(event)">OR</div>
    <div class="component-button xor" onclick="addGate(event)">XOR</div>
    <div class="component-button half-adder" onclick="addGate(event)">HALF ADDER</div>
  `;
}

function loadTask2Components() {
  const toolbar = document.getElementById("toolbar");
  toolbar.innerHTML = `
    <div class="component-button and" onclick="addGate(event)">AND</div>
    <div class="component-button or" onclick="addGate(event)">OR</div>
    <div class="component-button xor" onclick="addGate(event)">XOR</div>
    <div class="component-button half-adder" onclick="addGate(event)">HALF ADDER</div>
    <div class="component-button full-adder" onclick="addGate(event)">FULL ADDER</div>
  `;
}

function loadTask3Components() {
  const toolbar = document.getElementById("toolbar");
  toolbar.innerHTML = `
    <div class="component-button and" onclick="addGate(event)">AND</div>
    <div class="component-button or" onclick="addGate(event)">OR</div>
    <div class="component-button xor" onclick="addGate(event)">XOR</div>
    <div class="component-button not" onclick="addGate(event)">NOT</div>
    <div class="component-button half-adder" onclick="addGate(event)">HALF ADDER</div>
    <div class="component-button full-adder" onclick="addGate(event)">FULL ADDER</div>
  `;
}

function loadTask4Components() {
  const toolbar = document.getElementById("toolbar");
  toolbar.innerHTML = `
    <div class="component-button and" onclick="addGate(event)">AND</div>
    <div class="component-button or" onclick="addGate(event)">OR</div>
    <div class="component-button xor" onclick="addGate(event)">XOR</div>
    <div class="component-button not" onclick="addGate(event)">NOT</div>
    <div class="component-button nand" onclick="addGate(event)">NAND</div>
    <div class="component-button nor" onclick="addGate(event)">NOR</div>
    <div class="component-button half-adder" onclick="addGate(event)">HALF ADDER</div>
    <div class="component-button full-adder" onclick="addGate(event)">FULL ADDER</div>
  `;
}

function updateToolbar() {
  // Default to task1 components if no specific task is set
  if (window.currentTab) {
    switch (window.currentTab) {
      case "task1":
        loadTask1Components();
        break;
      case "task2":
        loadTask2Components();
        break;
      case "task3":
        loadTask3Components();
        break;
      case "task4":
        loadTask4Components();
        break;
      default:
        loadTask1Components();
    }
  } else {
    loadTask1Components();
  }
}

// Clear observations
export function clearObservations() {
  document.getElementById("table-body").innerHTML = "";
  document.getElementById("table-head").innerHTML = "";
  document.getElementById("result").innerHTML = "";
}

// Making webpage responsive

// Dimensions of working area
const circuitBoard = document.getElementById("circuit-board");
// Distance of working area from top
const circuitBoardTop = circuitBoard.offsetTop;
// Full height of window
const windowHeight = window.innerHeight;
const width = window.innerWidth;
if (width < 1024) {
  circuitBoard.style.height = "600px";
} else {
  circuitBoard.style.height = windowHeight - circuitBoardTop - 20 + "px";
}

function resize() {
  const circuitBoard = document.getElementById("circuit-board");
  const sidePanels = document.getElementsByClassName("v-datalist-container");

  if (width >= 1024) {
    for (let i = 0; i < sidePanels.length; i++) {
      sidePanels[i].style.height = circuitBoard.style.height;
    }
  }
}

resize();

// Initialize the current tab and load default components
window.currentTab = "task1";
document.addEventListener("DOMContentLoaded", function () {
  // Set initial tab state
  if (!window.currentTab) {
    window.currentTab = "task1";
  }

  // Load initial components for task1
  loadTask1Components();

  // Initialize multiplier
  connectGate();
  initMultiplier();
  window.simulate = simulate;
});
