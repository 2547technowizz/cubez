var players = [];       //stores player objects
var superballs = [];    //store superball object
var structureSet = 0;   //used to load levels
var buttonSet;          //used to load buttons
var roundNum = 1;       //round rumber
var maxRounds = 3;      //not used
var startOfRoundTimer;      //start of game timer
var roundLength = 11000;        //border timer length
var font;       //used to store the current font             
var startOfCounter;         //used for border countdown
var timerLength = 3000;     //lenght of countdown at start of round
var timerEnd = false;       //used for timer for borders
var counting = false;       //used for countdown at the beginning of each round
var killed = false;         //not used
var startOfKill = false;    //not used
var stopWalls = false;      //not used
var screen;         //to keep track of the current screen and the switch screens
var superball;      //not used
var closingWallLength = 40000;
var caution;            //pictures
var highVoltage;
var metalSheet;
var metalSheetTop;
var steelBox;
var floorLines;
var crown;
var plusOne;
var bridge;
var rope;
var keyboard;
var firstPlace, secondPlace;
var p2ScoreOffsetX = 0;         //just for visual purposes
var level1, level2, level3, level4, level5;     //stores the level data
var lava = [];      //not used
var bgColour;       //background colour

function preload() {
    caution = loadImage('assets/caution.png');      //loads pictures
    highVoltage = loadImage('assets/highVoltage.png');
    metalSheet = loadImage('assets/metalSheet.png');
    metalSheetTop = loadImage('assets/metalSheet_top.png');
    steelBox = loadImage('assets/steelBox.png');
    floorLines = loadImage('assets/floorLines.png');
    crown = loadImage('assets/crown.png');
    plusOne = loadImage('assets/plusOne.png');
    bridge = loadImage('assets/bridge.png');
    rope = loadImage('assets/rope.png');
    keyboard = loadImage('assets/keyboard.png');
    firstPlace = loadImage('assets/firstPlace.png');
    secondPlace = loadImage('assets/secondPlace.png');
    if (UrlExists('levels/level1.json')) {
        level1 = loadJSON('levels/level1.json');
        console.log('loaded level 1');
    }
    if (UrlExists('levels/level2.json')) {          //loads levels if file is there
        level2 = loadJSON('levels/level2.json');
        console.log('loaded level 2');
    }
    if (UrlExists('levels/level3.json')) {
        level3 = loadJSON('levels/level3.json');
        console.log('loaded level 3');
    }
    if (UrlExists('levels/level4.json')) {
        level4 = loadJSON('levels/level4.json');
        console.log('loaded level 4');
    }
    if (UrlExists('levels/level5.json')) {
        level5 = loadJSON('levels/level5.json');
        console.log('loaded level 5');
    }
}

function UrlExists(url) {           //function to check if a file exists
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status!=404;
}

function setup() {
    document.title = "Cubez";
    createCanvas(1000, 500);
    frameRate(60);
    angleMode(DEGREES);
    players[0] = new Player(100, 50, 225, 0, 0); //creates player objects
    players[1] = new Player(880, 50, 0, 0, 225);
    
//    for (i = 0; i < 100; i ++) {
//        lava[i] = new Lava(random(300, 700), 400, 0, -15/* + random(-2, 2)*/);
//    }
    
    screen = "mainMenu"; //sets screen to the main menu
    bgColour = color(50); //sets background colour
    
}

function draw() {
    scale(1, 1);
    background(bgColour);
    
    if (screen === "mainMenu") {
        mainMenu();
    } else if (screen === "play") {
        mainGame();
    } else if (screen === "controls") {
        controlsMenu();
    } else if (screen === "endGame") {
        endGame();
    } else if (screen === "editor") {
        levelEditor();
    }
}

function reset() {          //function used to reset values after every round
    timerEnd = false;
	killed = false;
	startOfKill = false;
    cameraOffsetX = 0;
    cameraOffsetY = 0;
    players.splice(0, players.length);
    players[0] = new Player(100, 50, 225, 0, 0);
    players[1] = new Player(880, 50, 0, 0, 225);
    
    for (i = 0; i < players.length; i++) {
        if (snowballs[i].length > 0) {
            snowballs[i].splice(0, snowballs[i].length);
        }
    }
    
    walls.splice(0, walls.length);
    superballs.splice(0, superballs.length);
    structures.splice(0, structures.length);
    textures.splice(0, textures.length);
    breakables.splice(0, breakables.length);
    backgrounds.splice(0, backgrounds.length);
    
    loadStructures(structureSet);
    
    stopWalls = false;
}

function nextRound() {      //function used after each round
    reset();
    roundNum++;
    if (random(0, 100) < 20) {
        superballs[superballs.length] = new SuperBall(500 - 15, 150, 30, 1, 90);
    }
    roundTimer();
}

function roundTimer() {
    counting = true;
    startOfCounter = millis();
}

function mainGame() {
    
//    for (i = 0; i < lava.length; i++) {
//        lava[i].update();
//        lava[i].draw();
//    }
    
    if (score[0] >= maxPoints || score[1] >= maxPoints) {           //check if someone won the game
        resetGame();
        loadEndGame();
        bgColour = color(50);
        screen = "endGame";     //if so set the screen to the end game screen
    }
    
    var timerOffset = 0;
    if (counting === false && killed === false) {       //update players and border coundown timer 
        players[0].update();
        players[1].update();
        if (superballs.length > 0) {
            superballs[0].update();
        }
        noStroke();
        textSize(17);
        if (Math.floor((roundLength - (millis() - startOfRoundTimer))/1000) > 0) {
            if (Math.floor((roundLength - (millis() - startOfRoundTimer))/1000) <= 9){
                timerOffset = 5;
            } else {
                timerOffset = 0;
            }
            fill(255);
            text(Math.floor((roundLength - (millis() - startOfRoundTimer))/1000), width/2 - 10 + timerOffset, 50);
        } else {
            fill(255, 0, 0);
            text("0", width/2 - 5, 50);
            timerEnd = true;
        }
    }
    
    if (players[0].y > width + 50) {        //if player falls of the map
        score[1]++;
        nextRound();
    } else if (players[1].y > width + 50) {
        score[0]++;
        nextRound();
    }
    
    
    for (i = 0; i < players.length; i++) {      //checks if player intersets a structure
        for (j = 0; j < structures.length; j++) {
            players[i].intersects(structures[j]);
        }
    }
    
    for (i = 0; i < players.length; i++) {      //checks if player intersets a breackable
        for (j = 0; j < breakables.length; j++) {
            players[i].intersects(breakables[j]);
        }
    }
    
    for (i = 0; i < breakables.length; i++) {       //checks if breakable intersects a structure
        for (j = 0; j < structures.length; j++) {
            breakables[i].intersects(structures[j]);
        }
    }

    for (k = structures.length - 1; k >= 0; k--) {      //checks if snowball intersects a structure
        if (snowballs.length > 0) {
            for (j = snowballs.length - 1; j >= 0; j--) {
                if (snowballs[j].length > 0) {
                    for (i = snowballs[j].length - 1; i >= 0 ; i--) {
                        snowballs[j][i].intersects(structures[k], j, i);
                    }
                }
            }
        }
    }
    
    if (breakables.length > 0) {                            //checks if snowball intersects a breakable
        for (f = breakables.length - 1; f >= 0; f--) {    
            if (snowballs.length > 0) {
                for (g = snowballs.length - 1; g >= 0; g--) {
                    if (snowballs[g].length > 0) {
                        for (h = snowballs[g].length -1; h >= 0; h--) {
                            snowballs[g][h].breaks(breakables[f], f, g, h);
                        }
                    }
                }
            }
        }
    }
    
    for (p = 0; p < players.length; p++) {          //check if snowball hits a player
        if (snowballs.length > 0) {
            for (j = 0; j < snowballs.length; j++) {
                if (snowballs[j].length > 0) {
                    for (i = 0; i < snowballs[j].length; i++) {
                        snowballs[j][i].hits(p, j, i);
                    }
                }
            }
        }
    }
    
    if (superballs.length > 0) {                            //check if snowball hits a superball
        for (p = 0; p < superballs.length; p++) {    
            if (snowballs.length > 0) {
                for (j = 0; j < snowballs.length; j++) {
                    if (snowballs[j].length > 0) {
                        for (i = 0; i < snowballs[j].length; i++) {
                            snowballs[j][i].hitsSpecialBall(p, j, i);
                        }
                    }
                }
            }
        }
    }
    
    if (breakables.length > 0) {                    //updates the breakable objects
        for (i = 0; i < breakables.length; i++) {
            breakables[i].update();
        }
    }
    
    if (snowballs.length > 0 && killed === false) {         //updates the snowball objects
        for (j = 0; j < snowballs.length; j++) {
            if (snowballs[j].length > 0) {
                for (i = 0; i < snowballs[j].length; i++) {
                    snowballs[j][i].update();
                }
            }
        }
    }
    
    if (timerEnd === true && walls.length > 0) {        //updates the border objects of timer reaches 0
        for (f = 0; f < walls.length; f++) {
            walls[f].update();
        }
        
        for (g = 0; g < walls.length; g++) {        //check if player hits walls
            players[0].hitsWall(walls[g], 0);
            players[1].hitsWall(walls[g], 1);
        }
    }
    
    
    
    if (backgrounds.length > 0) {                       //drawing objects
        for (i = 0; i < backgrounds.length; i++) {
            backgrounds[i].draw();
        }
    }
        
    players[0].draw();                  //drawing objects
    players[1].draw();                  //drawing objects
    players[0].reloadTimer();           //update reload timer
    players[1].reloadTimer();           //update relaod timer
    
    if (snowballs.length > 0) {                  //drawing objects
        for (j = 0; j < snowballs.length; j++) {
            if (snowballs[j].length > 0) {
                for (i = 0; i < snowballs[j].length; i++) {
                    snowballs[j][i].draw();
                }
            }
        }
    }
    
    if (breakables.length > 0) {                  //drawing objects
        for (i = 0; i < breakables.length; i++) {
            breakables[i].draw();
        }
    }
    
    for (i = 0; i < structures.length; i++) {                  //drawing objects
        structures[i].draw();
    }
    
    if (textures.length > 0) {                  //drawing objects
        for (i = 0; i < textures.length; i++) {
            textures[i].draw();
        }
    }
    
    if (superballs.length > 0) {                  //drawing objects
        superballs[0].draw();
    }
    
    if (timerEnd === true && walls.length > 0) {                  //drawing objectss
        for (i = 0; i < walls.length; i++) {
            walls[i].draw();
        }
    }
    
    if (counting) {                                         //beginning of round timer
        if (millis() >= startOfCounter + timerLength) {
            counting = false;
            startOfRoundTimer = millis();
        } else {
            noStroke();
            fill(225, 0, 0);
            textSize(90);
            text(Math.floor((startOfCounter - millis() + 4000)/1000), width/2 - 27, 110);
        }
    }
    
    noStroke();
    fill(180);
    textSize(32);
    if (players[0].specialIsActive) {
        text(players[0].specialMaxSnowballs - players[0].snowballCount, 10, 90);                //draws the HUD
    } else {
        text(players[0].maxSnowballs - players[0].snowballCount, 10, 90);
    }
    if (players[1].specialIsActive) {
        text(players[1].specialMaxSnowballs - players[1].snowballCount, width - 30, 90);
    } else {
        text(players[1].maxSnowballs - players[1].snowballCount, width - 30, 90);
    }
    if (score[1] >= 10) {
        p2ScoreOffsetX = 22;
    } else {
        p2ScoreOffsetX = 0;
    }
    textSize(50);
    fill(255);
    text(score[0], 10, 50);
    text(score[1], width - 37 - p2ScoreOffsetX, 50);
    
    if (players[0].specialIsActive) {               //draws HUD if player has a power-up
        for (i = 0; i <= (players[0].specialMaxJumps - players[0].jumpNum - 1); i++) {    
            fill(255);
            ellipse(15 + (i * 10), 100, 5, 5);
        }
    } else {
        for (j = 0; j <= (players[0].maxJumps - players[0].jumpNum - 1); j++) {    
            fill(255);
            ellipse(15 + (j * 10), 100, 5, 5);
        }
    }
    
    if (players[1].specialIsActive) {
        for (k = 0; k <= (players[1].specialMaxJumps - players[1].jumpNum - 1); k++) {    
            fill(255);
            ellipse(width - 15 - (k * 10), 100, 5, 5);
        }
    } else {
        for (l = 0; l <= (players[1].maxJumps - players[1].jumpNum - 1); l++) {    
            fill(255);
            ellipse(width - 15 - (l * 10), 100, 5, 5);
        }
    }
    
    textSize(25);
    fill(255);
    text("Round " + roundNum, width/2 - 43, 30);        //draws round number
    
}

function mainMenu() {
    buttonSet = 0;
    loadButtons(buttonSet); //loads buttons
    
    textSize(70);
    fill(255);
    text("Cubez", 400, 100);
    
    for (j = 0; j < buttons.length; j++) {      //updates buttons
        buttons[j].update();
    }
    
    for (i = 0; i < buttons.length; i++) {      //draws buttons
        buttons[i].draw();
    }
}

function levelEditor() {                            //NOT USED
    for(i = 0; i < backgrounds.length; i++) {
        backgrounds[i].draw();
    }
    
    for(i = 0; i < editorObjs.length; i++) {
        editorObjs[i].draw();
    }
    for(i = 0; i < editorObjs.length; i++) {
        editorObjs[i].update();
    }
}

function controlsMenu() {       //draws controls menu
    buttonSet = 1;
    loadButtons(buttonSet);
    
    image(keyboard, 37, 70, 926, 322);
    
    textSize(40);
    fill(255, 0, 0);
    text("Player 1", 150, 50);
    fill(0, 0, 255);
    text("Player 2", 700, 50);
    fill(255);
    textSize(25);
    text("Move:", 140, 420);
    text("Move:", 690, 420);
    text("Shoot:", 140, 450);
    text("Shoot:", 690, 450);
    text("Reload:", 140, 480);
    text("Reload:", 690, 480);
    fill(180);
    text("WASD", 220, 420);
    text("IJKL", 770, 420);
    text("V", 230, 450);
    text("P", 780, 450);
    text("C", 240, 480);
    text("[", 790, 478);
    
    for (j = 0; j < buttons.length; j++) {
        buttons[j].update();
    }
    
    for (i = 0; i < buttons.length; i++) {
        buttons[i].draw();
    }
}

function endGame() {                //endgame is very similar to the main game but the difference is that you cannot shoot and no HUD is displayed
    buttonSet = 2;
    loadButtons(buttonSet);
    strokeWeight(2);
//    stroke(0);
    
    for (j = 0; j < buttons.length; j++) {
        buttons[j].update();
    }
    
    players[0].update();
    players[1].update();
    
    for (i = 0; i < players.length; i++) {
        for (j = 0; j < structures.length; j++) {
            players[i].intersects(structures[j]);
        }
    }
    
    if (snowballs.length > 0 && killed === false) {
        for (j = 0; j < snowballs.length; j++) {
            if (snowballs[j].length > 0) {
                for (i = 0; i < snowballs[j].length; i++) {
                    snowballs[j][i].update();
                }
            }
        }
    }
    
    if (backgrounds.length > 0) {
        for (i = 0; i < backgrounds.length; i++) {
            backgrounds[i].draw();
        }
    }
    
    players[0].draw();
    players[1].draw();
    
    if (snowballs.length > 0) {
        for (j = 0; j < snowballs.length; j++) {
            if (snowballs[j].length > 0) {
                for (i = 0; i < snowballs[j].length; i++) {
                    snowballs[j][i].draw();
                }
            }
        }
    }
    
    for (i = 0; i < structures.length; i++) {
        structures[i].draw();
    }
    
    if (textures.length > 0) {
        for (i = 0; i < textures.length; i++) {
            textures[i].draw();
        }
    }
    
    for (i = 0; i < buttons.length; i++) {
        buttons[i].draw();
    }
    
    textSize(45);
    if (score[0] > score[1]) {
        fill(255, 0, 0);
        text("Player 1", 425, 50);
    } else {
        fill(0, 0, 255);
        text("Player 2", 425, 50);
    }
    textSize(40);
    fill(225);
    text("Wins!", 450, 100);
}

function resetGame() {  //function used when starting a new game
    timerEnd = false;
    killed = false;
    counting = false;
    startOfKill = false;
    cameraOffsetX = 0;
    cameraOffsetY = 0;
    roundNum = 1;
    players.splice(0, players.length);
    players[0] = new Player(100, 50, 225, 0, 0);
    players[1] = new Player(880, 50, 0, 0, 225);

    for (i = 0; i < players.length; i++) {
        if (snowballs[i].length > 0) {
            snowballs[i].splice(0, snowballs[i].length);
        }
    }

    walls.splice(0, walls.length);
    superballs.splice(0, superballs.length);
    structures.splice(0, structures.length);
    textures.splice(0, textures.length);
    breakables.splice(0, breakables.length);
    backgrounds.splice(0, backgrounds.length);
    stopWalls = false;
}

function loadEndGame() {            //loads all the endgame objects
    if (score[0] > score[1]) {
        players[0].crowned = true;
        players[0].x = 390;
        players[0].y = 150;
        players[1].x = 590;
        players[1].y = 220;
    } else {
        players[1].crowned = true;
        players[1].x = 390;
        players[1].y = 150;
        players[0].x = 590;
        players[0].y = 220;
    }
    
    structures[structures.length] = new Rectangle (0, height - 100, width, 50, color(0, 255, 0));
    structures[structures.length] = new Rectangle (-50, -50, 50, height, color(100, 255, 0));
    structures[structures.length] = new Rectangle (width, -50, 50, height, color(100, 255, 0));
    structures[structures.length] = new Rectangle (350, 250, 100, 10, color(255, 215, 0));
    backgrounds[backgrounds.length] = new BackgroundRect (350, 250, 100, 150, color(218, 165, 32));
    structures[structures.length] = new Rectangle (550, 320, 100, 10, color(192));
    backgrounds[backgrounds.length] = new BackgroundRect (550, 320, 100, 80, color(128));
    backgrounds[backgrounds.length] = new ImageData (firstPlace, 363, 270, 75, 75);
    backgrounds[backgrounds.length] = new ImageData (secondPlace, 575, 335, 50, 50);
}
