/*jshint esversion: 6 */
function person(name, floor) {
	this.name = name;
	this.floorWantToGo = floor;
	this.waiting = true;
	this.direction = 0;
	return this;
}
