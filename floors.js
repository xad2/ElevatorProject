/*jshint esversion: 6 */
var floors = [];

for (let i = 0; i < 10; i++)
	floors.push(new floor(i));


function floor(number) {
	this.number = number;
	this.people = [];
	this.called = false;
	this.addPerson = function(person){
		this.people.push(person);
	};
	this.removePerson = function(person){
		//this.people.push(person);
	};	
	return this;
}