/*jshint esversion: 6 */
/*globals document, floors */
/// <reference path="floors.js" />
/// <reference path="person.js" />

var direction = {
    UP: 1,
    DOWN: -1,
    NONE: 0
};

function Elevator() {
    this.currentFloor = 0;
    this.capacity = 10;
    this.people = [];
    this.direction = direction.NONE;
    this.calledFloors = [];
    this.upperFloorsCalled = [];
    this.lowerFloorsCalled = [];
    /*
    this.addUpperFloorsCalled = function(floor) {
        let floorCalled = false;
        for (let i = 0; i < this.upperFloorsCalled.length; i++) {
            floorCalled = (this.upperFloorsCalled[i].number === floor.number);
            if (floorCalled) break;
        }
        if (!floorCalled) this.upperFloorsCalled.push(floor);

    };*/
    this.addFloorsCalled = function(floor, arrFloorsCalled) {
        let floorCalled = false;
        for (let i = 0; i < arrFloorsCalled.length; i++) {
            floorCalled = (arrFloorsCalled[i].number === floor.number);
            if (floorCalled) break;
        }
        if (!floorCalled) arrFloorsCalled.push(floor);
    };
    this.elevatorIsWorking = function() {
        return (this.upperFloorsCalled.length > 0) || (this.lowerFloorsCalled.length > 0) || 
        (this.people.length > 0);
    };
    this.addCalled = function(floor) {

        if (floor.number > this.currentFloor) this.addFloorsCalled(floor, this.upperFloorsCalled);
        else this.addFloorsCalled(floor, this.lowerFloorsCalled);
    }

    this.moveNextFloor = function() {
        if (this.elevatorIsWorking()) {
            switch (this.direction) {
                case direction.DOWN:
                    this.currentFloor--;
                    break;
                case direction.UP:
                    this.currentFloor++;
                    break;
                case direction.NONE:
                    break;
                default:
                    break;
            }
        } else this.direction = direction.NONE;

    };
    this.reloadPeople = function() {
        this.removePeople();
        this.getPeople();
        this.checkDirection();

    };
    this.getPeople = function() {
        //check the capacity
        let peopleOnThisFloor = floors[this.currentFloor].people;
        for (let i = 0; i < peopleOnThisFloor.length; i++) {



            //*************************************************CHECAR A PRIMEIRA PESSOA
            //if (peopleOnThisFloor[i].waiting && (peopleOnThisFloor[i].direction() === this.direction
             //   || !this.elevatorIsWorking())) {
            if (peopleOnThisFloor[i].waiting) {
                peopleOnThisFloor[i].waiting = false;
                //adicionar a pessoa no elevador.
                this.people.push(peopleOnThisFloor[i]);
                if (peopleOnThisFloor[i].direction() === direction.UP) this.addFloorsCalled(floors[peopleOnThisFloor[i].destinationFloor], this.upperFloorsCalled);
                else this.addFloorsCalled(floors[peopleOnThisFloor[i].destinationFloor], this.lowerFloorsCalled);
                //retirar a pessoa do andar	removePerson?
                floors[this.currentFloor].removePerson(i);
                //peopleOnThisFloor.splice(i, 1);
                i--;
            }
        }
        this.removeCalledFloors();
    };
    this.removePeople = function() {
        for (let i = 0; i < this.people.length; i++) {
            let person = this.people[i];
            if (person.destinationFloor === this.currentFloor) {
                //moving the person to the floor.
                if (this.currentFloor > 0) {
                    floors[this.currentFloor].addPerson(person);
                }
                //removing person from the people array.
                this.people.splice(i, 1);
            }
        }
    };
    this.removeCalledFloors = function() {
        for (let i = 0; i < this.upperFloorsCalled.length; i++) {
            if (this.currentFloor == this.upperFloorsCalled[i].number) {
                this.upperFloorsCalled.splice(i, 1);
                i--;
            }

        }
        for (let i = 0; i < this.lowerFloorsCalled.length; i++) {
            if (this.currentFloor == this.lowerFloorsCalled[i].number) {
                this.lowerFloorsCalled.splice(i, 1);
                i--;
            }
        }
    };



    this.checkDirection = function() {
        if ((this.upperFloorsCalled.length === 0) && (this.lowerFloorsCalled.length > 0)) this.direction = direction.DOWN;
        else if ((this.lowerFloorsCalled.length === 0) && (this.upperFloorsCalled.length > 0)) this.direction = direction.UP;
        else this.direction = direction.NONE;

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
    ctx.restore();
}