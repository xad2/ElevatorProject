/*jshint esversion: 6 */
/*globals document, randomValue, isFloorValid, infoArray, usedNamesArray, building, person, Statistics, populateInfoArray,
floorCall, Image, isElevatorValid, isValid
*/
const timer = 800;
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

var HomerImage = new Image();
HomerImage.src = "images/Homer.png";

var ElevatorImage = new Image();
ElevatorImage.src = "images/Elevator.jpg";

var DoorImage = new Image();
DoorImage.src = "images/door.jpg";


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
					break;
				}
			}
			let elevators = Building.elevators;
			for (let i = 0; i < elevators.length; i++) {
				if (elevators[i].isWithinElevatorArea(event.offsetX, event.offsetY)) {
					event.preventDefault();
					event.stopPropagation();
					elevators[i].displayInfo();
					break;
				}
			}

		},
		false);


}

function displayFloorInfo_() {
	let floorInfo = document.getElementById("floorInfo");
	let value = floorInfo.value;
	let output = document.getElementById("infoPerson");
	output.innerHTML = Building.floors[value].displayInfo();

}

function setCanvasMeasurements(floorsAmount, elevatorsAmount) {
	canvas.height = (floorsAmount * 100);
	canvas.width = 320 + (100 * elevatorsAmount); //width for 1 elev: 100
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

function removePerson(currentFloor, destinationFloor) {
	if (!isNaN(currentFloor) && currentFloor !== "" && !isNaN(destinationFloor) && destinationFloor !== "") {

		currentFloor = Number(currentFloor);
		destinationFloor = Number(destinationFloor);

		if (isFloorValid(currentFloor) && isFloorValid(destinationFloor)) {
			let people = Building.floors[currentFloor].people;
			for (let i = 0; i < people.length; i++) {
				if (!people[i].waiting) {
					let newPerson = people[i];
					newPerson.destinationFloor = destinationFloor;
					newPerson.waiting = true;
					newPerson.clear();
					newPerson.draw();
					Building.addCall(floorCall(Building.floors[currentFloor], newPerson.direction()));
					break;
				}
			}

		}
	}
}



function setup() {
	let floorsInput = Number(document.getElementById("floors").value);
	let elevatorsInput = Number(document.getElementById("Elevators").value);
	let capacityInput = Number(document.getElementById("Capacity").value);
	if(isElevatorValid(elevatorsInput) && capacityInput > 0 && isFloorValid(floorsInput) ){
	    Building = new building(floorsInput, elevatorsInput, capacityInput);
	    Building.drawBuilding();
	    addEventListeners();
	    populateInfoArray();
    }else
        alert("Invalid settings! Please see manual if you're unsure why.");
}
