/*jshint esversion: 6 */
/*globals Building, addPersonFromFile */
let randomValue = function (max) {
	return Math.round(Math.random() * max);
};

let isValid = function (num, from, to) {
	return num >= from && num <= to;
};

let isFloorValid = function (floorQuantity) {
	return isValid(floorQuantity, 1, 50);
};

let isElevatorValid = function (elevatorQuantity) {
	return isValid(elevatorQuantity, 1, 15);
};

function loadFile() {
	let scene = document.getElementById('fileinput');
	var reader = new FileReader();
	reader.onload = function (e) {
		var output = e.target.result;
		output = output.split("\n");
		console.log(output);
		addPersonFromFile(output);
	};
	reader.readAsText(scene.files[0]);
}
