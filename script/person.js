/*jshint esversion: 6 */
/*globals direction, Elevator, document, Statistics, console, Building */


function person(info, currentFloor, destinationFloor) {
	this.info = info;
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
		if (this.stats === undefined)
			this.stats = new Statistics();
		this.stats.initStatistics(this.currentFloor, this.destinationFloor);
	};

	// fazer metodo para display info (incluindo statistics.)

	this.displayInfo = function () {
		let output = "";

		output += "Name: " + this.info.name + "<br>";
		output += "Commentary: " + this.info.commentary;
		output += this.stats.displayResults();
		return output;
	};


}

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
