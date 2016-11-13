/*jshint esversion: 6 */
/*globals document, console, randomValue, floors, drawElevator, person, elevator, setTimeout, isFloorValid */
/// <reference path="elevator.js" />
/// <reference path="floors.js" />
/// <reference path="functions.js" />
/// <reference path="person.js" />



var Elevator = new Elevator();

function drawBuilding() {
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");

    ctx.beginPath();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.rect(400, 20, 200, 550);
    for (let i = 0; i < 10; i++) {
        ctx.rect(480, 515 - (i * 55), 50, 55);
        ctx.fillText(i, 470, 540 - (i * 55));
    }
    ctx.stroke();
    drawElevator(Elevator.currentFloor);
}


function addPerson() {
    let currentFloor = document.getElementById("currentFloor").value;
    let destinationFloor = document.getElementById("floorOut").value;

    if (!isNaN(currentFloor) && currentFloor !== "" && !isNaN(destinationFloor) && destinationFloor !== "") {

        currentFloor = Number(currentFloor);
        destinationFloor = Number(destinationFloor);

        if (isFloorValid(currentFloor) && isFloorValid(destinationFloor)) {
            let newPerson = new person("a", currentFloor, destinationFloor);
            floors[currentFloor].addPerson(newPerson);
            callElevator(floors[currentFloor]);
        }
    }

}


function addRandomPerson() {
    let currentFloor = 0;
    let destinationFloor = 0;
    while (currentFloor === destinationFloor) {
        currentFloor = randomValue(9);
        destinationFloor = randomValue(9);
    }

    let newPerson = new person("a", currentFloor, destinationFloor);
    floors[currentFloor].addPerson(newPerson);
    callElevator(floors[currentFloor]);
}

function callElevator(floor) {
    Elevator.addCalled(floor);
    moveElevator();
}

let previousFloor;
function moveElevator() {
    console.log(Elevator.currentFloor + " Elevator: " + Elevator.people.length);
    //drawBuilding();
    drawElevator(Elevator.currentFloor, previousFloor);
    /*create a new function */
    if (Elevator.elevatorIsWorking()) {
        previousFloor = Elevator.currentFloor;
        Elevator.reloadPeople();
        Elevator.moveNextFloor();
        setTimeout(moveElevator, 2000);
    }
}
drawBuilding();

