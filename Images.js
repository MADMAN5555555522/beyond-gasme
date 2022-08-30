var Images = {
	grass: './assets/grass1.png',
	stone: './assets/stone dark.png',
	fireParticle: './assets/fire particle.png',
	fireSpellBook: './assets/fire spell book.png',
	Gorack: './assets/gorack.png',
	Ghost: './assets/ghost.png',
    TestHead: './assets/testhead.png',
    TestBody: './assets/test body.png',
    test: './assets/test.png',
    test: './assets/test.png',
    test: './assets/1665546678476.png',







};

// generate images object
for(var image in Images){
	var src = Images[image];
	Images[image] = new Image();
	Images[image].src = src;
}