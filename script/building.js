/*jshint esversion: 6 */
/*globals document, Image, console, randomValue, floors, drawElevator, person, elevator, setTimeout, isFloorValid */
/// <reference path="elevator.js" />
/// <reference path="floors.js" />
/// <reference path="functions.js" />
/// <reference path="person.js" />



var Elevator = new Elevator();
var BuildImage = new Image();
BuildImage.src = "images/Building.jpg";

function drawBuilding() {
	let canvas = document.getElementById("canvas");
	let ctx = canvas.getContext("2d");
	ctx.drawImage(BuildImage, 400, 20, 100, 100);

	ctx.beginPath();
	ctx.save();
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.rect(400, 20, 200, 550);
	for (let i = 0; i < 10; i++) {
		ctx.rect(480, 515 - (i * 55), 50, 55);
		ctx.font = "16px Georgia";
		ctx.fillText(i, 545, 545 - (i * 55));
	}
	ctx.stroke();
	ctx.restore();
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

function removePerson() {
	let currentFloor = document.getElementById("currentFloor").value;
	let personFloorOut = document.getElementById("floorOut").value;

	if (!isNaN(currentFloor) && currentFloor !== "" && !isNaN(personFloorOut) && personFloorOut !== "") {

		currentFloor = Number(currentFloor);
		personFloorOut = Number(personFloorOut);

		if (isFloorValid(currentFloor) && isFloorValid(personFloorOut)) {

			if (floors[currentFloor].people.length > 0) {
				floors[currentFloor].people[0].floorOut = personFloorOut;
				floors[currentFloor].people[0].waiting = true;
				callElevator(floors[currentFloor]);
			}
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
	if (!ElevatorIsMoving)
		moveElevator();
}

let previousFloor;
let ElevatorIsMoving = false;

function moveElevator() {
	console.log(Elevator.currentFloor + " Elevator: " + Elevator.people.length);
	//drawBuilding();
	drawElevator(Elevator.currentFloor, previousFloor);
	/*create a new function */
	if (Elevator.wasCalled()) {
		ElevatorIsMoving = true;
		previousFloor = Elevator.currentFloor;
		Elevator.reloadPeople();
		Elevator.moveNextFloor();
		setTimeout(moveElevator, 2000);
	} else{ 
	    ElevatorIsMoving = false;
	   
	}

	drawElevator(Elevator.currentFloor, previousFloor);
}
drawBuilding();

function test() {
	/*let canvas = document.getElementById("canvas");
	let ctx = canvas.getContext("2d");
	ctx.drawImage(BuildImage, 450, 100, 200, 400);*/

	let newPerson = new person("a", 2, 1);
	floors[2].addPerson(newPerson);
	callElevator(floors[2]);

	newPerson = new person("a", 4, 5);
	floors[4].addPerson(newPerson);
	callElevator(floors[4]);
	
		newPerson = new person("a", 3, 5);
	floors[3].addPerson(newPerson);
	callElevator(floors[3]);
	
		newPerson = new person("a", 4, 5);
	floors[4].addPerson(newPerson);
	callElevator(floors[4]);


}
