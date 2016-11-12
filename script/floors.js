/*jshint esversion: 6 */
/*globals drawPerson */
var floors = [];

for (let i = 0; i < 10; i++)
	floors.push(new floor(i));


function floor(number) {
	this.number = number;
	this.people = [];
	this.called = false;
	this.addPerson = function(person){
		this.people.push(person);
		drawPerson(this.number, this.people.length);
	};
	this.removePerson = function(personIndex){
		this.people.splice(personIndex,1);
		drawPerson(this.number, this.people.length);
	};	
	return this;
}