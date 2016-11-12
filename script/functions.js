/*jshint esversion: 6 */
let randomValue = function (max) {
	return Math.round(Math.random() * max);
};

let isFloorValid = function(floorNum){
    
    return floorNum >= 0 && floorNum <= 9;
    
};