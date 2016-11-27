/*jshint esversion: 6 */
/*globals document, Image, console, randomValue, floors, drawElevator, person, Elevator, setTimeout, isFloorValid, Statistics, populateInfoArray, infoArray, floor, usedNamesArray, canvas, timer, ctx, coordinates, size, setCanvasMeasurements */

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

	let buildingTop = 10;
	let buildingBottom = function () {
		return canvas.height - 30;
	};
	let floorSize = (buildingBottom()) / this.floors.length;
	let firstFloorY = function () {
		return (canvas.height - 100);
	};
	let spacesBetweenElevators = 20*(amountOfElevators-1);

	this.addCall = function (floorCall) {
		if (!findSameCallAtElevators.call(this, floorCall)) {
			callQueue.push(floorCall);
			this.callElevator();
		}
	};
	this.callElevator = function () {
		console.log(callQueue.length);
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
					console.log("Elevador: " + closerElevators[j].elevator.number + "   Call:" + callQueue[i].floor.number);
					callQueue.splice(i, 1);
					i--;
					break;
				}
			}

		}
		//TODO: Mover os elevadores apenas depois de adicionar na fila
		if (callQueue.length > 0) {
			setTimeout(this.callElevator.bind(this), timer);
		}

	};

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
		ctx.rect(initialSpace, buildingTop, 200 + (elevatorsAmount - 1) * 100, (100 * this.floors.length));
		for (let i = 0; i < this.elevators.length; i++) {
			for (let j = 0; j < this.floors.length; j++) {
 				let x = 130 + (100 * i);
				let y = buildingTop + (j * 100);
            let width = 80;
            let height = 100;
            ctx.rect(x, y,width, height);				
				
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
		let x = 120;
		let y = buildingBottom();
		for (let i = 0; i < this.floors.length; i++) {
			this.floors[i].buttonCoordinate = coordinates(x, y);
			this.floors[i].buttonSize = size(30, 30);
			this.floors[i].drawButton();
			this.drawAddRemovePersonButton(x, y);
			y -= 100;
		}
		ctx.stroke();


	};
	this.drawAddRemovePersonButton = function (x, y) {
		ctx.save();
		ctx.fillStyle = "green";
		ctx.fillText("+", x - 70, y);
		ctx.fillStyle = "red";
		ctx.fillText("-", x - 40, y);
		ctx.restore();
	};

	function buildingConstructor(amountOfFloors, amountOfElevators, elevatorCapacity) {
		setCanvasMeasurements(amountOfFloors, amountOfElevators); // need to set first in order to update variables.
		for (let i = 0; i < amountOfFloors; i++){
			let newSize = new size(80*amountOfElevators + spacesBetweenElevators , 100*amountOfElevators);
			let newCoord = new coordinates(130, firstFloorY() - (i * 100));
			this.floors.push(new floor(i, newSize, newCoord));

		}
		for (let i = 0; i < amountOfElevators; i++)
			this.elevators.push(new Elevator(elevatorCapacity, i, floorSize - 4, coordinates((120 + (100 * i) + 1), firstFloorY() + 12)));
		
	}

	buildingConstructor.call(this, amountOfFloors, amountOfElevators, elevatorCapacity);


}
