/*jshint esversion: 6 */
/*globals direction, Elevator, document */
function person(name, currentFloor, floorOut) {
	this.name = name;
	this.currentFloor = currentFloor;
	this.floorOut = floorOut;
	this.waiting = true;
	this.direction = function () {
		if (this.currentFloor > this.floorOut) {
			return direction.DOWN;
		} else {
			return direction.UP;
		}
	};
}

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

function drawPersonInTheFloor(floorNumber, amountOfPeople) {
	ctx.clearRect(405, 530 - (floorNumber * 55), 60, 15);
	for (let i = 0; i < amountOfPeople; i++)
		ctx.fillRect(460 - (i * 8), 530 - (floorNumber * 55), 5, 15);
}


function drawPersonInTheFloor(floor) {
	ctx.clearRect(405, 530 - (floor.number * 55), 60, 15);
	for (let i = 0; i < floor.people.length; i++)
		ctx.fillText(floor.people[i].floorOut, 460 - (i * 8), 540 - (floor.number * 55));

}

function drawPersonInTheElevator() {
	ctx.save();
	ctx.fillStyle = "white";
	ctx.font = "14px Georgia";
	for (let i = 0; i < Elevator.people.length; i++)
		ctx.fillText(Elevator.people[i].floorOut, 482 + (i * 9), 550 - (Elevator.currentFloor * 55));
	ctx.restore();
}
