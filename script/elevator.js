/*jshint esversion: 6 */
/*globals document, floors, drawPersonInTheElevator, Statistics, console, setTimeout, Building, timer */
/// <reference path="floors.js" />
/// <reference path="person.js" />

var direction = {
	UP: 1,
	DOWN: -1,
	NONE: 0
};

function Elevator(capacity) {
	this.currentFloor = 0;
	this.capacity = capacity;
	this.direction = direction.NONE;
	this.people = [];
	this.calledFloors = [];
	this.stats = undefined;

	this.initStatistics = function () {
		this.stats = new Statistics();
		this.stats.initStatistics(this.currentFloor, 0);
	};


	this.addCalled = function (floor) {
		let floorCalled = false;
		for (let i = 0; i < this.calledFloors.length; i++) {
			floorCalled = (this.calledFloors[i].number === floor.number);
			if (floorCalled)
				break;
		}
		if (!floorCalled)
			this.calledFloors.push(floor);
	};
	this.wasCalled = function () {
		return (this.calledFloors.length > 0) || (this.people.length > 0);
	};

	this.moveNextFloor = function () {
		if (this.wasCalled()) {
			switch (this.direction) {
				case direction.DOWN:
					if (this.currentFloor > 0)
						this.currentFloor--;
					break;
				case direction.UP:
					if (this.currentFloor < floors.length)
						this.currentFloor++;
					break;
				case direction.NONE:
					break;
				default:
					break;
			}
			this.stats.incrementMovement();
		} else
			this.direction = direction.NONE;
	};
	this.checkDirection = function () {
		let up = false;
		let down = false;
		for (let i = 0; i < this.calledFloors.length; i++) {
			if (this.calledFloors[i].number > this.currentFloor)
				up = true;
			if (this.calledFloors[i].number < this.currentFloor)
				down = true;
		}
		let peopleInThisFloor = floors[this.currentFloor].people;
		for (let i = 0; i < peopleInThisFloor.length; i++) {
			if (peopleInThisFloor[i].waiting) {
				if (peopleInThisFloor[i].destinationFloor > this.currentFloor)
					up = true;
				if (peopleInThisFloor[i].destinationFloor < this.currentFloor)
					down = true;
			}
		}

		if (this.calledFloors.length === 0)
			this.direction = direction.NONE;
		if (((this.direction === direction.UP) || (this.direction === direction.NONE)) && (up))
			this.direction = direction.UP;
		else if (((this.direction === direction.DOWN) || (this.direction === direction.NONE)) && (down))
			this.direction = direction.DOWN;
		else
			this.direction = direction.NONE;

	};

	this.reloadPeople = function () {
		let peopleLeft = this.removePeople();
		let peopleEntered = this.getPeople();
		this.checkDirection();
		//this.stats.incrementMovement();
		if (peopleEntered || peopleLeft)
			this.stats.incrementNumOfStops();
	};
	this.getPeople = function () {
		let peopleEntered = false;
		this.checkDirection();
		let peopleOnThisFloor = Building.floors[this.currentFloor].people;
		for (let i = 0; i < peopleOnThisFloor.length; i++) {
			//check the capacity
			if (this.people.length === this.capacity)
				break;
			if (peopleOnThisFloor[i].waiting && ((peopleOnThisFloor[i].direction() === this.direction) || (this.direction === direction.NONE))) {
				peopleOnThisFloor[i].waiting = false;

				//adicionar a pessoa no elevador.
				this.people.push(peopleOnThisFloor[i]);
				this.addCalled(Building.floors[peopleOnThisFloor[i].destinationFloor]);
				peopleOnThisFloor[i].initStatistics();

				//retirar a pessoa do andar	removePerson
				Building.floors[this.currentFloor].removePerson(i);
				i--;
				peopleEntered = true;
			}
		}
		this.removeCalledFloors();
		return peopleEntered;

	};
	this.removePeople = function () {
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
				person.displayInfo();
				peopleLeft = true;
			}

		}
		return peopleLeft;

	};
	this.removeCalledFloors = function () {
		let isAnyoneWaiting = false;
		for (let i = 0; i < floors[this.currentFloor].people.length; i++) {
			if (floors[this.currentFloor].people[i].waiting) {
				isAnyoneWaiting = true;
				break;
			}
		}
		if (!isAnyoneWaiting) {
			for (let i = 0; i < this.calledFloors.length; i++)
				if (this.currentFloor === this.calledFloors[i].number)
					this.calledFloors.splice(i, 1);
		}

	};


	let previousFloor;
	this.isMoving = false;
	this.move = function () {
		console.log(this.currentFloor + " Elevator: " + this.people.length);
		this.draw(previousFloor);
		/*create a new function */
		if (this.wasCalled()) {
			this.isMoving = true;
			previousFloor = this.currentFloor;
			this.reloadPeople();
			this.moveNextFloor();
			//setTimeout(Building.Elevator.move, timer);
			setTimeout(this.move.bind(this), timer);
		} else {
			this.isMoving = false;
			this.stats.finalPos = this.currentFloor;

			let infoElevator = document.getElementById("infoElevator");
			this.stats.displayResults(infoElevator);
		}
		this.draw(previousFloor);
	};


	this.draw = function (previusFloor = 0) {
		let canvas = document.getElementById("canvas");
		let ctx = canvas.getContext("2d");
		ctx.save();
		ctx.beginPath();
		ctx.clearRect(481, 518 - (previusFloor * 55), 48, 50);
		ctx.fillStyle = "blue";
		ctx.fillRect(481, 518 - (this.currentFloor * 55), 48, 50);
		drawPersonInTheElevator.bind(this);
		ctx.restore();
	};

	function drawPersonInTheElevator() {
		let canvas = document.getElementById("canvas");
		let ctx = canvas.getContext("2d");
		ctx.save();
		ctx.fillStyle = "white";
		ctx.font = "14px Georgia";

		let height = 540;
		let width = 0;
		for (let i = 0; i < this.people.length; i++) {
			if (Math.floor(i / 5) > 0)
				height = 560;
			if (width >= 5)
				width = 0;
			ctx.fillText(this.people[i].destinationFloor, 482 + (width * 9), height - (this.currentFloor * 55));
			width++;

		}
		ctx.restore();
	}

}
