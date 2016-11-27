/*jshint esversion: 6 */
/*globals document, randomValue, isFloorValid, infoArray, usedNamesArray, building, person, Statistics, populateInfoArray,
floorCall
*/
const timer = 800;
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

var HomerImage = new Image();
HomerImage.src = "images/Homer.png";

var coordinates = function (x, y) {
	return {
		x: x,
		y: y
	};
};

let size = function (width, height) {
	return {
		width: width,
		height: height
	};
};


var Building;


function addEventListeners() {

	canvas.addEventListener("click", function (event) {

			let floors = Building.floors;
			for (let i = 0; i < floors.length; i++) {
				if (floors[i].isWithinFloorButton(event.offsetX, event.offsetY)) {
					event.preventDefault();
					event.stopPropagation();
					floors[i].displayInfoOutside();
					break;
				} else if (floors[i].isWithinAddPersonButton(event.offsetX, event.offsetY)) {
					event.preventDefault();
					event.stopPropagation();
					let currentFloor = i;
					let destFloor = 0;
					do {
						destFloor = randomValue(floors.length - 1);
					} while (currentFloor === destFloor);
					addPerson(currentFloor, destFloor);

					break;
				} else if (floors[i].isWithinRemovePersonButton(event.offsetX, event.offsetY)) {
					event.preventDefault();
					event.stopPropagation();
					removePerson(floors[i].number, randomValue(floors.length - 1));
					//floors[i].removePerson();
					break;

				}
			}

		},
		false);


}

function displayFloorInfo() {
	let floorInfo = document.getElementById("floorInfo");
	let value = floorInfo.value;
	let output = document.getElementById("infoPerson");
	output.innerHTML = Building.floors[value].displayInfo();

}

function setCanvasMeasurements(floorsAmount, elevatorsAmount) {

	canvas.height = (floorsAmount * 100)+10;
	canvas.width += 100 * elevatorsAmount; //width for 1 elev: 100
}


function addPerson(currentFloor, destinationFloor) {
	if (!isNaN(currentFloor) && currentFloor !== "" && !isNaN(destinationFloor) && destinationFloor !== "") {
		currentFloor = Number(currentFloor);
		destinationFloor = Number(destinationFloor);
		if (isFloorValid(currentFloor) && isFloorValid(destinationFloor)) {

			
			let random = 0;
			do {
				random = randomValue(infoArray.length - 1);

			} while (usedNamesArray[random]);
			usedNamesArray[random] = true;
			let info = infoArray[random];

			let newPerson = new person(info, currentFloor, destinationFloor);
			newPerson.stats = new Statistics(currentFloor);
			Building.floors[currentFloor].addPerson(newPerson);
			Building.addCall(floorCall(Building.floors[currentFloor], newPerson.direction()));
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

function addRandomPerson() {
	let currentFloor = 0;
	let destinationFloor = 0;
	while (currentFloor === destinationFloor) {
		currentFloor = randomValue(Building.floors.length - 1);
		destinationFloor = randomValue(Building.floors.length - 1);
	}
	addPerson(currentFloor, destinationFloor);
}

function addPersonFromHTML() {
	let currentFloor = document.getElementById("currentFloor").value;
	let destinationFloor = document.getElementById("floorOut").value;
	addPerson(currentFloor, destinationFloor);
}


function removePerson(currentFloor, destinationFloor) {
	if (!isNaN(currentFloor) && currentFloor !== "" && !isNaN(destinationFloor) && destinationFloor !== "") {

		currentFloor = Number(currentFloor);
		destinationFloor = Number(destinationFloor);

		if (isFloorValid(currentFloor) && isFloorValid(destinationFloor)) {

			if (Building.floors[currentFloor].people.length > 0) {
				let newPerson = Building.floors[currentFloor].people[0];
				newPerson.destinationFloor = destinationFloor;
				newPerson.waiting = true;
				Building.addCall(floorCall(Building.floors[currentFloor], newPerson.direction()));
			}
		}
	}
}

function removePersonFromHTML() {
	let currentFloor = document.getElementById("currentFloor").value;
	let destinationFloor = document.getElementById("floorOut").value;
	removePerson(currentFloor, destinationFloor);

}



function setup() {
	Building = new building(8, 2, 10);
	Building.drawBuilding();
	addEventListeners();
	populateInfoArray();

}

setup();

function test() {

}
//test();
