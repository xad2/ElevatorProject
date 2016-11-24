/*jshint esversion: 6 */
/*globals drawPersonInTheFloor */
var floors = [];

for (let i = 0; i < 10; i++)
floors.push(new floor(i));


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
        let output = "";

        if (this.people.length === 0) {
            return "<p>There's no one on this floor!</p>";
        }
        output += "<p> <b>Displaying information of people at floor number " + this.number +" </b></p>";
        output += "||||||||||||||||||||||||||||||||" + "<br>";
        for (let i = 0; i < this.people.length; i++) {
            output += "<div>" + this.people[i].displayInfo() + "</div>";
        }

        return output;
    };
    return this;
}