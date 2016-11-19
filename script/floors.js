/*jshint esversion: 6 */
/*globals drawPersonInTheFloor */
var floors = [];

for (let i = 0; i < 10; i++)
floors.push(new floor(i));


let displayFloorInfo = function(){
    let floorInputted = document.getElementById("lookAtFloor").value;
    floors[floorInputted].displayInfo();
};


function floor(number) {
    this.number = number;
    this.people = [];
    this.called = false;
    this.addPerson = function(person) {
        this.people.push(person);
        drawPersonInTheFloor(this);
        //drawPerson(this.number, this.people.length);
    };
    this.removePerson = function(personIndex) {
        this.people.splice(personIndex, 1);
        drawPersonInTheFloor(this);
        //drawPerson(this.number, this.people.length);
    };

    this.displayInfo = function() {

       // let floorInputted = document.getElementById("lookAtFloor").value;
        let output = document.getElementById("infoPerson");
        output.innerHTML = "Showing information for floor number : " + this.number;
        for (let i = 0; i < this.people.length; i++) {
            output += this.people[i].displayInfo();
        }

    };

    return this;
}