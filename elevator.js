/*jshint esversion: 6 */
/*globals document, floors */
/// <reference path="floors.js" />
function elevator() {
	this.currentFloor = 0;
	this.capacity = 10;
	this.people = [];
	this.direction = 0; // 1up, -1 down, 0-none
	this.calledFloors = [];

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

	this.moveNextFloor = function () {
		if((this.calledFloors.length > 0) || (this.people.length>0)){
			switch (this.direction) {
				case -1:
					this.currentFloor--;
					break;
				case 1:
					this.currentFloor++;
					break;
				case 0://
					if (this.calledFloors.length > 0) {
						if (this.currentFloor > this.calledFloors[0].number)
							this.direction = -1;
						else
							this.direction = 1;
					}else{
						if (this.people.length>0){
							if (this.currentFloor > this.people[0].floorWantToGo)
							this.direction = -1;
						else
							this.direction = 1;
						}
					}
					break;
				default:
					break;
			}
		} else
			this.direction = 0;

	};

	this.reloadPeople = function () {
		this.removePeople();
		this.getPeople();

	};

	this.getPeople = function () {
		//check the capacity
		let peopleOnThisFloor = floors[this.currentFloor].people;
		for (let i = 0; i < peopleOnThisFloor.length; i++) {
		   
		    //adicionar direcao para a pessoa
		    if(this.currentFloor > peopleOnThisFloor[i].floorWantToGo)
		        peopleOnThisFloor[i].direction = 1;
		    else if (this.currentFloor < peopleOnThisFloor[i].floorWantToGo)
		        peopleOnThisFloor[i].direction = -1;
		    else
		        peopleOnThisFloor[i].direction = 0;
		        
		        
			if (peopleOnThisFloor[i].waiting && peopleOnThisFloor[i].direction === this.direction) {
				peopleOnThisFloor[i].waiting = false;
				//adicionar a pessoa no elevador.
				this.people.push(peopleOnThisFloor[i]);
				//retirar a pessoa do andar	removePerson?	
				peopleOnThisFloor.splice(i, 1);
			}
		}
		this.removeCalledFloors();
	};

	this.removePeople = function () {
		for (let i = 0; i < this.people.length; i++) {
			let person = this.people[i];
			if (person.floorWantToGo === this.currentFloor) {
				//moving the person to the floor.
				if (this.currentFloor > 0) {
					floors[this.currentFloor].addPerson(person);
				}
				//removing person from the people array.
				this.people.splice(i, 1);
			}
		}
	};

	this.removeCalledFloors = function () {
		for (let i = 0; i < this.calledFloors.length; i++) {
			if (this.currentFloor == this.calledFloors[i].number)
				this.calledFloors.splice(i, 1);
		}
	};
}

function drawElevator(floor) {
	let canvas = document.getElementById("canvas");
	let ctx = canvas.getContext("2d");
	ctx.beginPath();
	ctx.fillStyle = "blue";
	ctx.fillRect(481, 518 - (floor * 55), 48, 50);
}
