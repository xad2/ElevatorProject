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
	
	this.displayInfo = function(){
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
	ctx.clearRect(402, 520 - (floor.number * 55), 76, 40);
	for (let i = 0; i < floor.people.length; i++)
		ctx.fillText(floor.people[i].destinationFloor, 460 - (i * 8), 540 - (floor.number * 55));

}

function drawPersonInTheElevator() {
 	ctx.save();		
 	ctx.fillStyle = "white";		
  	ctx.font = "14px Georgia";

	let height = 540;
	let width = 0;
	for (let i = 0; i < Elevator.people.length; i++) {
		if (Math.floor(i / 5) > 0)
			height = 560;
		if (width >= 5)
			width = 0;		
		ctx.fillText(Elevator.people[i].destinationFloor, 482 + (width * 9), height - (Elevator.currentFloor * 55));
		width++;

	}
	ctx.restore();
}
