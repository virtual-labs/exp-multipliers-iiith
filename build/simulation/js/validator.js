import { gates, testSimulation,checkConnections } from "./gate.js";
"use strict";

// Helper functions
export function computeXor(a, b) {
    return a !== b;
}
export function computeAnd(a, b) {
    return a && b;
}
export function computeOr(a, b) {
    return a || b;
}
export function computeXnor(a, b) {
    return a === b;
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

function computeMultiplier4(binary) {
    let inputA0 = parseInt(binary[0]);
    let inputA1 = parseInt(binary[1]);
    let inputA2 = parseInt(binary[2]);
    let inputA3 = parseInt(binary[3]);
    
    let inputB0 = parseInt(binary[4]);
    let inputB1 = parseInt(binary[5]);
    let inputB2 = parseInt(binary[6]);
    let inputB3 = parseInt(binary[7]);
    
    // Calculate the values of input numbers
    let num1 = (inputA3 * 8) + (inputA2 * 4) + (inputA1 * 2) + inputA0;
    let num2 = (inputB3 * 8) + (inputB2 * 4) + (inputB1 * 2) + inputB0;
    
    // Calculate the product
    let product = num1 * num2;
    
    // Convert product to binary and pad to 4 bits
    let ans = product.toString(2).padStart(8, "0");
    
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
    let head =
    '<tr><th colspan="2">Inputs</th><th colspan="1" rowspan="2">Expected Values</th><th colspan="1" rowspan="2">Observed Values</th></tr> <tr><th>B</th><th>A</th></tr>';
  document.getElementById("table-head").innerHTML = head;

    if(!checkConnections())
    {
        document.getElementById("table-body").innerHTML = "";
        document.getElementById("table-head").innerHTML = "";
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
        if ( expectedString !== outputString) {
            circuitIsCorrect = false;
            dataTable += `<tr class="bold-table"><td>${binary[3]}${binary[2]}</td><td>${binary[1]}${binary[0]}</td><td> ${expectedString} </td><td class="failure-table"> ${outputString}</tr>`;
        }
        else{
            dataTable += `<tr class="bold-table"><td>${binary[3]}${binary[2]}</td><td>${binary[1]}${binary[0]}</td><td> ${expectedString} </td><td class="success-table"> ${outputString}</tr>`;
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

export function validateMultiplier4(inputA3, inputA2, inputA1, inputA0, inputB3, inputB2, inputB1, inputB0, outputC7, outputC6, outputC5, outputC4, outputC3, outputC2, outputC1, outputC0) {
    let gates_list = gates;

    const A3 = gates_list[inputA3];
    const A2 = gates_list[inputA2];
    const A1 = gates_list[inputA1];
    const A0 = gates_list[inputA0];
    const B3 = gates_list[inputB3];
    const B2 = gates_list[inputB2];
    const B1 = gates_list[inputB1];
    const B0 = gates_list[inputB0];

    let circuitIsCorrect = true;
    let dataTable = "";

    document.getElementById("result").innerHTML = "";
    let head =
        '<tr><th colspan="8">Inputs</th><th colspan="1" rowspan="2">Expected Values</th><th colspan="1" rowspan="2">Observed Values</th></tr> <tr><th>B</th><th>A</th></tr>';
    document.getElementById("table-head").innerHTML = head;

    if (!checkConnections()) {
        document.getElementById("table-body").innerHTML = "";
        document.getElementById("table-head").innerHTML = "";
        return;
    }

    for (let i = 0; i < 256; i++) {
        // convert i to binary
        let binary = i.toString(2).padStart(8, "0");
        binary = binary.split("").reverse().join("");
        A0.setOutput(binary[0] === "1");
        A1.setOutput(binary[1] === "1");
        A2.setOutput(binary[2] === "1");
        A3.setOutput(binary[3] === "1");

        B0.setOutput(binary[4] === "1");
        B1.setOutput(binary[5] === "1");
        B2.setOutput(binary[6] === "1");
        B3.setOutput(binary[7] === "1");

        // simulate the circuit
        testSimulation(gates_list);

        const C0 = gates_list[outputC0].output ? 1 : 0;
        const C1 = gates_list[outputC1].output ? 1 : 0;
        const C2 = gates_list[outputC2].output ? 1 : 0;
        const C3 = gates_list[outputC3].output ? 1 : 0;
        const C4 = gates_list[outputC4].output ? 1 : 0;
        const C5 = gates_list[outputC5].output ? 1 : 0;
        const C6 = gates_list[outputC6].output ? 1 : 0;
        const C7 = gates_list[outputC7].output ? 1 : 0;

        let outputString = `${C7}${C6}${C5}${C4}${C3}${C2}${C1}${C0}`;
        let expectedString = computeMultiplier4(binary);

        if (expectedString !== outputString) {
            circuitIsCorrect = false;
            dataTable += `<tr class="bold-table"><td>${binary[7]}</td><td>${binary[6]}</td><td>${binary[5]}</td><td>${binary[4]}</td><td>${binary[3]}</td><td>${binary[2]}</td><td>${binary[1]}</td><td>${binary[0]}</td><td>${expectedString}</td><td class="failure-table">${outputString}</tr>`;
        } else {
            dataTable += `<tr class="bold-table"><td>${binary[7]}</td><td>${binary[6]}</td><td>${binary[5]}</td><td>${binary[4]}</td><td>${binary[3]}</td><td>${binary[2]}</td><td>${binary[1]}</td><td>${binary[0]}</td><td>${expectedString}</td><td class="success-table">${outputString}</tr>`;
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
