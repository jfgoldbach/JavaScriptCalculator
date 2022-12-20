var buttons = document.getElementsByTagName("button");
var execKeys = document.getElementsByClassName("calculusBtn");
var display = "0";
var lastResult = "0";
var lastOperations = "";
var output_display = document.getElementById("output");
var history_display = document.getElementById("history");
var equalClicked = false;
var invPowerMode = false;
var cusPowerMode = false;
var dotted = false;
var base = "0";
var audios = [new Audio("click1.wav"), new Audio("click2.wav"), new Audio("click3.wav")];


//sets css variable on root element with actual height (wont update)
document.documentElement.style.setProperty("--mobileHeight", `${window.innerHeight}px`)


//Knöpfe Funktional machen | add functionality to keys
function addKeys(){
    for(let i = 0; i < buttons.length; i++){
        let btn = buttons[i];
        let btnId = btn.id;
        switch (btnId){
            case "C":
                btn.addEventListener("click",execC);
                break;
            case "AC":
                btn.addEventListener("click",execAc);
                break;
            case "DEL":
                btn.addEventListener("click",execDel);
                break;
            case "add":
            case "subtract":
            case "multiply":
            case "divide":
                btn.addEventListener("click",() => {execCalc(btn.innerHTML);} );
                break;
            case "dot":
                btn.addEventListener("click",execDot);
                break;
            case "equals":
                btn.addEventListener("click",execEquals);
                break;
            case "sr":
                btn.addEventListener("click",execSqrt);
                break;
            case "squared":
                btn.addEventListener("click", execSquared);
                break;
            case "inversePower":
                btn.addEventListener("click", execInvPower);
                break;
            case "customPower":
                btn.addEventListener("click", execCusPower);
                break;
            default:
                btn.addEventListener("click",() => {execNumber(btnId);});
                break;
        }
    };
}

//functions, auf die die Knöpfe zugreifen | Button functions:
function execCalc(input){
    execPower();
    validateResult();
    if(input == "×"){
        if(display != "0"){
            lastOperations += display + " × ";
        }else {0
            lastOperations += " × ";
        }
    }else if(input == "÷"){
        if(display != "0"){
            lastOperations += display + " ÷ ";    
        }else {
            lastOperations += " ÷ ";
        }
    }else{
        if(display != "0"){
            lastOperations += display + ` ${input} `;
        }else {
            lastOperations += ` ${input} `;
        }
    }
    display = "0";
    dotted = false;
    playAudio();
    refreshDisplays();
}

function execSqrt() {
    execPower();
    validateResult();
    lastOperations += Math.sqrt(display);
    display = "0"
    dotted = false;
    sqrtActive = true;
    playAudio();
    refreshDisplays();
}

function execSquared(){
    execPower();
    validateResult();
    lastOperations += Math.pow(display, 2);
    display = "0";
    playAudio();
    refreshDisplays();
}

function execInvPower(){
    execPower();
    validateResult();
    base = display;
    display = "0";
    for (let i = 0; i<execKeys.length; i++){
        if(execKeys[i].id != "inversePower"){
            execKeys[i].style.backgroundColor = "rgb(195, 195, 195)";
        }
    }
    invPowerMode = true;
    playAudio();
    refreshDisplays();
}

function execCusPower(){
    execPower();
    validateResult();
    base = display;
    display = "0";
    for (let i = 0; i<execKeys.length; i++){
        if(execKeys[i].id != "customPower"){
            execKeys[i].style.backgroundColor = "rgb(195, 195, 195)";
        }
    }
    cusPowerMode = true;
    playAudio();
    refreshDisplays();
}

function execNumber(input){
    validateResult();
    if(display != "0"){
        display += input;
    }else {
        display = input;
    }
    playAudio();
    refreshDisplays();
}

function execEquals(){
    execPower();
    validateResult();
    lastOperations += display;
    history_display.innerHTML=lastOperations; //History display refreshen, bevor Syntaxänderungen vorgenommen werden | refresh history display before replacing characters for eval()
    lastOperations = lastOperations.replace("×", "*");
    lastOperations = lastOperations.replace("÷", "/");
    display = eval(lastOperations);
    output_display.innerHTML=display; //History display wurde ja schon refresht | only refresh output display
    playAudio();
    equalClicked = true;
}

function execDot(){
    validateResult();
    if(display != "" && display.slice(display.length-1, display.length) != "." && dotted == false){
        display += ".";
        dotted = true;
    }
    playAudio();
    refreshDisplays();
}

function execC(){
    cusPowerMode = false;
    invPowerMode = false;
    base = "0";
    execPower();
    validateResult();
    display = "0";
    dotted = false;
    playAudio();
    refreshDisplays();
}

function execAc(){
    cusPowerMode = false;
    invPowerMode = false;
    base = "0";
    execPower();
    validateResult();
    display = "0";
    lastOperations = "";
    dotted = false;
    playAudio();
    refreshDisplays();
}

function execDel(){
    validateResult();
    if(display.slice(display.length-1, display.length) == "."){
        dotted = false;
    }
    display = display.slice(0, display.length-1);
    if(display == ""){
        display = "0";
    }
    playAudio();
    refreshDisplays();
}

//Überprüfen, ob das Ergebnis ins history display übernommen wird | check vor invalid results
function validateResult(){
    if(equalClicked){
        if(isNaN(display) || display == "Infinity" || display == "-Infinity"){
            lastOperations = ""
        }else {
            lastOperations = display;
        }
        display = "";
        equalClicked = false;
    }
}

//Führt Potenzrechnung aus, wenn einer der Rechenknöpfe gedrückt wird | executes power operation when triggered by calculus buttons
function execPower() {
    if(invPowerMode){
        let inv = 1 / display;
        lastOperations += Math.pow(base, inv);
        display = "";
        for (let i = 0; i<execKeys.length; i++){
            execKeys[i].style.backgroundColor = "rgb(235,235,235)";
        }
        invPowerMode = false;
        base = "0";
    }else if(cusPowerMode){
        lastOperations += Math.pow(base, display);
        display = "";
        for (let i = 0; i<execKeys.length; i++){
            execKeys[i].style.backgroundColor = "rgb(235,235,235)";
        }
        cusPowerMode = false;
        base = "0";
    }else{ //just in case
        for (let i = 0; i<execKeys.length; i++){
            execKeys[i].style.backgroundColor = "rgb(235,235,235)";
        }
    }
}

//play sound
function playAudio(){
    let rnd = Math.ceil((Math.random()*3)-1);
    audios[rnd].play();
}

//Refreshes displays
function refreshDisplays() {
    output_display.innerHTML=display;
    history_display.innerHTML=lastOperations;
}

//initialize display
refreshDisplays();
//Führe Funktion aus, um Knöpfen das Binding zu geben | initialize click events
addKeys();