/*jshint esversion: 6*/
/*globals document, floors, drawPersonInTheElevator, Statistics, console, setTimeout, Building, timer, floorCall, ctx, size , DoorImage, ElevatorImage*/

var direction = {
	UP: 1,
	DOWN: -1,
	NONE: 0
};

function Elevator(capacity, number, coord) {
	//'use strict';
	this.number = number;
	this.capacity = capacity;
	this.currentFloor = 0;
	this.destinationFloors = [];
	this.calledFloor = [];
	this.direction = direction.NONE;
	this.people = [];
	this.stats = undefined;
	this.elevatorSize = new size(76, 95);
	this.coord = coord;
	let isMoving = false;
	let previousFloor;

	function initStatistics() {
		this.stats = new Statistics();
		this.stats.initStatistics(this.currentFloor, 0);
	}

	function hasDestination() {
		return (this.destinationFloors.length > 0) || (this.people.length > 0);
	}
	this.hasCalledFloor = function (calledFloor) {
		for (let i = 0; i < this.calledFloor.length; i++) {
			if ((this.calledFloor[i].floor.number === calledFloor.floor.number) && (this.calledFloor[i].direction === calledFloor.direction)) {
				return {
					found: true,
					index: i
				};
			}
		}
		return {
			found: false,
			index: undefined
		};

	};

	this.acceptCall = function (calledFloor) {
		if (!hasDestination.call(this)) {
			addDestination.call(this, calledFloor.floor);
			this.calledFloor.push(calledFloor);
			return true;
		} else {
			//checking if the floor is in the same direction of the elevator
			if ((this.currentFloor <= calledFloor.floor.number && this.direction === direction.UP) ||
				(this.currentFloor >= calledFloor.floor.number && this.direction === direction.DOWN)) {
				//checking if the floor called direction is in the same direction of the Elevator
				if (this.direction === calledFloor.direction) {
					addDestination.call(this, calledFloor.floor);
					if (!this.hasCalledFloor(calledFloor).found)
						this.calledFloor.push(calledFloor);
					return true;
				}
			}
		}
		return false;

	};

	function addDestination(floor) {
		var wasTheFloorCalledBefore = false;
		for (let i = 0; i < this.destinationFloors.length; i++) {
			wasTheFloorCalledBefore = (this.destinationFloors[i].number === floor.number);
			if (wasTheFloorCalledBefore)
				break;
		}
		if (!wasTheFloorCalledBefore)
			this.destinationFloors.push(floor);
	}


	function moveNextFloor() {
		if (hasDestination.call(this)) {
			switch (this.direction) {
				case direction.DOWN:
					if (this.currentFloor > 0) {
						this.currentFloor--;
						this.coord.y += 100;
					}
					break;
				case direction.UP:
					if (this.currentFloor < Building.floors.length) {
						this.currentFloor++;
						this.coord.y -= 100;
					}
					break;
				case direction.NONE:
					break;
				default:
					break;
			}
			this.stats.incrementMovement();
		} else
			this.direction = direction.NONE;
	}


	this.move = function () {
		this.draw(previousFloor);
		updateDirection.call(this);
		if (hasDestination.call(this)) {
			isMoving = true;
			previousFloor = this.currentFloor;
			for (let i = 0; i < this.destinationFloors.length; i++) {
				if (this.currentFloor === this.destinationFloors[i].number) {
					this.destinationFloors.splice(i, 1);
					updateDirection.call(this);
					this.reloadPeople();
					break;
				}
			}
			moveNextFloor.call(this);
			setTimeout(this.move.bind(this), timer);
		} else {
			this.stopMoving.call(this);
		}
		this.draw(previousFloor);
	};
	this.startMoving = function () {
		if (!isMoving) {
			initStatistics.call(this);
			this.move();

		}

	};
	this.stopMoving = function () {
		isMoving = false;
		this.stats.endTime = new Date();
		this.stats.finalPos = this.currentFloor;

	};


	function updateDirection() {
		let up = false;
		let down = false;
		for (let i = 0; i < this.destinationFloors.length; i++) {
			if (this.destinationFloors[i].number > this.currentFloor)
				up = true;
			if (this.destinationFloors[i].number < this.currentFloor)
				down = true;
		}
		let peopleInThisFloor = Building.floors[this.currentFloor].people;
		for (let i = 0; i < peopleInThisFloor.length; i++) {
			if (peopleInThisFloor[i].waiting) {
				if (peopleInThisFloor[i].destinationFloor > this.currentFloor)
					up = true;
				if (peopleInThisFloor[i].destinationFloor < this.currentFloor)
					down = true;
			}
		}

		if (this.destinationFloors.length === 0)
			this.direction = direction.NONE;
		if (((this.direction === direction.UP) || (this.direction === direction.NONE)) && (up))
			this.direction = direction.UP;
		else if (((this.direction === direction.DOWN) || (this.direction === direction.NONE)) && (down))
			this.direction = direction.DOWN;
		else
			this.direction = direction.NONE;

	}


	this.reloadPeople = function () {
		let peopleLeft = removePeople.call(this);
		let peopleEntered = getPeople.call(this);
		if (peopleEntered || peopleLeft)
			this.stats.incrementNumOfStops();
	};

	function removePeople() {
		let peopleLeft = false;
		for (let i = 0; i < this.people.length; i++) {
			let person = this.people[i];
			person.stats.incrementMovement();
			if (person.destinationFloor === this.currentFloor) {
				person.currentFloor = this.currentFloor;
				//moving the person to the floor.
				if (this.currentFloor > 0) {
					Building.floors[this.currentFloor].addPerson(person);
				}
				//removing person from the people array.
				this.people.splice(i, 1);
				i--;
				person.stats.incrementNumOfStops();
				person.stats.endTime = new Date();
				peopleLeft = true;
			}

		}
		return peopleLeft;

	}

	function getPeople() {
		let peopleEntered = false;
		//updateDirection.call(this);
		let peopleOnThisFloor = Building.floors[this.currentFloor].people;
		for (let i = 0; i < peopleOnThisFloor.length; i++) {
			//check the capacity
			if (this.people.length === this.capacity)
				break;
			if (peopleOnThisFloor[i].waiting && ((peopleOnThisFloor[i].direction() === this.direction) || (this.direction === direction.NONE))) {
				peopleOnThisFloor[i].waiting = false;

				//adicionar a pessoa no elevador.
				this.people.push(peopleOnThisFloor[i]);
				addDestination.call(this, Building.floors[peopleOnThisFloor[i].destinationFloor]);
				peopleOnThisFloor[i].initStatistics();

				//retirar a pessoa do andar	removePerson
				Building.floors[this.currentFloor].removePerson(i);
				i--;
				peopleEntered = true;
			}
		}
		removeCalledFloor.call(this);
		return peopleEntered;

	}

	function removeCalledFloor() {
		for (let i = 0; i < this.calledFloor.length; i++) {
			if (this.calledFloor[i].floor.number === this.currentFloor) {
				this.calledFloor.splice(i, 1);
				i--;
			}
		}
		createNewCallForTheRemaining.call(this);
	}

	function createNewCallForTheRemaining() {
		for (let i = 0; i < Building.floors[this.currentFloor].people.length; i++) {
			let person = Building.floors[this.currentFloor].people[i];
			if (person.waiting)
				Building.addCall(floorCall(Building.floors[this.currentFloor], person.direction()));
		}
	}


	this.draw = function (previusFloor = 0) {
		ctx.save();
		ctx.beginPath();
		if (previusFloor > this.currentFloor)
			ctx.drawImage(DoorImage, this.coord.x, this.coord.y - 100, this.elevatorSize.width, this.elevatorSize.height);
		else
			ctx.drawImage(DoorImage, this.coord.x, this.coord.y + 100, this.elevatorSize.width, this.elevatorSize.height);
		ctx.drawImage(ElevatorImage, this.coord.x, this.coord.y, this.elevatorSize.width, this.elevatorSize.height);
		drawPersonInTheElevator.call(this);
		ctx.restore();
	};

	function drawPersonInTheElevator() {
		let x = this.coord.x;
		let y = this.coord.y + 5;
		for (let i = 0; i < this.people.length; i++) {
			if (i % 5 === 0 && i !== 0) {
				y += this.people[i].size.height; // start at the top
				x = this.coord.x;
			}
			this.people[i].coord.x = x;
			this.people[i].coord.y = y;
			this.people[i].draw();
			x += this.people[i].size.width - 5;
		}
	}


	this.isWithinElevatorArea = function (x, y) {
		return (x >= this.coord.x && x <= this.coord.x + this.elevatorSize.width) && (y >= this.coord.y && y <= this.coord.y + this.elevatorSize.height);
	};
	this.displayInfo = function () {
		if (this.stats !== undefined) {
			let infoElevator = document.getElementById("infoElevator");
			infoElevator.innerHTML = "<b>Elevator: " + this.number + "</b><br>" + this.stats.displayResults(infoElevator);
		}
	};
}
