/*jshint esversion: 6 */
/*globals Building, addPersonFromFile */
let randomValue = function (max) {
	return Math.round(Math.random() * max);
};

let isFloorValid = function (floorNum) {

    return floorNum >= 0 && floorNum <= Building.floors.length-1;

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
