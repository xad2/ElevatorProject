/*jshint esversion: 6 */
let randomValue = function(max) {
    return Math.round(Math.random() * max);
};

let isFloorValid = function(floorNum) {

    return floorNum >= 0 && floorNum <= 9;

};

let namesArray = ["Noah", "Katie", "Louie",
    "Descartes", "Slavoj", "Freud",
    "Lacan", "Neo", "Umberto",
    "Kant", "Hegel", "Marx",
    "Morris", "Socrates", "Plato",
    "Hayek", "Obama", "Trump",
    "Smith", "Engels", "Clinton",
    "Locke", "Bertrand", "Rousseau",
    "Voltaire", "Sawyer", "Einstein",
    "Pascal", "Schindler", "Ronaldinho",
    "Coraline", "Oneiro", "Aramis",
    "Thor", "Odin", "Freya",
    "Anubis", "Osiris", "Zeus",
    "Hercules", "Achilles", "Aphrodite",
    "Alexandre", "Ludwig", "Bacchus"]; //45

let commentsArray = ["My best elevator experience!",
    "I usually hate elevators, but this one was great!",
    "What!? Get off me. I'm late for work.",
    "I must say it wasn't fun at all.",
    "I shall drink the best of wines in memory of this great elevator!",
    "It was disgusting; why won't they shower?",
    "Life is just a dream so.. whatever.",
    "Excellent work. We are what we produce after all.",
    "This is yuuuge, I'll buy your company off and never ever pay taxes again!",
    "How dare you speak to the God of gods?",
    "Time is relative. So is my perception of this elevator.",
    "Where are all the monsters!? I shall slay them all!",
    "Once you get to know this elevator, you'll acquire absolute knowledge.",
    "The elevator-in-itself is essentially just a box that takes people in and out.",
    "I'm gonna bomb this elevator next time it stops before I get to where I want!"]; //15          

let namesCommentsArray = [];
let NameCommentsConstructor = function(name, commentary) {
    return {
        name: name,
        commentary: commentary
    };
};

let populateNamesCommentsArray = function() {

    //array for checking whether that name has been used.
    //true if used, false otherwise
    let parallelArray = [];

    for (let i = 0; i < namesArray.length; i++) {
        parallelArray[i] = false;
    }

    //get random name and random commentary
    let randomNameIndex = 0;
    let randomCommentIndex = 0;
    for (let i = 0; i < namesArray.length; i++) {

        do {
            randomNameIndex = randomValue(namesArray.length-1);
        } while (parallelArray[randomNameIndex])
        parallelArray[randomNameIndex] = true;

        randomCommentIndex = randomValue(commentsArray.length-1);
        let object = NameCommentsConstructor(namesArray[randomNameIndex], 
        commentsArray[randomCommentIndex]);
        namesCommentsArray.push(object);


    }


};