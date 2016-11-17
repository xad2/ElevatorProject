/*jshint esversion: 6 */
/*globals console, timer */

function Statistics() {
	this.originalPos = 0;
	this.finalPos = 0;
	this.numberOfStops = 0;
	this.totalMovement = 0;

	this.initStatistics = function (originalPos, finalPos) {
		this.originalPos = originalPos;
		this.finalPos = finalPos;
	};

	this.incrementNumOfStops = function () {
		this.numberOfStops++;
	};

	this.incrementMovement = function () {
		this.totalMovement++;
	};
	//stopTime: average time for elevator staying in a floor in secs
	//intervalTime: average time it takes to go from 1 floor to the next in sec
	this.calculateTimePassed = function (stopTime, intervalTime) {
		return (stopTime * this.numberOfStops) + (this.totalMovement * intervalTime);
	};

	this.displayResults = function () {
		console.log("||||||||||||||||||||||||||||||||");
		console.log("Original position: " + this.originalPos);
		console.log("Final position: " + this.finalPos);
		console.log("Number of stops: " + this.numberOfStops);
		console.log("Number of moviments: " + this.totalMovement);
		console.log("Total time passed: " + this.calculateTimePassed(5, timer/1000));
		console.log("||||||||||||||||||||||||||||||||");
	};
	return this;
}
