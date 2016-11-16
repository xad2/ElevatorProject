/*jshint esversion: 6 */
/*globals document, floors, Statistics */
/// <reference path="floors.js" />
/// <reference path="person.js" />
/// <reference path="stats.js" />


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
	this.calledFloors = [];
	this.stats = new Statistics(this.currentFloor);
    
    
    
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
	
	this.incrementMovementForEachPerson = function(){
	    
	    
	    for(let i = 0; i < this.people.length; i++){
	        let person = this.people[i];
	        person.stats.incrementMovement();
	    }
	    
	};
	
	
	this.moveNextFloor = function () {
		if (this.wasCalled()) {
			switch (this.direction) {
				case direction.DOWN:
					if (this.currentFloor > 0){
					    this.stats.incrementMovement();
					    
					    this.incrementMovementForEachPerson();
						this.currentFloor--;
					}
					break;
				case direction.UP:
					if (this.currentFloor < floors.length){
					    this.stats.incrementMovement();
                        this.incrementMovementForEachPerson();
						this.currentFloor++;
					}
					break;
				case direction.NONE:
				    //this.countMovement = 0;
					break;
				default:
					break;
			}
		} else{
			this.direction = direction.NONE;
			//elevator statistiscs
			this.stats.incrementNumOfStops();
			this.stats.setFinalPos(this.currentFloor);
            this.stats.displayResults("Elevator");
            
		}
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
				this.addCalled(floors[peopleOnThisFloor[i].destinationFloor]);

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
			if (person.destinationFloor === this.currentFloor) {
				person.currentFloor = this.currentFloor;
				console.log("The elevator has traveled " + this.countMovement + " floors");
				console.log("and it took " + this.countMovement*2 + " secs to arrive at floor " +this.currentFloor  );
				//moving the person to the floor.
				if (this.currentFloor > 0) {
					floors[this.currentFloor].addPerson(person);
				}
				
				//person statistics
				person.stats.setFinalPos(this.currentFloor);
				person.stats.displayResults(person.name);
				
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
			for (let i = 0; i < this.calledFloors.length; i++)
				if (this.currentFloor === this.calledFloors[i].number)
					this.calledFloors.splice(i, 1);
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
