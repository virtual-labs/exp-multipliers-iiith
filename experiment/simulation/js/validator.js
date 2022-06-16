import { gates, testSimulation,checkConnections } from "./gate.js";
"use strict";

// Helper functions
export function computeXor(a, b) {
    return a != b;
}
export function computeAnd(a, b) {
    return a && b;
}
export function computeOr(a, b) {
    return a || b;
}
export function computeXnor(a, b) {
    return a == b;
}
export function computeNand(a, b) {
    return !(a && b);
}
export function computeNor(a, b) {
    return !(a || b);
}

function computeMulitpier(binary)
{
    let inputA0 = parseInt(binary[0]);
    let inputA1 = parseInt(binary[1]);
    let inputB0 = parseInt(binary[2]);
    let inputB1 = parseInt(binary[3]);
    let num1=(inputA1*2)+inputA0;
    let num2=(inputB1*2)+inputB0;
    let product=num1*num2;
    let ans = product.toString(2).padStart(4,"0");
    return ans;
}

export function validateMultiplier(inputA1,inputB1,inputB0,inputA0,outputC3,outputC2,outputC1,outputC0) {
    let gates_list = gates;

    const A1 = gates_list[inputA1];
    const B1 = gates_list[inputB1];
    const B0 = gates_list[inputB0];
    const A0 = gates_list[inputA0];
    let circuitIsCorrect = true;

    let dataTable = "";

    document.getElementById("result").innerHTML = "";

    if(!checkConnections())
    {
        document.getElementById("table-body").innerHTML = "";
        let head = "";
        head =
          '<tr><th colspan="2">Inputs</th><th colspan="1" rowspan="2">Expected Values</th><th colspan="1" rowspan="2">Observed Values</th></tr> <tr><th>B</th><th>A</th></tr>';
        document.getElementById("table-head").innerHTML = head;
        return;
    }

    for (let i = 0; i < 16; i++) {
        //convert i to binary
        let binary = i.toString(2).padStart(4, "0");
        binary = binary.split("").reverse().join("");
        A0.setOutput(binary[0] === "1");
        A1.setOutput(binary[1] === "1");
        B0.setOutput(binary[2] === "1");
        B1.setOutput(binary[3] === "1");

        // simulate the circuit
        testSimulation(gates_list);
        const C0 = gates_list[outputC0].output ? 1 : 0;
        const C1 = gates_list[outputC1].output ? 1 : 0;
        const C2 = gates_list[outputC2].output ? 1 : 0;
        const C3 = gates_list[outputC3].output ? 1 : 0;
        let outputString ="";
        outputString+=C3;
        outputString+=C2;
        outputString+=C1;
        outputString+=C0;
        let expectedString = computeMulitpier(binary)
        dataTable += `<tr><th>${binary[3]}${binary[2]}</th><th>${binary[1]}${binary[0]}</th><td> ${expectedString} </td><td> ${outputString}</tr>`;

        if ( expectedString !== outputString) {
            circuitIsCorrect = false;
        }
    }

    const table_elem = document.getElementById("table-body");
    table_elem.insertAdjacentHTML("beforeend", dataTable);

    const result = document.getElementById("result");

    if (circuitIsCorrect) {
        result.innerHTML = "<span>&#10003;</span> Success";
        result.className = "success-message";
    } else {
        result.innerHTML = "<span>&#10007;</span> Fail";
        result.className = "failure-message";
    }
}