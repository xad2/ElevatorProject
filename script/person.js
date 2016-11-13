/*jshint esversion: 6 */
/*globals direction */
function person(name, currentFloor, destinationFloor) {
    this.name = name;
    this.currentFloor = currentFloor;
    this.destinationFloor = destinationFloor;
    this.waiting = true;
    this.direction = function() {
        if (this.currentFloor > this.destinationFloor) {
            return direction.DOWN;
        } else {
            return direction.UP;
        }
    };
}


function drawPerson(floorNumber, amountOfPeople) {
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");

    ctx.clearRect(405, 530 - (floorNumber * 55), 60, 15);
    for(let i = 0; i<amountOfPeople;i++)
       ctx.fillRect(460-(i*8), 530 - (floorNumber * 55), 5, 15);
}