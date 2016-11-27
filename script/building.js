/*jshint esversion: 6 */
/*globals document, Image, console, randomValue, floors, drawElevator, person, Elevator, setTimeout, isFloorValid, Statistics, populateInfoArray, infoArray, floor, usedNamesArray */
/// <reference path="elevator.js" />
/// <reference path="floors.js" />
/// <reference path="functions.js" />
/// <reference path="person.js" />


const timer = 800;
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
var coord = function(x, y) {
    return {
        x: x,
        y: y
    };
};

let size = function(width, height) {
    return {
        width: width,
        height: height
    };
};

var BuildImage = new Image();
BuildImage.src = "images/Building.jpg";
var HomerImage = new Image();
HomerImage.src = "images/Homer.png";

var Building;

function building(amountOfFloors, amountOfElevators, elevatorCapacity) {
    

    setCanvasMeasurements(amountOfFloors, amountOfElevators); // need to set first in order to update variables.
    let buildingTop = 10;
    let buildingBottom = function() {
        return canvas.height - 30;
    };
    
    let firstFloorY = function(){
        return (canvas.height - 100);
    };
    let spacesBetweenElevators = 20*(amountOfElevators-1);
    
    this.floors = [];
    for (let i = 0; i < amountOfFloors; i++) {
        this.floors.push(new floor(i));
        this.floors[i].size = new size(80*amountOfElevators + spacesBetweenElevators , 100*amountOfElevators);
        this.floors[i].coord = new coord(130, firstFloorY() - (i * 100));
    }

    
    let floorSize = (buildingBottom()) / this.floors.length;

    this.elevators = [];
    for (let i = 0; i < amountOfElevators; i++)
    this.elevators.push(new Elevator(elevatorCapacity, i, floorSize - 4, coord((120 + (100 * i) + 1), firstFloorY() + 12 )));
    
    this.callElevator = function(floor, destinationFloor) {
        //closerElevator Sort

        var sameDirection = [];
        for (let i = 0; i < this.elevators.length; i++) {
            if (this.elevators[i].sameDirection(floor.number, destinationFloor)) sameDirection.push(this.elevators[i]);
        }
        var index = 0;
        if (sameDirection.length > 0) index = sameDirection[0].number;


        this.elevators[index].addCalled(floor);
        if (!this.elevators[index].isMoving) {
            this.elevators[index].initStatistics();
            this.elevators[index].move();
        }
    };

    this.drawBuilding = function() {
        let elevatorsAmount = this.elevators.length;
        let initialSpace = 100;

        //ctx.drawImage(BuildImage, 400, 20, 100, 100);
        ctx.beginPath();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.rect(initialSpace, buildingTop, 200 + (elevatorsAmount - 1) * 100, (100 * this.floors.length));

        for (let i = 0; i < this.elevators.length; i++) {
            for (let j = 0; j < this.floors.length; j++) {
                let x = 130 + (100 * i);
                let y = buildingTop + (j * 100);
                let width = 80;
                let height = 100;
                ctx.rect(x, y,width, height);
            }
        }

        this.drawFloorButtons();
        ctx.stroke();

        for (let i = 0; i < amountOfElevators; i++)
        Building.elevators[i].draw();
    };

    this.drawFloorButtons = function() {

        ctx.font = "18px Arial";
        ctx.textAlign = "end";
        let x = 120;
        let y = buildingBottom();
        for (let i = 0; i < this.floors.length; i++) {
            this.floors[i].buttonCoordinate = coord(x, y);
            this.floors[i].buttonSize = size(30, 30);
            this.floors[i].drawButton();
            this.drawAddRemovePersonButton(x, y);
            y -= 100;
        }


    };

    this.drawAddRemovePersonButton = function(x, y) {
        ctx.fillStyle = "green";
        ctx.fillText("+", x - 70, y);
        ctx.fillStyle = "red";
        ctx.fillText("-", x - 40, y);
        ctx.fillStyle = "black";
    };
}


function addEventListeners() {

    canvas.addEventListener("click", function(event) {

        let floors = Building.floors;
        for (let i = 0; i < floors.length; i++) {
            if (floors[i].isWithinFloorButton(event.offsetX, event.offsetY)) {
                event.preventDefault();
                event.stopPropagation();
                floors[i].displayInfoOutside();
                break;
            } else if (floors[i].isWithinAddPersonButton(event.offsetX, event.offsetY)) {
                event.preventDefault();
                event.stopPropagation();
                let currentFloor = i;
                let destFloor = 0;
                do {
                    destFloor = randomValue(floors.length - 1);
                } while (currentFloor === destFloor);
                addPerson(currentFloor, destFloor);
                break;
            } else if (floors[i].isWithinRemovePersonButton(event.offsetX, event.offsetY)) {
                event.preventDefault();
                event.stopPropagation();
                floors[i].removePerson();
                break;

            }
        }

    },
    false);
}


function addPerson(currentFloor, destinationFloor) {
    if (!isNaN(currentFloor) && currentFloor !== "" && !isNaN(destinationFloor) && destinationFloor !== "") {
        currentFloor = Number(currentFloor);
        destinationFloor = Number(destinationFloor);
        if (isFloorValid(currentFloor) && isFloorValid(destinationFloor)) {

            
            let random = 0;
            do {
                random = randomValue(infoArray.length - 1);

            } while (usedNamesArray[random]);
            usedNamesArray[random] = true;
            let info = infoArray[random];

            let newPerson = new person(info, currentFloor, destinationFloor);
            newPerson.stats = new Statistics(currentFloor);
            newPerson.size = new size(HomerImage.width, HomerImage.height);
            
            Building.floors[currentFloor].addPerson(newPerson);
            Building.callElevator(Building.floors[currentFloor], destinationFloor);
        }
    }
}

function addPersonFromFile(arrPeople) {
    for (let i = 0; i < arrPeople.length; i++) {
        let currentFloor = Number(arrPeople[i].split(",")[0]);
        let destinationFloor = Number(arrPeople[i].split(",")[1]);
        addPerson(currentFloor, destinationFloor);
    }
}

function removePerson() {
    let currentFloor = document.getElementById("currentFloor").value;
    let destinationFloor = document.getElementById("floorOut").value;

    if (!isNaN(currentFloor) && currentFloor !== "" && !isNaN(destinationFloor) && destinationFloor !== "") {

        currentFloor = Number(currentFloor);
        destinationFloor = Number(destinationFloor);

        if (isFloorValid(currentFloor) && isFloorValid(destinationFloor)) {

            if (Building.floors[currentFloor].people.length >= 0) {
                Building.floors[currentFloor].people[0].destinationFloor = destinationFloor;
                Building.floors[currentFloor].people[0].waiting = true;
                Building.callElevator(floors[currentFloor], destinationFloor);
            }
        }
    }
}



function addRandomPerson() {
    let currentFloor = 0;
    let destinationFloor = 0;
    while (currentFloor === destinationFloor) {
        currentFloor = randomValue(Building.floors.length - 1);
        destinationFloor = randomValue(Building.floors.length - 1);
    }
    addPerson(currentFloor, destinationFloor);
}

function setup() {
    Building = new building(8, 2, 10);
    Building.drawBuilding();
    addEventListeners();
    populateInfoArray();

}

function displayFloorInfo() {
    let floorInfo = document.getElementById("floorInfo");
    let value = floorInfo.value;
    let output = document.getElementById("infoPerson");
    output.innerHTML = Building.floors[value].displayInfo();
    
}

function setCanvasMeasurements(floorsAmount, elevatorsAmount) {

    canvas.height = floorsAmount * 100 + 10;
    canvas.width += 100 * elevatorsAmount; //width for 1 elev: 100
}



function test() {

}
//test();
setup();