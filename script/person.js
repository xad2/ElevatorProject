/*jshint esversion: 6 */
/*globals direction, Elevator, document, Statistics, console */


function person(nameCommentary, currentFloor, destinationFloor) {
	this.info = nameCommentary;
	this.currentFloor = currentFloor;
	this.destinationFloor = destinationFloor;
	this.waiting = true;
	this.stats = undefined;
	this.direction = function () {
		if (this.currentFloor > this.destinationFloor) {
			return direction.DOWN;
		} else {
			return direction.UP;
		}
	};

	this.initStatistics = function () {
		this.stats = new Statistics();
		this.stats.initStatistics(this.currentFloor, this.destinationFloor);
	};

	// fazer metodo para display info (incluindo statistics.)

	this.displayInfo = function () {
		let infoPerson = document.getElementById("infoPerson");

		infoPerson.innerHTML = "Name: " + this.info.name + "<br>";
		infoPerson.innerHTML += "Commentary: " + this.info.commentary;
		this.stats.displayResults(infoPerson);
	};


}

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

function drawPersonInTheFloor2(floorNumber, amountOfPeople) {
	ctx.clearRect(405, 530 - (floorNumber * 55), 60, 15);
	for (let i = 0; i < amountOfPeople; i++)
		ctx.fillRect(460 - (i * 8), 530 - (floorNumber * 55), 5, 15);
}


function drawPersonInTheFloor(floor) {
	ctx.clearRect(320, 20 + (100 * (Building.floors.length - 1 - floor.number)), 118, 40);
	for (let i = 0; i < floor.people.length; i++)
		ctx.fillText(floor.people[i].destinationFloor, 320 + (i * 10), 55 + (100 * (Building.floors.length - 1 - floor.number)));
}
