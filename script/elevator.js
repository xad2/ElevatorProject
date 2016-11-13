/*jshint esversion: 6 */
/*globals document, floors */
/// <reference path="floors.js" />
/// <reference path="person.js" />

var direction = {
	UP: 1,
	DOWN: -1,
	NONE: 0
};

function Elevator() {
	this.currentFloor = 0;
	this.capacity = 10;
	this.direction = direction.NONE;
	this.people = [];
	this.floorsCalled = [];

	this.addCalled = function (floor) {
		let floorCalled = false;
		for (let i = 0; i < this.floorsCalled.length; i++) {
			floorCalled = (this.floorsCalled[i].number === floor.number);
			if (floorCalled)
				break;
		}
		if (!floorCalled)
			this.floorsCalled.push(floor);
	};
	this.wasCalled = function () {
		return (this.floorsCalled.length > 0) || (this.people.length > 0);
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
		} else
			this.direction = direction.NONE;

	};
	this.checkDirection = function () {
		let up = false;
		let down = false;
		for (let i = 0; i < this.floorsCalled.length; i++) {
			if (this.floorsCalled[i].number > this.currentFloor)
				up = true;
			if (this.floorsCalled[i].number < this.currentFloor)
				down = true;
		}
		let peopleInThisFloor = floors[this.currentFloor].people;
		for (let i = 0; i < peopleInThisFloor.length; i++) {
			if (peopleInThisFloor[i].waiting) {
				if (peopleInThisFloor[i].floorOut > this.currentFloor)
					up = true;
				if (peopleInThisFloor[i].floorOut < this.currentFloor)
					down = true;
			}
		}

		if (this.floorsCalled.length === 0)
			this.direction = direction.NONE;
		if (((this.direction === direction.UP) || (this.direction === direction.NONE)) && (up))
			this.direction = direction.UP;
		else if (((this.direction === direction.DOWN) || (this.direction === direction.NONE)) && (down))
			this.direction = direction.DOWN;
		else
			this.direction = direction.NONE;
	};

	this.reloadPeople = function () {
		this.removePeople();
		this.getPeople();
		this.checkDirection();

	};
	this.getPeople = function () {
		this.checkDirection();
		let peopleOnThisFloor = floors[this.currentFloor].people;
		for (let i = 0; i < peopleOnThisFloor.length; i++) {
			//check the capacity
			if (this.people.length === this.capacity)
				break;
			if (peopleOnThisFloor[i].waiting && ((peopleOnThisFloor[i].direction() === this.direction) || (this.direction === direction.NONE))) {
				peopleOnThisFloor[i].waiting = false;

				//adicionar a pessoa no elevador.
				this.people.push(peopleOnThisFloor[i]);
				this.addCalled(floors[peopleOnThisFloor[i].floorOut]);

				//retirar a pessoa do andar	removePerson
				floors[this.currentFloor].removePerson(i);
				i--;
			}
		}
		this.removeCalledFloors();

	};
	this.removePeople = function () {
		for (let i = 0; i < this.people.length; i++) {
			let person = this.people[i];
			if (person.floorOut === this.currentFloor) {
				person.currentFloor = this.currentFloor;
				//moving the person to the floor.
				if (this.currentFloor > 0) {
					floors[this.currentFloor].addPerson(person);
				}
				//removing person from the people array.
				this.people.splice(i, 1);
				i--;
			}
		}
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
			for (let i = 0; i < this.floorsCalled.length; i++)
				if (this.currentFloor === this.floorsCalled[i].number)
					this.floorsCalled.splice(i, 1);
		}

	};

	return this;
}

function drawElevator(floor, previusFloor = 0) {
	let canvas = document.getElementById("canvas");
	let ctx = canvas.getContext("2d");
	ctx.save();
	ctx.beginPath();
	ctx.clearRect(481, 518 - (previusFloor * 55), 48, 50);
	ctx.fillStyle = "blue";
	ctx.fillRect(481, 518 - (floor * 55), 48, 50);
	drawPersonInTheElevator();
	ctx.restore();
}
