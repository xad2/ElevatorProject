/*jshint esversion: 6 */
/*globals drawPersonInTheFloor */



function floor(number) {
    this.number = number;
    this.people = [];
    this.called = false;
    this.buttonCoordinate = undefined;
    this.size = undefined;

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

    this.isWithinFloorButton = function(x, y) {
        
        let butX = this.buttonCoordinate.x - this.size.width;
        
        return (x >= butX && x <= butX + this.size.width) && (y >= this.buttonCoordinate.y - this.size.height && y <= this.buttonCoordinate.y + this.size.height);
    };
    this.isWithinAddPersonButton = function(x, y) {
        
        let butX = this.buttonCoordinate.x - this.size.width - 50;
        
        return (x >= butX && x <= butX + this.size.width) && (y >= this.buttonCoordinate.y - this.size.height && y <= this.buttonCoordinate.y + this.size.height);
    };
    this.isWithinRemovePersonButton = function(x, y) {
        
        let butX = this.buttonCoordinate.x - this.size.width - 30;
    
        return (x >= butX && x <= butX + this.size.width) && (y >= this.buttonCoordinate.y - this.size.height && y <= this.buttonCoordinate.y + this.size.height);
    };

  
    this.drawButton = function() {
        let x = this.buttonCoordinate.x;
        let y = this.buttonCoordinate.y;
        let canvas = document.getElementById("canvas");
        let ctx = canvas.getContext('2d');
        
        //canvas.addEventListener("mouseover", this.mouseOver, false);
        
        
        ctx.fillText(number, x, y);
        ctx.moveTo(x + 5, y - 10);
        ctx.arc(x - 5, y - 6, 10, 0, Math.PI * 2);

    };
    
    this.removePerson = function(){
        this.people.splice(this.people.length-1,1);
    };

    this.displayInfo = function() {
        let output = "";

        if (this.people.length === 0) {
            return "<p>There's no one on this floor!</p>";
        }
        output += "<p> <b>Displaying information of people at floor number " + this.number + " </b></p>";
        output += "||||||||||||||||||||||||||||||||" + "<br>";
        for (let i = 0; i < this.people.length; i++) {
            output += "<div>" + this.people[i].displayInfo() + "</div>";
        }

        return output;
    };
    
    this.displayInfoOutside = function(){
        
        let output = document.getElementById("div-info");
        
        output.innerHTML = this.displayInfo();
        
    };
    
    return this;
}