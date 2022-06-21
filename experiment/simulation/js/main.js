import * as gatejs from "./gate.js";
import { wireColours } from "./layout.js";
// import {jsPlumbBrowserUI} from "https://cdnjs.cloudflare.com/ajax/libs/jsPlumb/2.15.6/js/jsplumb.min.js"

"use strict";

let num_wires = 0;

// Gets the coordinates of the mouse
//Handle scrolling
document.getScroll = function () {
  if (window.pageYOffset !== undefined) {
    return [pageXOffset, pageYOffset];
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

// This is an event listener for establishing connections between gates
// to check whether connection is valid/not
export const connectGate = function () {
  jsPlumbInstance.bind("beforeDrop", function (data) {
    //from end point kis gate se wire shuru hui
    // to endpoint kis gate pe wire khatam hui
    const fromEndpoint = data.connection.endpoints[0];
    const toEndpoint = data.dropEndpoint;
    //start uuid hame uuid dega of start gate
    //edn uuis hame uuid dega of end gate
    //uuid="input/output"+"0/1"+"gate-id"
    const start_uuid = fromEndpoint.uuid.split(":")[0];
    const end_uuid = toEndpoint.uuid.split(":")[0];

    if (fromEndpoint.elementId === toEndpoint.elementId) {
      return false;
    }
    // 3 condiitons below meant to check whether connection is valid or not
    if (start_uuid === "input" && end_uuid === "input") {
      return false;
    } else if (start_uuid === "output" && end_uuid === "output") {
      return false;
    } else {
      jsPlumbInstance.connect({
        uuids: [fromEndpoint.uuid, toEndpoint.uuid],
        paintStyle: { stroke: wireColours[num_wires], strokeWidth: 4 },
      });
      num_wires++;
      num_wires = num_wires % wireColours.length;
      if (start_uuid === "output") {
        let input = gatejs.gates[fromEndpoint.elementId]; // gatejs.gates is dict of gates
        input.isConnected = true;
        gatejs.gates[toEndpoint.elementId].addInput(input);
      } else if (end_uuid === "output") {
        let input = gatejs.gates[toEndpoint.elementId];
        input.isConnected = true;
        gatejs.gates[fromEndpoint.elementId].addInput(input);
      }
    }
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
  const ids = ["Input-0", "Input-1", "Input-2", "Input-3","Output-4","Output-5","Output-6","Output-7"]; // [A B Sum Carry Out]
  const types = ["Input", "Input","Input", "Input", "Output", "Output","Output", "Output"];
  const names = ["A1", "B1", "B0", "A0","C3","C2","C1","C0"];
  const positions = [
    { x: 40, y: 150 },
    { x: 40, y: 300 },
    { x: 40, y: 450 },
    { x: 40, y: 600 },
    { x: 820, y: 150 },
    { x: 820, y: 300 },
    { x: 820, y: 450 },
    { x: 820, y: 600 },
  ];
  for (let i = 0; i < ids.length; i++) {
    let gate = new gatejs.Gate(types[i]);
    gate.setId(ids[i]);
    gate.setName(names[i]);
    const component = gate.generateComponent();
    const parent = document.getElementById("working-area");
    parent.insertAdjacentHTML("beforeend", component);
    gate.registerComponent("working-area", positions[i].x, positions[i].y);
  }
}

// Refresh the circuit board by removing all gates and components
export function refreshWorkingArea() {
  jsPlumbInstance.reset();
  window.numComponents = 0;
  gatejs.clearGates();
}

// Initialise Task 1 experiment when the page loads
window.currentTab = "task1";
connectGate();
refreshWorkingArea();
initMultiplier();
