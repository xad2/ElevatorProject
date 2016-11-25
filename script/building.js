/*jshint esversion: 6 */
/*globals document, Image, console, randomValue, floors, drawElevator, person, Elevator, setTimeout, isFloorValid, Statistics, populateInfoArray, infoArray, floor, usedNamesArray */
/// <reference path="elevator.js" />
/// <reference path="floors.js" />
/// <reference path="functions.js" />
/// <reference path="person.js" />


const timer = 800;
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
var coord = function (x, y) {
	return {
		x: x,
		y: y
	};
};

var BuildImage = new Image();
BuildImage.src = "images/Building.jpg";

var Building;

function building(amountOfFloors, amountOfElevators, elevatorCapacity) {
	this.floors = [];
	for (let i = 0; i < amountOfFloors; i++)
		this.floors.push(new floor(i));


	let buildingTop = 10;
	let buildingBottom = canvas.height - 20;
	let floorSize = (buildingBottom) / this.floors.length;

	this.elevators = [];
	for (let i = 0; i < amountOfElevators; i++)
		this.elevators.push(new Elevator(elevatorCapacity, i, floorSize - 4, coord((120 + (80 * i) + 1), buildingBottom - floorSize + 12)));



	this.callElevator = function (floor, destinationFloor) {

		
		//closerElevator Sort
		
		var sameDiretion = [];
		for (let i = 0; i < this.elevators.length; i++) {
			if (this.elevators[i].sameDirection(floor.number, destinationFloor))
				sameDiretion.push(this.elevators[i]);
		}
		var index = 0;
		if (sameDiretion.length > 0)
			index = sameDiretion[0].number;
		

		this.elevators[index].addCalled(floor);
		if (!this.elevators[index].isMoving) {
			this.elevators[index].initStatistics();
			this.elevators[index].move();
		}
	};

	this.drawBuilding = function () {
		let size = this.elevators.length;

		//		ctx.scale(0.5, 0.5);
		ctx.drawImage(BuildImage, 400, 20, 100, 100);
		ctx.font = "18px Arial";
		ctx.beginPath();
		ctx.save();
		ctx.textAlign = "end";
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.rect(100, buildingTop, 300 + (size * 20), (100 * this.floors.length));

		for (let i = 0; i < this.elevators.length; i++) {
			for (let j = 0; j < this.floors.length; j++) {
				ctx.rect(130 + (100 * i), buildingTop + (j * 100), 80, 100);
				ctx.fillText(this.floors.length - j - 1, 120, buildingTop + 50 + (100 * j));
			}
		}
		ctx.stroke();
		ctx.restore();
		for (let i = 0; i < amountOfElevators; i++)
			Building.elevators[i].draw();
	};


}



function addPerson(currentFloor, destinationFloor) {
	if (!isNaN(currentFloor) && currentFloor !== "" && !isNaN(destinationFloor) && destinationFloor !== "") {
		currentFloor = Number(currentFloor);
		destinationFloor = Number(destinationFloor);
		if (isFloorValid(currentFloor) && isFloorValid(destinationFloor)) {

			let nameCommentary = "";
			let random = 0;
			do {
				random = randomValue(infoArray.length - 1);

			} while (usedNamesArray[random]);
			usedNamesArray[random] = true;
			nameCommentary = infoArray[random];

			let newPerson = new person(nameCommentary, currentFloor, destinationFloor);
			newPerson.stats = new Statistics(currentFloor);
			Building.floors[currentFloor].addPerson(newPerson);
			Building.callElevator(floors[currentFloor], destinationFloor);
		}
	}
}

function addPersonFromFile(arrPeople) {
	for (let i = 0; i < arrPeople.length; i++) {
		let currentFloor = Number(arrPeople[i].split(",")[0]);
		let destinationFloor = Number(arrPeople[i].split(",")[1]);
		addPerson(currentFloor, destinationFloor);
	}
}

function removePerson() {
	let currentFloor = document.getElementById("currentFloor").value;
	let destinationFloor = document.getElementById("floorOut").value;

	if (!isNaN(currentFloor) && currentFloor !== "" && !isNaN(destinationFloor) && destinationFloor !== "") {

		currentFloor = Number(currentFloor);
		destinationFloor = Number(destinationFloor);

		if (isFloorValid(currentFloor) && isFloorValid(destinationFloor)) {

			if (Building.floors[currentFloor].people.length > 0) {
				Building.floors[currentFloor].people[0].destinationFloor = destinationFloor;
				Building.floors[currentFloor].people[0].waiting = true;
				Building.callElevator(floors[currentFloor], destinationFloor);
			}
		}
	}
}

function addRandomPerson() {
	let currentFloor = 0;
	let destinationFloor = 0;
	while (currentFloor === destinationFloor) {
		currentFloor = randomValue(Building.floors.length - 1);
		destinationFloor = randomValue(Building.floors.length - 1);
	}
	addPerson(currentFloor, destinationFloor);
}

function setup() {
	Building = new building(50, 2, 10);
	Building.drawBuilding();
	populateInfoArray();
}

function displayFloorInfo() {
	let floorInfo = document.getElementById("floorInfo");
	let value = floorInfo.value;
	let output = document.getElementById("div-info");
	output.innerHTML = Building.floors[value].displayInfo();

}


function test() {

}
//test();
setup();
