/*jshint esversion: 6 */

function Statistics(originalPos){
    
    this.originalPos = originalPos;
    this.finalPos = 0;
    this.numberOfStops = 0;
    this.totalMovement = 0;
    this.incrementMovement = function(){
        this.totalMovement++;
    };
    this.incrementNumOfStops = function(){
        this.numberOfStops++;
    };
    this.setFinalPos = function(finalPos){
        this.finalPos = finalPos;
    };
    //stopTime: average time for elevator staying in a floor in secs
    //intervalTime: average time it takes to go from 1 floor to the next in sec
    this.calculateTimePassed = function(stopTime, intervalTime){
        
        return (stopTime * this.numberOfStops) + (this.totalMovement * intervalTime );
        
    };
    
    this.displayResults = function(name){
        
        console.log("||||||||||||||||||||||||||||||||");
        console.log("Showing statistics for " + name);
        console.log("Original position: " + this.originalPos);
        console.log("Final position: " + this.finalPos);
        console.log("Number of stops: " + this.numberOfStops);
        console.log("Total time passed: " + this.calculateTimePassed(7,2));
        console.log("||||||||||||||||||||||||||||||||");
    }; 
    return this;
}