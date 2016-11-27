/*jshint esversion: 6 */
/*globals document, floors, drawPersonInTheElevator, Statistics, console, setTimeout, Building, timer, HomerImage, coord */

var direction = {
    UP: 1,
    DOWN: -1,
    NONE: 0
};

function Elevator(capacity, number, elevatorSize, coord) {
    this.number = number;
    this.currentFloor = 0;
    this.capacity = capacity;
    this.direction = direction.NONE;
    this.people = [];
    this.calledFloors = [];
    this.stats = undefined;
    this.elevatorSize = elevatorSize;
    this.coord = coord;

    this.initStatistics = function() {
        this.stats = new Statistics();
        this.stats.initStatistics(this.currentFloor, 0);
    };


    this.addCalled = function(floor) {
        let floorCalled = false;
        for (let i = 0; i < this.calledFloors.length; i++) {
            floorCalled = (this.calledFloors[i].number === floor.number);
            if (floorCalled) break;
        }
        if (!floorCalled) this.calledFloors.push(floor);
    };

    function wasCalled() {
        return (this.calledFloors.length > 0) || (this.people.length > 0);
    }

    function moveNextFloor() {
        if (wasCalled.call(this)) {
            switch (this.direction) {
                case direction.DOWN:
                    if (this.currentFloor > 0) {
                        this.currentFloor--;
                        this.coord.y += 100;
                    }
                    break;
                case direction.UP:
                    if (this.currentFloor < Building.floors.length) {
                        this.currentFloor++;
                        this.coord.y -= 100;
                    }
                    break;
                case direction.NONE:
                    break;
                default:
                    break;
            }
            this.stats.incrementMovement();
        } else this.direction = direction.NONE;
    }

    function checkDirection() {
        let up = false;
        let down = false;
        for (let i = 0; i < this.calledFloors.length; i++) {
            if (this.calledFloors[i].number > this.currentFloor) up = true;
            if (this.calledFloors[i].number < this.currentFloor) down = true;
        }
        let peopleInThisFloor = Building.floors[this.currentFloor].people;
        for (let i = 0; i < peopleInThisFloor.length; i++) {
            if (peopleInThisFloor[i].waiting) {
                if (peopleInThisFloor[i].destinationFloor > this.currentFloor) up = true;
                if (peopleInThisFloor[i].destinationFloor < this.currentFloor) down = true;
            }
        }

        if (this.calledFloors.length === 0) this.direction = direction.NONE;
        if (((this.direction === direction.UP) || (this.direction === direction.NONE)) && (up)) this.direction = direction.UP;
        else if (((this.direction === direction.DOWN) || (this.direction === direction.NONE)) && (down)) this.direction = direction.DOWN;
        else this.direction = direction.NONE;

    }

    this.reloadPeople = function() {
        let peopleLeft = removePeople.call(this);
        let peopleEntered = getPeople.call(this);
        checkDirection.call(this);
        //this.stats.incrementMovement();
        if (peopleEntered || peopleLeft) this.stats.incrementNumOfStops();
    };

    function getPeople() {
        let peopleEntered = false;
        checkDirection.call(this);
        let peopleOnThisFloor = Building.floors[this.currentFloor].people;
        for (let i = 0; i < peopleOnThisFloor.length; i++) {
            //check the capacity
            if (this.people.length === this.capacity) break;
            if (peopleOnThisFloor[i].waiting && ((peopleOnThisFloor[i].direction() === this.direction) || (this.direction === direction.NONE))) {
                peopleOnThisFloor[i].waiting = false;

                //adicionar a pessoa no elevador.
                this.people.push(peopleOnThisFloor[i]);
                this.addCalled(Building.floors[peopleOnThisFloor[i].destinationFloor]);
                peopleOnThisFloor[i].initStatistics();

                //retirar a pessoa do andar	removePerson
                Building.floors[this.currentFloor].removePerson(i);
                i--;
                peopleEntered = true;
            }
        }
        removeCalledFloors.call(this);
        return peopleEntered;

    }

    function removePeople() {
        let peopleLeft = false;
        for (let i = 0; i < this.people.length; i++) {
            let person = this.people[i];
            person.stats.incrementMovement();
            if (person.destinationFloor === this.currentFloor) {
                person.currentFloor = this.currentFloor;
                //moving the person to the floor.
                if (this.currentFloor > 0) {
                    Building.floors[this.currentFloor].addPerson(person);
                }
                //removing person from the people array.
                this.people.splice(i, 1);
                i--;
                person.stats.incrementNumOfStops();
                //person.displayInfo();
                peopleLeft = true;
            }

        }
        return peopleLeft;

    }

    function removeCalledFloors() {
        let isAnyoneWaiting = false;
        for (let i = 0; i < Building.floors[this.currentFloor].people.length; i++) {
            if (Building.floors[this.currentFloor].people[i].waiting) {
                isAnyoneWaiting = true;
                break;
            }
        }
        if (!isAnyoneWaiting) {
            for (let i = 0; i < this.calledFloors.length; i++)
            if (this.currentFloor === this.calledFloors[i].number) this.calledFloors.splice(i, 1);
        }

    }
    this.sameDirection = function(floorCalled, destinationFloor) {
        return ((this.direction === direction.UP && (this.currentFloor < floorCalled) && (this.currentFloor > destinationFloor)) || (this.direction === direction.DOWN && (this.currentFloor > floorCalled) && (this.currentFloor < destinationFloor)) || (this.direction === direction.NONE));
    };

    let previousFloor;
    this.isMoving = false;
    this.move = function() {
        console.log(" Elevator " + this.number + ": current floor - " + this.currentFloor + " people - " + this.people.length);
        this.draw(previousFloor);
        /*create a new function */
        if (wasCalled.call(this)) {
            this.isMoving = true;
            previousFloor = this.currentFloor;
            this.reloadPeople();
            moveNextFloor.call(this);
            //setTimeout(Building.Elevator.move, timer);
            setTimeout(this.move.bind(this), timer);
        } else {
            this.isMoving = false;
            this.stats.finalPos = this.currentFloor;

            let infoElevator = document.getElementById("infoElevator");
            this.stats.displayResults(infoElevator);
        }
        this.draw(previousFloor);
    };


    this.draw = function(previousFloor = 0) {
        let canvas = document.getElementById("canvas");
        let ctx = canvas.getContext("2d");
        ctx.save();
        ctx.beginPath();
        ctx.clearRect(132 + (100 * this.number), 12 + (100 * (Building.floors.length - 1 - previousFloor)), 76, 95);
        ctx.fillStyle = "blue";
        ctx.fillRect(132 + (100 * this.number), 12 + (100 * (Building.floors.length - 1 - this.currentFloor)), 76, 95);
        this.drawPersonInTheElevator();
        ctx.restore();
    };

    this.drawPersonInTheElevator = function() {
        
        let x = this.coord.x + 10;
        let y = this.coord.y + 5;
        for (let i = 0; i < this.people.length; i++) {
            if (i % 5 === 0 && i !== 0) {
                y += this.people[i].size.height; // start at the top
                x = this.coord.x + 10;
            }
            this.people[i].coord.x = x;
            this.people[i].coord.y = y;
            
            this.people[i].draw();

            x += this.people[i].size.width - 5;

        }


    };

}