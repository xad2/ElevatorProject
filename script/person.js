/*jshint esversion: 6 */
/*globals direction */
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
