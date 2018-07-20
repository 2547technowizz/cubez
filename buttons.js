var buttons = [];
var levelTextSize;

function loadButtons(num) {
    buttons.splice(0, buttons.length);
    if (num === 0) {
        /*          Main Menu Buttons           */
        buttons[buttons.length] = new Button(width/2 - 75, height/2 - 80, 150, 50, 2, color(45, 188, 45), "Play", 0, 35, 39, 35, "startGame");
        levelTextSize = 35;
        buttons[buttons.length] = new Button(width/2 - 75, height/2 - 15, 150, 50, 2, color(255, 255, 255), "Level: " + (structureSet + 1), 0, levelTextSize, 15, 38, "none");
        buttons[buttons.length] = new Button(width/2 + 80, height/2 - 15, 40, 50, 2, color(255, 0, 0), ">", 0, 35, 10, 38, "nextLevel");
        buttons[buttons.length] = new Button(width/2 - 120, height/2 - 15, 40, 50, 2, color(0, 0, 255), "<", 0, 35, 10, 38, "prevLevel");
        buttons[buttons.length] = new Button(width/2 - 115, height/2 + 50, 50, 50, 2, color(150, 150, 150), "5", 0, 35, 15, 38, "maxPoints5");
        buttons[buttons.length] = new Button(width/2 - 55, height/2 + 50, 50, 50, 2, color(150, 150, 150), "10", 0, 35, 6, 38, "maxPoints10");
        buttons[buttons.length] = new Button(width/2 + 5, height/2 + 50, 50, 50, 2, color(150, 150, 150), "15", 0, 35, 6, 38, "maxPoints15");
        buttons[buttons.length] = new Button(width/2 + 65, height/2 + 50, 50, 50, 2, color(150, 150, 150), "20", 0, 35, 6, 38, "maxPoints20");
        buttons[buttons.length] = new Button(width/2 - 145, height/2 + 115, 295, 50, 2, color(45, 188, 45), "First To: " + numSpacing + maxPoints + " Points", 0, 35, 9, 37, "none");
//        buttons[buttons.length] = new Button(50, height/2 + 150, 200, 50, 2, color(0, 255, 0), "Level Editor", 0, 35, 8, 37, "levelEditor");
        buttons[buttons.length] = new Button(width/2 - 75, height/2 + 180, 150, 50, 2, color(194, 206, 194), "Controls", 0, 35, 9, 37, "controls");
    } else if (num === 1) {
        /*          Controls Menu Buttons           */
        buttons[buttons.length] = new Button(width/2 - 75, height/2 + 110, 150, 50, 2, color(194, 206, 194), "Back", 0, 35, 36, 37, "mainMenu");
    } else if (num === 2) {
        /*             End Game Buttons             */
        buttons[buttons.length] = new Button(width - 250, height/2 + 180, 200, 50, 2, color(194, 206, 194), "New Game", 0, 35, 13, 37, "resetGame");
    }
}