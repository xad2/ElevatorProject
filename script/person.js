/*jshint esversion: 6 */
/*globals direction, Elevator, document, Statistics, console, Building, coord, size, HomerImage, ctx */

function person(info, currentFloor, destinationFloor) {
	this.info = info;
	this.currentFloor = currentFloor;
	this.destinationFloor = destinationFloor;
	this.waiting = true;
	this.stats = undefined;
	this.coord = undefined;
	this.size = new size(HomerImage.width, HomerImage.height);

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

	this.displayInfo = function () {
		let output = "";
		output += "Name: " + this.info.name + "<br>";
		output += "Commentary: " + this.info.commentary;
		output += this.stats.displayResults();
		return output;
	};

	this.draw = function () {
		if (this.waiting)
			ctx.drawImage(HomerImage, this.coord.x, this.coord.y);
		else {
			ctx.save();
			ctx.translate(this.coord.x + this.size.width, this.coord.y);
			ctx.scale(-1, 1);
			ctx.drawImage(HomerImage, 0, 0);
			ctx.restore();
		}
	};

	this.clear = function () {
		ctx.clearRect(this.coord.x, this.coord.y, this.size.width, this.size.height);
	};
}