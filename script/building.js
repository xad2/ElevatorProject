/*jshint esversion: 6 */
/*globals document, Image, console, randomValue, floors, drawElevator, person, Elevator, setTimeout, isFloorValid, Statistics, populateInfoArray, infoArray, floor, usedNamesArray, canvas, timer, ctx, coordinates, size, setCanvasMeasurements */

const floorHeight = 80;
var closerElevator = function (currentFloor, elevator) {
	return {
		closer: Math.abs(elevator.currentFloor - currentFloor),
		elevator: elevator
	};
};

function building(amountOfFloors, amountOfElevators, elevatorCapacity) {
	this.floors = [];
	this.elevators = [];
	let callQueue = [];

	let buildingTop = 0;
	let buildingBottom = canvas.height;
	let floorSize = 100;
	let spacesBetweenElevators = 20 * (amountOfElevators - 1);
	let firstFloorY = function () {
		return (canvas.height - floorSize);
	};


	this.addCall = function (floorCall) {
		if (!findSameCallAtElevators.call(this, floorCall)) {
			callQueue.push(floorCall);
			this.callElevator();
		}
	};
	this.callElevator = function () {
		for (let i = 0; i < callQueue.length; i++) {
			let closerElevators = [];
			for (let j = 0; j < this.elevators.length; j++) {
				closerElevators.push(closerElevator(callQueue[i].floor.number, this.elevators[j]));
			}
			closerElevators.sort(function (a, b) {
				return a.closer - b.closer;
			});

			for (let j = 0; j < closerElevators.length; j++) {
				if (closerElevators[j].elevator.acceptCall(callQueue[i])) {
					callQueue.splice(i, 1);
					i--;
					break;
				}
			}

		}
		startElevatorsMoving.call(this);
		if (callQueue.length > 0) {
			setTimeout(this.callElevator.bind(this), timer);
		}

	};

	function startElevatorsMoving() {
		for (let i = 0; i < this.elevators.length; i++)
			this.elevators[i].startMoving();
	}

	function findSameCallAtElevators(floorCall) {
		for (let i = 0; i < this.elevators.length; i++) {
			if (this.elevators[i].hasCalledFloor(floorCall).found)
				return true;
		}
		return false;
	}

	this.drawBuilding = function () {
		let elevatorsAmount = this.elevators.length;
		let initialSpace = 100;
		ctx.beginPath();
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.strokeStyle = "white";
		for (let i = 0; i < this.elevators.length; i++) {
			for (let j = 0; j < this.floors.length; j++) {
				let x = 130 + (100 * i);
				let y = buildingTop + (j * floorSize);
				let width = 80;
				ctx.rect(x, y, width, floorSize);
				ctx.drawImage(DoorImage, x, y, width, floorSize);

			}
		}
		ctx.stroke();

		this.drawFloorButtons();

		for (let i = 0; i < amountOfElevators; i++)
			this.elevators[i].draw();
	};
	this.drawFloorButtons = function () {
		ctx.font = "18px Arial";
		ctx.textAlign = "end";
		let x = 110;
		let y = firstFloorY() + (floorHeight / 2);
		for (let i = 0; i < this.floors.length; i++) {
			this.floors[i].buttonCoordinate = coordinates(x, y);
			this.floors[i].buttonSize = size(30, 30);
			this.floors[i].drawButton();
			this.drawAddRemovePersonButton(x, y);
			y -= floorSize;
		}



	};
	this.drawAddRemovePersonButton = function (x, y) {
		ctx.save();
		ctx.beginPath();
		ctx.fillStyle = "white";
		ctx.arc(x-75, y, 12, 0, Math.PI * 2);
		ctx.arc(x-43, y, 12, 0, Math.PI * 2);
		ctx.fill();	
		ctx.beginPath();
		ctx.fillStyle = "green";
		ctx.fillText("+", x - 70, y + 6);
		ctx.fillStyle = "red";
		ctx.fillText("-", x - 40, y + 4);
		ctx.stroke();
		ctx.restore();
	};

	function buildingConstructor(amountOfFloors, amountOfElevators, elevatorCapacity) {
		setCanvasMeasurements(amountOfFloors, amountOfElevators); // need to set first in order to update variables.
		for (let i = 0; i < amountOfFloors; i++) {
			let newSize = new size(floorHeight * amountOfElevators + spacesBetweenElevators, floorSize * amountOfElevators);
			let newCoord = new coordinates(130, firstFloorY() - (i * floorSize));
			this.floors.push(new floor(i, newSize, newCoord));

		}

		for (let i = 0; i < amountOfElevators; i++)
			this.elevators.push(new Elevator(elevatorCapacity, i, coordinates((132 + (100 * i)), firstFloorY() + 2)));
	}

	buildingConstructor.call(this, amountOfFloors, amountOfElevators, elevatorCapacity);


}
