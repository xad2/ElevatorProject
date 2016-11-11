/*jshint esversion: 6 */
/*globals document, console, randomValue, floors, drawElevator, person, elevator, setTimeout */
/// <reference path="elevator.js" />
/// <reference path="floors.js" />
/// <reference path="functions.js" />
/// <reference path="person.js" />



var Elevator = new elevator();

drawBuilding();

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
	let personCurrentFloor = 0;
	let personFloorWantToGo = 0;
	while (personCurrentFloor === personFloorWantToGo) {
		personCurrentFloor = randomValue(9);
		personFloorWantToGo = randomValue(9);
	}
	 
	let newPerson = new person("a", personFloorWantToGo);
	floors[personCurrentFloor].addPerson(newPerson);
	callElevator(floors[personCurrentFloor]);
}

function callElevator(floor) {
	Elevator.addCalled(floor);

	moveElevator();
}

let count = 0;

function moveElevator() {
	console.log(count + " Elevator: " + Elevator.calledFloors.length);
	drawBuilding();
	/*create a new function */
	if ((Elevator.calledFloors.length > 0) || (Elevator.people.length > 0)) { //checar se existe alguem no elevador
		if (Elevator.calledFloors.length > 0) {
			console.log("Floor called: " + Elevator.calledFloors[0].number);
			console.log("Floor where to go: " + Elevator.calledFloors[0].people[0].floorWantToGo);
		}
		Elevator.moveNextFloor();
		Elevator.reloadPeople(); 
		//Check if there any person for this floor
		if (count < 15)
			setTimeout(moveElevator, 2000);
	}
	count++;
}

function test() {
	moveElevator();
}
