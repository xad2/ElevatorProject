/*jshint esversion: 6 */
/*globals randomValue */
let usedNamesArray = [];

let namesArray = ["Noah", "Katie", "Louie",
    "Descartes", "Slavoj", "Freud",
    "Lacan", "Neo", "Umberto",
    "Kant", "Hegel", "Marx",
    "Morris", "Socrates", "Plato",
    "Hayek", "Obama", "Trump",
    "Putin", "Nietzsche", "Clinton",
    "Locke", "Bertrand", "Rousseau",
    "Voltaire", "Sawyer", "Einstein",
    "Pascal", "Schindler", "Sartre",
    "Coraline", "Camus", "Chomsky",
    "Thor", "Odin", "Freya",
    "Carlin", "Osiris", "Zeus",
    "Foucault", "Achilles", "Aphrodite",
    "Alexandre", "Ludwig", "Napoleon"]; //45

let picturesArray = [];

for (let i = 0; i < namesArray.length; i++) {
	usedNamesArray[i] = false;
	picturesArray.push("images/" + namesArray[i] + ".jpg");
}

let commentsArray = ["My best elevator experience!",
    "I usually hate elevators, but this one was great!",
    "Who needs a church when we got this astounding elevator!?",
    "What!? Get off me. I'm late for work.",
    "I must say it wasn't fun at all.",
    "I shall drink the best of wines in memory of this great elevator!",
    "It was disgusting; why won't people shower?",
    "Life is just a dream so.. whatever.",
    "Excellent work. We are what we produce after all.",
    "This is yuuuge, I'll buy your company off and never ever pay taxes again!",
    "How dare you speak to the God of gods?",
    "Time is relative. So is my perception of this elevator.",
    "Where are all the monsters!? I shall slay them all!",
    "Once you get to know this elevator, you'll acquire absolute knowledge.",
    "The elevator-in-itself is essentially just a box that takes people in and out.",
    "I'm gonna bomb this elevator next time it stops before I get to where I want!",
    "The whole of existence is an absurd. At least I enjoyed my time whilst in this elevator."]; //15          

let infoArray = [];
let InfoConstructor = function (name, commentary, picture) {
	return {
		name: name,
		commentary: commentary,
		picture: picture
	};
};

let populateInfoArray = function () {

	//array for checking whether that name has been used.
	//true if used, false otherwise
	//get random name and random commentary
	let namePicIndex = 0;
	let randomCommentIndex = 0;

	for (let i = 0; i < namesArray.length; i++) {
		namePicIndex = i;
		randomCommentIndex = randomValue(commentsArray.length - 1);

		let infoObject  = InfoConstructor(namesArray[namePicIndex],
			commentsArray[randomCommentIndex], picturesArray[namePicIndex]);
		infoArray.push(infoObject);
	}
};
