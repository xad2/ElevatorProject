/*jshint esversion: 6 */
/*globals drawPersonInTheFloor, ctx, document, coordinates*/



function floor(number, size, coord) {
	this.number = number;
	this.people = [];
	this.called = false;
	this.buttonCoordinate = undefined;
	this.buttonSize = undefined;
	this.size = size;
	this.coord = coord;

	this.addPerson = function (person) {
		this.people.push(person);
		this.drawPeopleInThisFloor();
		//drawPersonInTheFloor(this);
	};
	this.removePerson = function (personIndex) {
		this.people[personIndex].clear();
		this.people.splice(personIndex, 1);
		//drawPersonInTheFloor(this);
	};

	/**
	//Delete: é necessario ?
	this.removePerson = function () {
		this.people[this.people.length - 1].clear();
		this.people.splice(this.people.length - 1, 1);
	};
	*/

	this.isWithinFloorButton = function (x, y) {
		let butX = this.buttonCoordinate.x - this.buttonSize.width;
		return (x >= butX && x <= butX + this.buttonSize.width) && (y >= this.buttonCoordinate.y - this.buttonSize.height && y <= this.buttonCoordinate.y + this.buttonSize.height);
	};
	this.isWithinAddPersonButton = function (x, y) {
		let butX = this.buttonCoordinate.x - this.buttonSize.width - 50;
		return (x >= butX && x <= butX + this.buttonSize.width) && (y >= this.buttonCoordinate.y - this.buttonSize.height && y <= this.buttonCoordinate.y + this.buttonSize.height);
	};
	this.isWithinRemovePersonButton = function (x, y) {
		let butX = this.buttonCoordinate.x - this.buttonSize.width - 30;
		return (x >= butX && x <= butX + this.buttonSize.width) && (y >= this.buttonCoordinate.y - this.buttonSize.height && y <= this.buttonCoordinate.y + this.buttonSize.height);
	};


	this.drawButton = function () {
		//canvas.addEventListener("mouseover", this.mouseOver, false);
		let x = this.buttonCoordinate.x;
		let y = this.buttonCoordinate.y;
		ctx.fillText(number, x, y);
		ctx.moveTo(x + 5, y - 10);
		ctx.arc(x - 5, y - 6, 10, 0, Math.PI * 2);
	};

	this.displayInfo = function () {
		let output = "";
		if (this.people.length === 0) {
			return "<p>There's no one on this floor!</p>";
		}

		output += "<p> <b>Displaying information of people at floor number " + this.number + " </b></p>";
		output += "||||||||||||||||||||||||||||||||" + "<br>";
		for (let i = 0; i < this.people.length; i++) {
			output += "<img src=\"\"></img><br>" + this.people[i].displayInfo();
		}

		return output;
	};
	this.displayInfoOutside = function () {
		let output = document.getElementById("infoPerson");
		output.innerHTML = this.displayInfo();

		let imgs = output.getElementsByTagName("IMG");
		for (let i = 0; i < this.people.length; i++) {
			imgs[i].src = this.people[i].info.picture;
		}
	};

	this.drawPeopleInThisFloor = function () {
		let x = this.coord.x + this.size.width + 2;
		let y = this.coord.y + 5;
		for (let i = 0; i < this.people.length; i++) {
			if (i % 5 === 0 && i !== 0) {
				y += this.people[i].size.height; // start at the top
				x = this.coord.x + this.size.width + 2;
			}
			this.people[i].coord = new coordinates(x, y);
			this.people[i].draw();
			x += this.people[i].size.width - 5;
		}
	};

	return this;
}
