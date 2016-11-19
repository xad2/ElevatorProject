/*jshint esversion: 6 */
/*globals document, Image, console, randomValue, floors, drawElevator, person, Elevator, setTimeout, isFloorValid, Statistics, populateInfoArray, infoArray, floor*/
/// <reference path="elevator.js" />
/// <reference path="floors.js" />
/// <reference path="functions.js" />
/// <reference path="person.js" />



const timer = 1000;
// building coords
let mainCanvas = document.getElementById("canvas");
const BUILDING_BOTTOM_X = 0.5 * mainCanvas.width;
const BUILDING_BOTTOM_Y = 0.85 * mainCanvas.height;
const BOX_WIDTH = 50;
const BOX_HEIGHT = 55;
const ELEVATOR_BOTTOM_X = BUILDING_BOTTOM_X+1;
const ELEVATOR_BOTTOM_Y = BUILDING_BOTTOM_Y;
const PERSON_INI_POSITION_X = BUILDING_BOTTOM_X - BOX_WIDTH-1;
const PERSON_INI_POSITION_Y = BUILDING_BOTTOM_Y - BOX_HEIGHT/2;



var BuildImage = new Image();
BuildImage.src = "images/Building.jpg";

var Building = new building(10, 10);

function building(amountOfFloors, elevatorCapacity) {
	this.elevator = new Elevator(elevatorCapacity);
	this.floors = [];
	for (let i = 0; i < amountOfFloors; i++)
		this.floors.push(new floor(i));


	this.callElevator = function(floor) {
		this.elevator.addCalled(floor);
		if (!this.elevator.isMoving) {
			this.elevator.initStatistics();
			this.elevator.move();
		}
	};
}


function drawBuilding() {
	
	let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
	
	//ctx.drawImage(BuildImage, 400, 20, 100, 100);

	ctx.beginPath();
	ctx.save();
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	//ctx.rect(400, 20, 200, 550);
	for (let i = 0; i < 10; i++) {
		ctx.rect(BUILDING_BOTTOM_X, BUILDING_BOTTOM_Y - (i * BOX_HEIGHT), BOX_WIDTH, BOX_HEIGHT);
		ctx.font = "16px Georgia";
		ctx.fillText(i, BUILDING_BOTTOM_X + 50, BUILDING_BOTTOM_Y+ BOX_HEIGHT/2 - (i * BOX_HEIGHT));
	}
	ctx.stroke();
	ctx.restore();
	Building.elevator.draw();
}


function addPerson() {
	let currentFloor = document.getElementById("currentFloor").value;
	let destinationFloor = document.getElementById("floorOut").value;

	if (!isNaN(currentFloor) && currentFloor !== "" && !isNaN(destinationFloor) && destinationFloor !== "") {

		currentFloor = Number(currentFloor);
		destinationFloor = Number(destinationFloor);

		if (isFloorValid(currentFloor) && isFloorValid(destinationFloor)) {
			let info = infoArray[randomValue(infoArray.length)];
			let newPerson = new person(info, currentFloor, destinationFloor);
			newPerson.stats = new Statistics(currentFloor);
			Building.floors[currentFloor].addPerson(newPerson);
			Building.callElevator(floors[currentFloor]);
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
				floors[currentFloor].people[0].destinationFloor = personFloorOut;
				floors[currentFloor].people[0].waiting = true;
				Building.callElevator(floors[currentFloor]);
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
	let nameCommentary = infoArray[randomValue(infoArray.length)];
	let newPerson = new person(nameCommentary, currentFloor, destinationFloor);
	floors[currentFloor].addPerson(newPerson);
	Building.callElevator(floors[currentFloor]);
}



drawBuilding();
populateInfoArray();

// function test() {
// 	/*let canvas = document.getElementById("canvas");
// 	let ctx = canvas.getContext("2d");
// 	ctx.drawImage(BuildImage, 450, 100, 200, 400);*/

// 	let nameCommentary = namesCommentsArray[randomValue(namesCommentsArray.length)];
// 	let newPerson = new person(nameCommentary, 2, 1);
// 	floors[2].addPerson(newPerson);
// 	Building.callElevator(floors[2]);

// 	nameCommentary = namesCommentsArray[randomValue(namesCommentsArray.length)];
// 	newPerson = new person(nameCommentary, 4, 5);
// 	floors[4].addPerson(nnameCommentsArraynameCommentsArray
// 	Building.callElevator(floors[4]);

// 	nameCommentary = namesCommentsArray[randomValue(namesCommentsArray.length)];
// 	newPerson = new person(nameCommentary, 3, 8);
// 	floors[3].addPerson(nnameCommentsArraynameCommentsArray
// 	Building.callElevator(floors[3]);

// 	nameCommentary = namesCommentsArray[randomValue(namesCommentsArray.length)];
// 	newPerson = new person(nameCommentary, 7, 2);
// 	floors[7].addPerson(nnameCommentsArraynameCommentsArray
// 	Building.callElevator(floors[7]);
// }
// ray[randomValue(namesCommentsArray.length)];
//     let newPerson = new person(nameCommentary, 3, 8);
// 	floors[3].addPerson(nnameCommentsArraynameCommentsArray
// 	callElevator(floors[3]);

// 	let nameCommentary = namesCommentsArray[randomValue(namesCommentsArray.length)];
//     let newPerson = new person(nameCommentary, 7, 2);
// 	floors[7].addPerson(newPerson);
// 	callElevator(floors[7]);
// }
