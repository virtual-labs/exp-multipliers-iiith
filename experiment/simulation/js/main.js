import * as gatejs from "./gate.js";
import { wireColours, clearObservations } from "./layout.js";
import { deleteElement } from "./gate.js";
// import {jsPlumbBrowserUI} from "https://cdnjs.cloudflare.com/ajax/libs/jsPlumb/2.15.6/js/jsplumb.min.js"

("use strict");

let num_wires = 0;

// Gets the coordinates of the mouse
//Handle scrolling
document.getScroll = function () {
  if (window.scrollY !== undefined) {
    return [scrollX, scrollY];
  } else {
    let sx,
      sy,
      d = document,
      r = d.documentElement,
      b = d.body;
    sx = r.scrollLeft || b.scrollLeft || 0;
    sy = r.scrollTop || b.scrollTop || 0;
    return [sx, sy];
  }
};
const workingArea = document.getElementById("working-area");

// Creating a js Plumb Instance
// js plumb helps in creating wires
export const jsPlumbInstance = jsPlumbBrowserUI.newInstance({
  container: workingArea,
  maxConnections: -1,
  endpoint: {
    type: "Dot",
    options: { radius: 6 },
  },
  dragOptions: {
    containment: "parentEnclosed",
    containmentPadding: 5,
  },
  connector: "Flowchart",
  paintStyle: { strokeWidth: 4, stroke: "#888888" },
  connectionsDetachable: false,
});

// Add connection hover events for deletion
jsPlumbInstance.bind("connection", function (info) {
  const connection = info.connection;
  const connectorElement = connection.connector.canvas;

  if (connectorElement) {
    // Add hover class on mouse enter
    connectorElement.addEventListener("mouseenter", function () {
      connectorElement.classList.add("jtk-hover");
    });

    // Remove hover class on mouse leave
    connectorElement.addEventListener("mouseleave", function () {
      connectorElement.classList.remove("jtk-hover");
    });
  }
});

// Returns the output endpoint and the input endpoint of a wire, whichever way it was drawn
function splitEndpoints(epA, epB) {
  return epA.uuid.startsWith("output") ? [epA, epB] : [epB, epA];
}

// Records a new wire in the circuit model. The number in the uuid of the output endpoint tells which
// output of the driver the wire starts from (0: the output, or the Sum of an adder; 1: the Carry of an adder).
function linkEndpoints(fromEndpoint, toEndpoint) {
  const [outEp, inEp] = splitEndpoints(fromEndpoint, toEndpoint);
  const driver = gatejs.gates[outEp.elementId];
  const sink = gatejs.gates[inEp.elementId];
  if (!driver || !sink) {
    return;
  }
  driver.isConnected = true;
  driver.addOutput(sink);
  sink.addInput(driver, Number(outEp.uuid.split(":")[1]));
}

// Removes a deleted wire from the circuit model
function unlinkEndpoints(epA, epB) {
  if (!epA || !epB || !epA.uuid || !epB.uuid) {
    return;
  }
  const [outEp, inEp] = splitEndpoints(epA, epB);
  if (!outEp.uuid.startsWith("output") || !inEp.uuid.startsWith("input")) {
    return;
  }
  const driver = gatejs.gates[outEp.elementId];
  const sink = gatejs.gates[inEp.elementId];
  if (!driver || !sink) {
    return;
  }
  const pin = Number(outEp.uuid.split(":")[1]);
  const index = sink.inputs.findIndex(
    (pair) => pair[0] === driver && pair[1] === pin
  );
  if (index !== -1) {
    sink.inputs.splice(index, 1);
  }
  const outIndex = driver.outputs.indexOf(sink);
  if (outIndex !== -1) {
    driver.outputs.splice(outIndex, 1);
  }
  driver.isConnected = driver.outputs.length > 0;
}

// Keep the circuit model in sync when a wire is deleted
function bindDetach() {
  jsPlumbInstance.unbind("connection:detach");
  jsPlumbInstance.bind("connection:detach", function (info) {
    unlinkEndpoints(info.sourceEndpoint, info.targetEndpoint);
  });
}
bindDetach();

// This is an event listener for establishing connections between gates
// to check whether connection is valid/not
export const connectGate = function () {
  bindDetach();
  jsPlumbInstance.unbind("beforeDrop");
  jsPlumbInstance.bind("beforeDrop", function (data) {
    const fromEndpoint = data.connection.endpoints[0];
    const toEndpoint = data.dropEndpoint;
    // uuid = "input/output" + ":" + pin number + ":" + gate id
    const start_uuid = fromEndpoint.uuid.split(":")[0];
    const end_uuid = toEndpoint.uuid.split(":")[0];

    if (fromEndpoint.elementId === toEndpoint.elementId) {
      return false;
    }
    // the conditions below check whether the connection is valid or not
    if (start_uuid === "input" && end_uuid === "input") {
      return false;
    } else if (start_uuid === "output" && end_uuid === "output") {
      return false;
    } else if (
      (end_uuid === "input" && toEndpoint.connections.length > 0) ||
      (start_uuid === "input" && fromEndpoint.connections.length > 1)
    ) {
      // If it already has a connection, do not establish a new connection
      return false;
    }
    jsPlumbInstance.connect({
      uuids: [fromEndpoint.uuid, toEndpoint.uuid],
      paintStyle: { stroke: wireColours[num_wires], strokeWidth: 4 },
    });
    num_wires++;
    num_wires = num_wires % wireColours.length;
    linkEndpoints(fromEndpoint, toEndpoint);
    // the wire has been drawn above, so the drop itself is cancelled
    return false;
  });
};

// Unbinds the event listeners
export const unbindEvent = () => {
  jsPlumbInstance.unbind("beforeDrop");
};

// Generates the endpoints for the respective gate with the help of JsPlumb
export function registerGate(id, gate) {
  const element = document.getElementById(id);
  const gateType = id.split("-")[0];

  if (
    gateType === "AND" ||
    gateType === "OR" ||
    gateType === "XOR" ||
    gateType === "XNOR" ||
    gateType === "NAND" ||
    gateType === "NOR"
  ) {
    gate.addInputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [0, 0.5, -1, 0, -7, -9],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "input:0:" + id,
      })
    );
    gate.addInputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [0, 0.5, -1, 0, -7, 10],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "input:1:" + id,
      })
    );
    gate.addOutputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [1, 0.5, 1, 0, 7, 0],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "output:0:" + id,
      })
    );
  } else if (gateType === "HALF ADDER") {
    // Half Adder: 2 inputs (A, B), 2 outputs (Sum, Carry)
    gate.addInputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [0, 0.5, -1, 0, -7, -9],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "input:0:" + id,
      })
    );
    gate.addInputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [0, 0.5, -1, 0, -7, 10],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "input:1:" + id,
      })
    );
    gate.addOutputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [1, 0.5, 1, 0, 7, -9],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "output:0:" + id, // Sum output
      })
    );
    gate.addOutputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [1, 0.5, 1, 0, 7, 10],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "output:1:" + id, // Carry output
      })
    );
  } else if (gateType === "FULL ADDER") {
    // Full Adder: 3 inputs (A, B, Cin), 2 outputs (Sum, Carry)
    gate.addInputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [0, 0.5, -1, 0, -7, -15],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "input:0:" + id,
      })
    );
    gate.addInputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [0, 0.5, -1, 0, -7, 0],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "input:1:" + id,
      })
    );
    gate.addInputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [0, 0.5, -1, 0, -7, 15],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "input:2:" + id,
      })
    );
    gate.addOutputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [1, 0.5, 1, 0, 7, -9],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "output:0:" + id, // Sum output
      })
    );
    gate.addOutputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [1, 0.5, 1, 0, 7, 10],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "output:1:" + id, // Carry output
      })
    );
  } else if (gateType === "NOT") {
    gate.addInputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [0, 0.5, -1, 0, -7, 0],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "input:0:" + id,
      })
    );
    gate.addOutputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [1, 0.5, 1, 0, 7, 0],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "output:0:" + id,
      })
    );
  } else if (gateType === "Input") {
    gate.addOutputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [1, 0.5, 1, 0, 7, 0],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "output:0:" + id,
      })
    );
  } else if (gateType === "Output") {
    gate.addInputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [0, 0.5, -1, 0, -7, 0],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "input:0:" + id,
      })
    );
  }
}

// Initialise Half adder experiment by generating and adding gates and components to the circuit board at given positions
export function initMultiplier() {
  let ids = [],
    types = [],
    names = [],
    positions = [];
  if (window.currentTab === "task1") {
    ids = [
      "Input-0",
      "Input-1",
      "Input-2",
      "Input-3",
      "Output-4",
      "Output-5",
      "Output-6",
      "Output-7",
    ]; // [A B Sum Carry Out]
    types = [
      "Input",
      "Input",
      "Input",
      "Input",
      "Output",
      "Output",
      "Output",
      "Output",
    ];
    names = ["A1", "A0", "B1", "B0", "C3", "C2", "C1", "C0"];
    positions = [
      { x: 40, y: 150 },
      { x: 40, y: 300 },
      { x: 40, y: 450 },
      { x: 40, y: 600 },
      { x: 820, y: 150 },
      { x: 820, y: 300 },
      { x: 820, y: 450 },
      { x: 820, y: 600 },
    ];
  } else if (window.currentTab === "task2") {
    ids = [
      "Input-0",
      "Input-1",
      "Input-2",
      "Input-3",
      "Input-4",
      "Input-5",
      "Input-6",
      "Input-7",
      "Output-8",
      "Output-9",
      "Output-10",
      "Output-11",
      "Output-12",
      "Output-13",
      "Output-14",
      "Output-15",
    ]; // [A B Sum Carry Out]
    types = [
      "Input",
      "Input",
      "Input",
      "Input",
      "Input",
      "Input",
      "Input",
      "Input",
      "Output",
      "Output",
      "Output",
      "Output",
      "Output",
      "Output",
      "Output",
      "Output",
    ];
    names = [
      "A3",
      "A2",
      "A1",
      "A0",
      "B3",
      "B2",
      "B1",
      "B0",
      "C7",
      "C6",
      "C5",
      "C4",
      "C3",
      "C2",
      "C1",
      "C0",
    ];
    positions = [
      { x: 40, y: 50 },
      { x: 40, y: 150 },
      { x: 40, y: 250 },
      { x: 40, y: 350 },
      { x: 40, y: 450 },
      { x: 40, y: 550 },
      { x: 40, y: 650 },
      { x: 40, y: 750 },
      { x: 820, y: 50 },
      { x: 820, y: 150 },
      { x: 820, y: 250 },
      { x: 820, y: 350 },
      { x: 820, y: 450 },
      { x: 820, y: 550 },
      { x: 820, y: 650 },
      { x: 820, y: 750 },
    ];
  } else if (window.currentTab === "task3") {
    ids = [
      "Input-0",
      "Input-1",
      "Input-2",
      "Input-3",
      "Input-4",
      "Input-5",
      "Input-6",
      "Input-7",
      "Output-8",
      "Output-9",
      "Output-10",
      "Output-11",
      "Output-12",
      "Output-13",
      "Output-14",
      "Output-15",
    ]; // [A B Sum Carry Out]
    types = [
      "Input",
      "Input",
      "Input",
      "Input",
      "Input",
      "Input",
      "Input",
      "Input",
      "Output",
      "Output",
      "Output",
      "Output",
      "Output",
      "Output",
      "Output",
      "Output",
    ];
    names = [
      "A3",
      "A2",
      "A1",
      "A0",
      "B3",
      "B2",
      "B1",
      "B0",
      "C7",
      "C6",
      "C5",
      "C4",
      "C3",
      "C2",
      "C1",
      "C0",
    ];
    positions = [
      { x: 40, y: 50 },
      { x: 40, y: 150 },
      { x: 40, y: 250 },
      { x: 40, y: 350 },
      { x: 40, y: 450 },
      { x: 40, y: 550 },
      { x: 40, y: 650 },
      { x: 40, y: 750 },
      { x: 820, y: 50 },
      { x: 820, y: 150 },
      { x: 820, y: 250 },
      { x: 820, y: 350 },
      { x: 820, y: 450 },
      { x: 820, y: 550 },
      { x: 820, y: 650 },
      { x: 820, y: 750 },
    ];
  } else if (window.currentTab === "task4") {
    ids = [
      "Input-0",
      "Input-1",
      "Input-2",
      "Input-3",
      "Input-4",
      "Input-5",
      "Input-6",
      "Input-7",
      "Output-8",
      "Output-9",
      "Output-10",
      "Output-11",
      "Output-12",
      "Output-13",
      "Output-14",
      "Output-15",
    ]; // [A B Sum Carry Out]
    types = [
      "Input",
      "Input",
      "Input",
      "Input",
      "Input",
      "Input",
      "Input",
      "Input",
      "Output",
      "Output",
      "Output",
      "Output",
      "Output",
      "Output",
      "Output",
      "Output",
    ];
    names = [
      "A3",
      "A2",
      "A1",
      "A0",
      "B3",
      "B2",
      "B1",
      "B0",
      "C7",
      "C6",
      "C5",
      "C4",
      "C3",
      "C2",
      "C1",
      "C0",
    ];
    positions = [
      { x: 40, y: 50 },
      { x: 40, y: 150 },
      { x: 40, y: 250 },
      { x: 40, y: 350 },
      { x: 40, y: 450 },
      { x: 40, y: 550 },
      { x: 40, y: 650 },
      { x: 40, y: 750 },
      { x: 820, y: 50 },
      { x: 820, y: 150 },
      { x: 820, y: 250 },
      { x: 820, y: 350 },
      { x: 820, y: 450 },
      { x: 820, y: 550 },
      { x: 820, y: 650 },
      { x: 820, y: 750 },
    ];
  }
  for (let i = 0; i < ids.length; i++) {
    let gate = new gatejs.Gate(types[i]);
    gate.setId(ids[i]);
    gate.setName(names[i]);
    const component = gate.generateComponent();
    const parent = document.getElementById("working-area");
    parent.insertAdjacentHTML("beforeend", component);

    // Debug: Log the positioning information
    console.log(
      `Creating ${ids[i]} (${names[i]}) at position (${positions[i].x}, ${positions[i].y})`
    );

    // Ensure element exists before positioning
    const element = document.getElementById(ids[i]);
    if (element) {
      gate.registerComponent("working-area", positions[i].x, positions[i].y);
    } else {
      console.error(`Element ${ids[i]} not found for positioning`);
    }
  }
}

// Refresh the circuit board by removing all gates and components
export function refreshWorkingArea() {
  jsPlumbInstance.reset();
  window.numComponents = 0;
  gatejs.clearGates();
}

const menu = document.querySelector(".menu");
const menuOptions = document.querySelectorAll(".menu-option");

export const setPosition = ({ top, left }) => {
  menu.style.left = `${left}px`;
  menu.style.top = `${top}px`;
  menu.style.display = "block";
};
window.addEventListener("click", () => {
  menu.style.display = "none";
  window.selectedComponent = null;
  window.componentType = null;
  window.contextMenuTarget = null;
  window.isConnectionContext = false;
});
menuOptions.forEach((menuOption) => {
  menuOption.addEventListener("click", (e) => {
    if (e.target.innerHTML === "Delete") {
      if (window.isConnectionContext && window.contextMenuTarget) {
        deleteConnection();
      } else if (window.componentType === "gate") {
        deleteElement(window.selectedComponent);
      }
    }
    window.selectedComponent = null;
    window.componentType = null;
    window.contextMenuTarget = null;
    window.isConnectionContext = false;
    menu.style.display = "none";
  });
});

// Add context menu only to the circuit board area
const circuitBoard = document.getElementById("circuit-board");
if (circuitBoard) {
  circuitBoard.addEventListener("contextmenu", function (event) {
    // Only show context menu if right-clicking on circuit elements
    const target = event.target;
    const isComponent =
      target.closest(".drag-drop") ||
      target.closest(".logic-gate") ||
      target.closest(".high") ||
      target.closest(".low") ||
      target.closest(".output") ||
      target.closest(".halfadder") ||
      target.closest(".fulladder");
    const isConnection = target.closest(".jtk-connector");

    if (isComponent || isConnection) {
      event.preventDefault(); // Prevent the default context menu from appearing

      // Store the target element and check if it is a connection
      window.contextMenuTarget = event.target;
      window.isConnectionContext = isConnection !== null;

      menu.style.display = "block";
      menu.style.left = `${event.clientX}px`;
      menu.style.top = `${event.clientY}px`;
    }
  });
}

// Function to delete the connection that was right clicked
function deleteConnection() {
  const connectorElement =
    window.contextMenuTarget && window.contextMenuTarget.closest(".jtk-connector");
  if (!connectorElement) {
    return;
  }
  const connection = jsPlumbInstance
    .getConnections()
    .find((c) => c.connector && c.connector.canvas === connectorElement);
  if (connection) {
    // this also updates the circuit model (see bindDetach)
    jsPlumbInstance.deleteConnection(connection);
  }
}

// Initialise Task 1 experiment when the page loads
window.currentTab = "task1";

// Wait for DOM to be fully loaded before initializing
document.addEventListener("DOMContentLoaded", function () {
  // Additional delay to ensure layout is complete
  setTimeout(() => {
    console.log("Initializing multiplier with proper timing...");
    connectGate();
    refreshWorkingArea();
    initMultiplier();
  }, 100);
});

// Add reset button functionality
document.addEventListener("DOMContentLoaded", function () {
  const resetButton = document.getElementById("refresh");
  if (resetButton) {
    resetButton.addEventListener("click", function () {
      refreshWorkingArea();
      connectGate();
      initMultiplier();
      clearObservations();
    });
  }
});

// Export functions to global scope for HTML button access
window.simulate = gatejs.simulate;
window.submitCircuit = gatejs.submitCircuit;
window.jsPlumbInstance = jsPlumbInstance;
