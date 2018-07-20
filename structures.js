var structures = [];
var breakables = [];
var backgrounds = [];
var textures = [];
var walls = [];
var level;
var texture;

function analyzeTexture(txtr) {
    if (txtr == "floorLines") {
        texture = floorLines;
    } else if (txtr == "metalSheet") {
        texture = metalSheet;
    } else if (txtr == "metalSheetTop") {
        texture = metalSheetTop;
    } else if (txtr == "caution") {
        texture = caution;
    } else if (txtr == "steelBox") {
        texture = steelBox;
    } else if (txtr == "bridge") {
        texture = bridge;
    } else if (txtr == "rope") {
        texture = rope;
    } else {
        texture = null;
    }
}

function loadFromJSON(json) {
    players[0].x = json.spawnLoc[0][0];
    players[0].y = json.spawnLoc[0][1];
    players[1].x = json.spawnLoc[1][0];
    players[1].y = json.spawnLoc[1][1];

    var structure = json.structures;
    if (structure.length > 0) {
        for (i = 0; i < structure.length; i++) {
            analyzeTexture(structure[i][7]);
            structures[structures.length] = new Rectangle(structure[i][0], structure[i][1], structure[i][2], structure[i][3], color(structure[i][4], structure[i][5], structure[i][6]), texture);
        }
    }

    var brkeable = json.breakables;
    if (brkeable.length > 0) {
        for (l = 0; l < brkeable.length; l++) {
            analyzeTexture(brkeable[l][9]);
            breakables[breakables.length] = new Box(brkeable[l][0], brkeable[l][1], brkeable[l][2], brkeable[l][3], color(brkeable[l][4], brkeable[l][5], brkeable[l][6]), brkeable[l][7], brkeable[l][8], texture);
        }
    }

    var bground = json.backgrounds;
    if (bground.length > 0) {
        for (k = 0; k < bground.length; k++) {
            if (bground[k][0] == "cloud") {
                backgrounds[backgrounds.length] = new Cloud(bground[k][1], bground[k][2]);
            } else if (bground[k][0] == "quadrilateral") {
                backgrounds[backgrounds.length] = new Quadriateral(bground[k][1], bground[k][2], bground[k][3], bground[k][4], bground[k][5], bground[k][6], bground[k][7], bground[k][8], color(bground[k][9], bground[k][10], bground[k][11]));
            } else if (bground[k][0] == "backgroundRect") {
                backgrounds[backgrounds.length] = new BackgroundRect(bground[k][1], bground[k][2], bground[k][3], bground[k][4], color(bground[k][5], bground[k][6], bground[k][7]));
            } else if (bground[k][0] == "image") {
                analyzeTexture(bground[k][1]);
                backgrounds[backgrounds.length] = new ImageData(texture, bground[k][2], bground[k][3], bground[k][4], bground[k][5]);
            }
        }
    }
}

function loadStructures(num) {
    if (num === 0) {
        level = level1;
        bgColour = color(50);
        
        walls[walls.length] = new Boarder(0, 0, "right");
        walls[walls.length] = new Boarder(width, 0, "left");
        
        loadFromJSON(level);
    } else if (num === 1) {
        level = level2;
        bgColour = color(117, 0, 0);
        
        walls[walls.length] = new Boarder(0, 0, "right");
        walls[walls.length] = new Boarder(width, 0, "left");
        
        loadFromJSON(level);
    } /*else if (num === 2) {
        players[0].x = 200;
        players[0].y = 50;
        players[1].x = 880;
        players[1].y = 150;
        structures[structures.length] = new Rectangle(0, 150, 70, 10, color(0, 200, 20));
        structures[structures.length] = new Rectangle(700, 250, 300, 10, color(0, 200, 20));
        structures[structures.length] = new Rectangle(690, 260, 310, 10, color(0, 200, 20));
        structures[structures.length] = new Rectangle(680, 270, 320, 10, color(0, 200, 20));
        structures[structures.length] = new Rectangle(670, 280, 330, 10, color(0, 200, 20));
        structures[structures.length] = new Rectangle(660, 290, 340, 10, color(0, 200, 20));
        structures[structures.length] = new Rectangle(650, 300, 350, 10, color(0, 200, 20));
        structures[structures.length] = new Rectangle(640, 310, 360, 10, color(0, 200, 20));
        structures[structures.length] = new Rectangle(630, 320, 370, 10, color(0, 200, 20));
        structures[structures.length] = new Rectangle(620, 330, 380, 10, color(0, 200, 20));
        structures[structures.length] = new Rectangle(80, 410, 500, 10, color(0, 200, 20));
        structures[structures.length] = new Rectangle(670, 450, 200, 10, color(0, 200, 20));
        structures[structures.length] = new Rectangle(30, 300, 50, 10, color(0, 200, 20));
        structures[structures.length] = new Rectangle(120, 220, 50, 10, color(0, 200, 20));
        structures[structures.length] = new Rectangle(190, 150, 420, 10, color(0, 200, 20));
        structures[structures.length] = new Rectangle(200, 160, 420, 10, color(0, 200, 20));
        structures[structures.length] = new Rectangle(210, 170, 420, 10, color(0, 200, 20));
        structures[structures.length] = new Rectangle(220, 180, 420, 10, color(0, 200, 20));
        structures[structures.length] = new Rectangle(230, 190, 420, 10, color(0, 200, 20));
        structures[structures.length] = new Rectangle(240, 200, 420, 10, color(0, 200, 20));
        structures[structures.length] = new Rectangle(190, 160, 100, 50, color(0, 200, 20));
    } else if (num == 3) {
        players[0].x = 200;
        players[0].y = 50;
        players[1].x = 880;
        players[1].y = 50;
        structures[structures.length] = new Rectangle(190, 80, 40, 10, color(0, 200, 20));
        structures[structures.length] = new Rectangle(870, 80, 40, 10, color(0, 200, 20));
    }*/
}