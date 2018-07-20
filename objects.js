var cameraOffsetX = 0; //not used
var cameraOffsetY = 0; //not used
var gravity = 0.2;
var snowballs = []; //stores snowball objects
var editorObjs = []; //not used
snowballs[0] = [];      //create a double array for both players
snowballs[1] = [];
var score = [0, 0]; //stores score
var mouseAction = null; //used when pressing certain buttons
var maxPoints = 5;      //sets and stores max points
var numSpacing = "0";       //used for displaying point selector centered


/* ------------------------------ Foreground Objects ------------------------------ */


/*      Snowball Object     */

function Snowball(posX, posY, vX, vY) {
    this.x = posX;
    this.y = posY;
    this.r = 10;
    this.vx = vX;
    this.vy = vY;
    this.update = function () {
        this.x = this.x + this.vx;
        this.y = this.y + this.vy;
        this.vy = this.vy + gravity;
    }
    this.draw = function () {
        stroke(0);
        strokeWeight(0.5);
        fill(255);
        rect(this.x - cameraOffsetX, this.y - cameraOffsetY, this.r, this.r);
    }
    this.intersects = function (object, p, i) {
        if (this.x + this.r > object.x && this.x < object.x + object.w &&
           this.y + this.r > object.y && this.y < object.y + object.h) {
            snowballs[p].splice(i, 1);
        }
        if (this.y > height + 50) {
            snowballs[p].splice(i, 1);
        }
    }
    this.breaks = function (breakable, b, p, i) {
        if (this.x + this.r > breakables[b].x && this.x < breakables[b].x + breakables[b].w &&
           this.y + this.r > breakables[b].y && this.y < breakables[b].y + breakables[b].h) { 
            breakables.splice(b, 1);
            snowballs[p].splice(i, 1);
        }
    }
    this.hits = function (playerHit, thrower, snowNum) {
        if (this.x + this.r > players[playerHit].x && this.x < players[playerHit].x + players[playerHit].w &&
        this.y + this.r > players[playerHit].y && this.y < players[playerHit].y + players[playerHit].h) {
            if (playerHit != thrower) {
				/*if (startOfKill === false) {          //LOCK MECHANISM WHEN KILLED
					killed = true;
					startOfKill = true;
					console.log("A");
                    walls.splice(0, walls.length);
				}*/
				if (killed === false) {
					console.log("B");
					score[thrower] ++;
					nextRound();
				}
            }
        }
    }
    this.hitsSpecialBall = function (ballIndex, playerIndex, i) {
		if (superballs.length > 0) {
			if (this.x + this.r > superballs[ballIndex].x && this.x < superballs[ballIndex].x + superballs[ballIndex].w &&
            this.y + this.r > superballs[ballIndex].y && this.y < superballs[ballIndex].y + superballs[ballIndex].h) {
				if (playerIndex === 0 && superballs[ballIndex].hp === 1) {
					players[playerIndex].specialIsActive = true;
					snowballs[playerIndex].splice(i, 1);
					superballs.splice(ballIndex, 1);
				} else if (playerIndex === 1 && superballs[ballIndex].hp === 1){
					players[playerIndex].specialIsActive = true;
					snowballs[playerIndex].splice(i, 1);
					superballs.splice(ballIndex, 1);
				} else {
                    snowballs[playerIndex].splice(i, 1);
                    superballs[ballIndex].hp--;
                }
			}
		}
    }
}


/*      Player Object       */

function Player(posX, posY, red, green, blue) {
    this.red = red;
    this.green = green;
    this.blue = blue;
    this.specialColour = color(255, 215, 0)
    this.x = posX;
    this.y = posY;
    this.w = 20;
    this.h = 20;
    this.vx = 0;
    this.vy = 0;
    this.facing = 1;
    this.speed = 7;
    this.vjump = -5;
    this.falling;
    this.grounded = false;
    this.hitsObj = false;
    this.isLookingDown = false;
    this.reloading = false;
    this.offScreen = false;
    this.offScreenDir = null;
    this.specialIsActive = false;
    this.crowned = false;
    this.plusOne = false;
    this.maxJumps = 2;
    this.specialMaxJumps = 5;
    this.jumpNum = 0;
    this.maxSnowballs = 3;
    this.specialMaxSnowballs = 5;
    this.snowballCount = 0;
    this.lives = 3;
    this.startOfReload;
    this.reloadTime = 2500;
    this.specialReloadTime = 500;
	this.reloadAnimation = 0;
    this.draw = function () {
        noStroke();
        if (this.offScreen === false) {
            if (this.specialIsActive) {
                fill(this.specialColour);
            } else {
                fill(this.red, this.green, this.blue);
            }
            rect(this.x - cameraOffsetX, this.y - cameraOffsetY, this.w, this.h);
            if (this.reloading === true) {
                noStroke();
                fill(0, 0, 0, 150);
                rect(this.x - cameraOffsetX, this.y - cameraOffsetY, this.w, this.h - this.reloadAnimation);
            }
        } else {
            noStroke();
            fill(this.red, this.green, this.blue);
            if (this.offScreenDir === "upleft") {
				console.log("upleft!");
			} else if (this.offScreenDir === "upright") {
				console.log("upright!");
			} else if (this.offScreenDir === "left") {
                quad(10, this.y, 10 + 10, this.y - 5, 10 + 15, this.y, 10 + 10, this.y + 5);
            } else if (this.offScreenDir === "right") {
                quad(width - 10, this.y, width - 10 - 10, this.y - 5, width - 10 - 15, this.y, width - 10 - 10, this.y + 5);
            } else if (this.offScreenDir === "up") {
				quad(this.x + (this.w/2), 10, this.x - 5 + (this.w/2), 10 + 10, this.x + (this.w/2), 10 + 15, this.x + 5 + (this.w/2), 10 + 10);
			} else if (this.offScreenDir === "down") {
				quad(this.x + (this.w/2), height - 10, this.x - 5 + (this.w/2), height - 20, this.x + (this.w/2), height - 25, this.x + 5 + (this.w/2), height - 20);
			}
        }
        
        if (this.crowned) {
            fill(255);
            image (crown, this.x - cameraOffsetX, this.y - 20 - cameraOffsetY, 20, 20);
        }
        
        if (this.plusOne) {
            image (plusOne, this.x - cameraOffsetX, this.y - 20 - cameraOffsetY, 20, 20);
        }
    }
    this.update = function () {
        if (this.x + this.w < 0 && this.y + this.h < 0) {
			this.offScreen = true;
            this.offScreenDir = "upleft";
		} else if (this. x > width && this.y + this.h < 0) {
			this.offScreen = true;
            this.offScreenDir = "upright";
		} else if (this. x + this.w < 0) {
            this.offScreen = true;
            this.offScreenDir = "left";
        } else if (this. x > width) {
            this.offScreen = true;
            this.offScreenDir = "right";
        } else if (this.y + this.h < 0) {
			this.offScreen = true;
            this.offScreenDir = "up";
		} else if (this.y > height) {
			this.offScreen = true;
			this.offScreenDir = "down";
		} else {
            this.offScreen = false;
            this.offScreenDir = null;
        }
        
        
        if (keyIsDown (65) && keyIsDown (68)) {
            players[0].vx = 0;
        } else if (keyIsDown (65)) {
            players[0].vx = -this.speed;
            players[0].facing = -1;
        } else if (keyIsDown (68)) {
            players[0].vx = this.speed;
            players[0].facing = 1;
        } else {
            players[0].vx = 0;
        }
        if (keyIsDown(83)){
            players[0].isLookingDown = true;
        } else {
            players[0].isLookingDown = false;
        }
        

        if (players.length >= 2) {
            if (keyIsDown (74) && keyIsDown (76)) {
                players[1].vx = 0;
            } else if (keyIsDown (74)) {
                players[1].vx = -this.speed;
                players[1].facing = -1;
            } else if (keyIsDown (76)) {
                players[1].vx = this.speed;
                players[1].facing = 1;
            } else {
                players[1].vx = 0;
            }
            if (keyIsDown(75)){
                players[1].isLookingDown = true;
            } else {
                players[1].isLookingDown = false;
            }
        }
        
        this.x = this.x + this.vx;
        this.y = this.y + (this.vy * 2);
        
        if (this.vy <= 10) {
            this.vy = this.vy + gravity;
        }
        
        if (this.vy >= 0) {
            this.falling = true;
        } else {
            this.falling = false;
        }
        
        if (this.specialIsActive === false) {
            if (this.maxSnowballs - this.snowballCount < 0) {
                    this.snowballCount = this.maxSnowballs;
            }
        }
    }
    this.intersects = function (object) {
        if (this.y + this.h > object.y && this.y < object.y && this.x + this.w > object.x && this.x < object.x + object.w && this.falling) {
            this.grounded = true;
            this.jumpNum = 0;
            this.vy = 0;
            this.y = object.y - this.h;
        } else if (this.y < object.y + object.h && this.y + this.h > object.y + object.h && 
            this.x + this.w > object.x && this.x < object.x + object.w && !this.falling) {
            
            this.vy = 0;
            this.y = object.y + object.h;
        } else if (this.x + this.w > object.x && this.x < object.x && this.y < object.y + object.h &&
                   this.y + this.h > object.y) {
            this.vx = 0;
            this.x = object.x - this.w;
        } else if (this.x < object.x + object.w && this.x + this.w > object.x + object.w && this.y < object.y + object.h &&
                   this.y + this.h > object.y) {
            this.vx = 0;
            this.x = object.x + object.w;
        }
    }
	
	this.hitsWall = function (wall, playerIndex) {
		if (wall.dir === "right" && (this.x < wall.x + wall.w)) {
			/*if (startOfKill === false) {           //LOCK MECHANISM WHEN KILLED
				killed = true;
				startOfKill = true;
                stopWalls = true;
				console.log("A");
			}*/
			if (killed === false) {
				console.log("B");
				if (playerIndex === 0) {
					score[1]++;
					nextRound();
				} else if (playerIndex === 1) {
					score[0]++;
					nextRound();
				}
			}
		} else if (wall.dir === "left" && (this.x + this.w > wall.x)) {
            /*if (startOfKill === false) {          //LOCK MECHANISM WHEN KILLED
				killed = true;
				startOfKill = true;
				console.log("A");
			}*/
			if (killed === false) {
				console.log("B");
				if (playerIndex === 0) {
					score[1]++;
					nextRound();
				} else if (playerIndex === 1) {
					score[0]++;
					nextRound();
				}
			}
		}
	}
	
    this.jump = function () {
        if (this.specialIsActive === false) {
            if (this.jumpNum < this.maxJumps) {    
                this.vy = this.vjump;
                this.grounded = false;
                this.jumpNum += 1;
            }
        } else {
            if (this.jumpNum < this.specialMaxJumps) {    
                this.vy = this.vjump;
                this.grounded = false;
                this.jumpNum += 1;
            }
        }
    }
    
    this.throw = function (player) {
        if (this.specialIsActive) {
            if (this.snowballCount < this.specialMaxSnowballs) {
                if (this.isLookingDown) {
                    snowballs[player][snowballs[player].length] = new Snowball(this.x + this.w/2 - 10, this.y + this.h, 3*this.facing, 14);
                    this.snowballCount += 1;
                } else if (this.facing === 1) {
                    snowballs[player][snowballs[player].length] = new Snowball(this.x + this.w, this.y, 17*this.facing, -3);
                    this.snowballCount += 1;
                } else if (this.facing === -1) {
                    snowballs[player][snowballs[player].length] = new Snowball(this.x - 10, this.y, 17*this.facing, -3);
                    this.snowballCount += 1;
                }
                this.reloading = false;
            }
        } else {
            if (this.snowballCount < this.maxSnowballs) {
                if (this.isLookingDown) {
                    snowballs[player][snowballs[player].length] = new Snowball(this.x + this.w/2 - 10, this.y + this.h, 3*this.facing, 14);
                    this.snowballCount += 1;
                } else if (this.facing === 1) {
                    snowballs[player][snowballs[player].length] = new Snowball(this.x + this.w, this.y, 17*this.facing, -3);
                    this.snowballCount += 1;
                } else if (this.facing === -1) {
                    snowballs[player][snowballs[player].length] = new Snowball(this.x - 10, this.y, 17*this.facing, -3);
                    this.snowballCount += 1;
                }
                this.reloading = false;
            }
        }
    }
    
    this.reloadSnow = function () {
        this.reloading = true;
        this.startOfReload = millis();
    }
    
    this.reloadTimer = function () {
        if (this.reloading) {
            if (this.specialIsActive) {
                this.reloadAnimation =+ (this.h / this.specialReloadTime)*(millis() - this.startOfReload);
                if (millis() - this.startOfReload > this.specialReloadTime) {
                    this.snowballCount = 0;
                    this.reloading = false;
                }
            } else { 
                this.reloadAnimation =+ (this.h / this.reloadTime)*(millis() - this.startOfReload);
                if (millis() - this.startOfReload > this.reloadTime) {
                    this.snowballCount = 0;
                    this.reloading = false;
                }
            }
        }
    }
}


/*      Keypressed Function     */

function keyPressed() {
    if (counting === false && killed === false) {
        if (keyCode === 87) {
            players[0].jump();
        }
        if (keyCode === 73 && players.length >= 2) {
            players[1].jump();
        }
        if (keyCode === 86 && screen != "endGame") {
            players[0].throw(0);
        }
        if (keyCode === 80 && players.length >= 2 && screen != "endGame") {
            players[1].throw(1);
        }
        if (keyCode === 67 && screen != "endGame") {
            players[0].reloadSnow();
        }
        if (keyCode === 219 && players.length >= 2 && screen != "endGame") {
            players[1]. reloadSnow();
        }
    }
    if (keyCode === 37) {
        cameraOffsetX -= 10;
        console.log(cameraOffsetX);
    }
    if (keyCode === 39) {
        cameraOffsetX += 10;
        console.log(cameraOffsetX);
    }
    if (keyCode === 38) {
        cameraOffsetY -= 10;
        console.log(cameraOffsetY);
    }
    if (keyCode === 40) {
        cameraOffsetY += 10;
        console.log(cameraOffsetY);
    }
}


/*      Mouse Clicked Function      */

function mouseClicked() {
    if (mouseAction === "nextLevel" && structureSet < 1) {
        structureSet++
        console.log("Next Level!");
    } else if (mouseAction === "prevLevel" && structureSet > 0) {
        structureSet--
        console.log("Previous Level!");
    }
    mouseAction = null;
}


/*      Rectangle Object        */

function Rectangle(posX, posY, width, height, colour, texture) {
    this.x = posX;
    this.y = posY;
    this.w = width;
    this.h = height;
    this.col = colour;
    this.rectTexture = texture;
    this.draw = function () {
        noStroke();
        fill(this.col);
        rect(this.x - cameraOffsetX, this.y - cameraOffsetY, this.w, this.h);
        if (this.rectTexture != null) {
            image(this.rectTexture, this.x - cameraOffsetX, this.y - cameraOffsetY, this.w, this.h);
        }
    }
}


/*      Button Object       */

function Button(posX, posY, width, height, boarder, fillCol, str, textCol, fontSize, textOffsetX, textOffsetY, action) {
    this.x = posX;
    this.y = posY;
    this.w = width;
    this.h = height;
    this.boarder = boarder;
    this.fillCol = fillCol;
    this.str = str;
    this.textCol = textCol;
    this.fontSize = fontSize;
    this.textOffsetX = textOffsetX;
    this.textOffsetY = textOffsetY;
    this.action = action;
    this.selected;
    this.doAction = function(toDo) {
        if (toDo === "startGame") {
            loadStructures(structureSet);
            screen = "play";
            roundTimer();
        } else if (toDo === "controls") {
            screen = "controls"
        } else if (toDo === "nextLevel") {
            mouseAction = "nextLevel";
        } else if (toDo === "prevLevel") {
            mouseAction = "prevLevel";
        } else if (toDo === "mainMenu") {
            screen = "mainMenu";
        } else if (toDo === "maxPoints5") {
            maxPoints = 5;
            numSpacing = "0";
            this.selected = true;
        } else if (toDo === "maxPoints10") {
            maxPoints = 10;
            numSpacing = "";
            this.selected = true;
        } else if (toDo === "maxPoints15") {
            maxPoints = 15;
            numSpacing = "";
            this.selected = true;
        } else if (toDo === "maxPoints20") {
            maxPoints = 20;
            numSpacing = "";
            this.selected = true;
        } else if (toDo === "resetGame") {
            console.log("reset game");
            resetGame();
            screen = "mainMenu";
            score[0] = 0;
            score[1] = 0;
        } else if (toDo === "levelEditor") {
            screen = "editor";
            resizeCanvas(1000, 570);
            loadEditor();
        }
    }
    this.draw = function() {
        fill(this.fillCol); 
        if (this.selected === true){
            fill(255, 255, 0);
        }
        strokeWeight(this.boarder);
        stroke(0);
        rect (this.x, this.y, this.w, this.h);
        textSize(this.fontSize);
        fill(this.textCol);
        noStroke();
        text (this.str, this.x + this.textOffsetX, this.y + this.textOffsetY);
    }
    this.update = function() {
        if(mouseIsPressed) {
            if (mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h) {
                this.doAction(this.action)
            }
        }
    }
}


/*      Box/Breakable Object        */

function Box(posX, posY, width, height, col, inMotion, hasOutline, texture) {
    this.x = posX;
    this.y = posY;
    this.w = width;
    this.h = height;
    this.motion = inMotion;
    this.vy = 0;
    this.col = col
    this.boxTexture = texture;
    this.outline = hasOutline;
    this.draw = function () {
        if (this.outline) {
            strokeWeight(0.9);
        } else {
            strokeWeight(0);
        }
        stroke(0);
        fill(this.col);
        rect(this.x - cameraOffsetX, this.y - cameraOffsetY, this.w, this.h);
        if (this.boxTexture != null){
            image(this.boxTexture, this.x - cameraOffsetX, this.y - cameraOffsetY, this.w, this.h);
        }
    }
    this.update = function () {
        if (this.motion) {
            this.y = this.y + this.vy;
            this.vy = this.vy + gravity;
        }
    }
    this.intersects = function (object) {
        if (this.y + this.h > object.y && this.y < object.y && this.x + this.w > object.x && this.x < object.x + object.w) {
            this.vy = 0;
            this.y = object.y - this.h;
        } else if (this.y < object.y + object.h && this.y + this.h > object.y + object.h && 
            this.x + this.w > object.x && this.x < object.x + object.w) {
            
            this.vy = 0;
            this.y = object.y + object.h;
        }
    }
}


/*          Superball Object            */

function SuperBall(posX, posY, radius, vel, angle) {
    this.x = posX;
    this.y = posY;
    this.w = radius;
    this.h = radius;
    this.v = vel;
    this.vx;
    this.vy;
    this.a = angle;
    this.angleOff = random(0, 360);
    this.hp = 3;
    this.draw = function () {
        strokeWeight(0.9);
        stroke(0);
        fill(255, 0, 255);
        ellipse((this.x + this.w/2) - cameraOffsetX, (this.y + this.h/2) - cameraOffsetY, this.w, this.h);
        fill(0, 75 * (3 - this.hp));
        ellipse((this.x + this.w/2) - cameraOffsetX, (this.y + this.h/2) - cameraOffsetY, this.w, this.h);
    }
    this.update = function () {
        this.a = noise(this.angleOff) * 2000;
        this.angleOff = this.angleOff + 0.003
        this.vx = this.v * (cos(this.a));
        this.vy = -(this.v * (sin(this.a)));
        this.x = this.x + this.vx;
        this.y = this.y + this.vy;
    }
}


/*            Lava Object            */

function Lava(posX, posY, velX, velY){
    this.x = posX;
    this.y = posY;
    this.r = 20;
    this.vx = velX;
    this.vy = velY;
    this.draw = function() {
        fill(255, 0, 0);
        ellipse(this.x, this.y, this.r, this.r);
    }
    this.update = function() {
        this.x = this.x + this.vx;
        this.y = this.y + this.vy;
        this.vy = this.vy + gravity;
    }
}


/*          Boarder Object           */

function Boarder(posX, posY, direction) {
    this.x = posX;
    this.y = posY;
    this.w = 0;
    this.h = height;
    this.dir = direction;
    this.startOfClosingWalls;
    this.wallAnimation = 0;
    this.startClosingWalls = false;
    this.draw = function() {
        noStroke();
        fill (178, 34, 34, 200);
        rect (this.x, this.y, this.w, this.h);
    }
    this.update = function() {
        if (timerEnd === true && killed === false) {
            if (this.startClosingWalls === false) {
                this.startOfClosingWalls = millis();
                this.startClosingWalls = true;
            }   
            
            //console.log(millis() - this.startClosingWalls);
            
            this.wallAnimation = ((width/2)/closingWallLength) * (millis() - this.startOfClosingWalls);
            
            if (this.dir === "left") {
                this.x = width - this.wallAnimation;
                this.w = this.wallAnimation;
            } else if (this.dir === "right") {
                this.w = this.wallAnimation;
            }
        } /*else if (timerEnd === true && killed === true) {
            this.startOfClosingWalls = millis() + 1000;
            console.log(millis() - this.startOfClosingWalls);
        }*/
    }
}


/* -------------------------- Background/Texture Objects -------------------------- */


/*          Cloud Object          */

function Cloud(posX, posY) {
    this.x = posX;
    this.y = posY;
    this.draw = function () {
        noStroke();
        fill(255);
        ellipse(this.x - cameraOffsetX, this.y - cameraOffsetY - 5, 40, 40);
        ellipse(this. x - cameraOffsetX + 30, this.y - cameraOffsetY - 15, 40, 40);
        ellipse(this.x - cameraOffsetX + 55, this.y - cameraOffsetY, 30, 30);
        rect(this.x - cameraOffsetX, this.y - cameraOffsetY, 57, 15);
    }
}


/*          Rectangle Object            */

function BackgroundRect(posX, posY, width, height, colour) {
    this.x = posX;
    this.y = posY;
    this.w = width;
    this.h = height;
    this.col = colour;
    this.draw = function() {
        fill(this.col);
        rect(this.x - cameraOffsetX, this.y - cameraOffsetY, this.w, this.h);
    }
}


/*          Quadrilateral Object            */

function Quadriateral(x1, y1, x2, y2, x3, y3, x4, y4, colour) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.x3 = x3;
    this.y3 = y3;
    this.x4 = x4;
    this.y4 = y4;
    this.col = colour;
    this.draw = function() {
        fill(this.col);
        quad(this.x1 - cameraOffsetX, this.y1 - cameraOffsetY, this.x2 - cameraOffsetX, this.y2 - cameraOffsetY, this.x3 - cameraOffsetX, this.y3 - cameraOffsetY, this.x4 - cameraOffsetX, this.y4 - cameraOffsetY);
    }
}

/* -------------------------------- Other Objects -------------------------------- */


/*          Image Data Object           */

function ImageData (img, posX, posY, width, height) {
    this.img = img;
    this.x = posX;
    this.y = posY;
    this.w = width;
    this.h = height;
    this.draw = function() {
        image(this.img, this.x - cameraOffsetX, this.y - cameraOffsetY, this.w, this.h);
    }
}

function EditorObj (posX, posY, width, height, colour, name, texture) {
    this.x = posX;
    this.y = posY;
    this.w = width;
    this.h = height;
    this.col = colour;
    this.texture = texture;
    this.name = name;
    this.selected = false;
    this.stage;
    this.draw = function () {
        noStroke();
        fill(this.col);
        if (this.selected) {
            fill(255, 255, 0);
        }
        rect(this.x - cameraOffsetX, this.y - cameraOffsetY, this.w, this.h);
        if (this.rectTexture != null) {
            image(this.rectTexture, this.x - cameraOffsetX, this.y - cameraOffsetY, this.w, this.h);
        }
    }
    this.update = function () {
        if (mouseX >= this.x && mouseX <= this.x + this.w && mouseY >= this.y && mouseY <= this.y + this.h) {
            if (mouseIsPressed) {
                for (p = 0; p < editorObjs.length; p++) {
                    editorObjs[p].selected = false;
                }
                this.selected = true;
                console.log("select " + this.name);
            } else if (mouseY > 500) {
                textSize(17);
                fill(0);
                text(name, mouseX + 10, mouseY);
            }
        }
    }
}

function loadEditor () {
    backgrounds[backgrounds.length] = new BackgroundRect(0, 500, 1000, 70, color(0));
    backgrounds[backgrounds.length] = new BackgroundRect(2, 502, 996, 66, color(200));
    
    editorObjs[editorObjs.length] = new EditorObj(20, height - 50, 70, 30, color(0, 150, 0), "Platform", null);
    editorObjs[editorObjs.length] = new EditorObj(100, height - 50, 70, 30, color(0, 150, 0), "Breakable", null);
    editorObjs[editorObjs.length] = new EditorObj(180, height - 50, 70, 30, color(0, 150, 0), "Cloud", null);
    editorObjs[editorObjs.length] = new EditorObj(260, height - 50, 70, 30, color(0, 150, 0), "Background Rectangle", null);
    editorObjs[editorObjs.length] = new EditorObj(340, height - 50, 70, 30, color(0, 150, 0), "Background Quadrilateral", null);
    editorObjs[editorObjs.length] = new EditorObj(420, height - 50, 30, 30, color(255, 0, 0), "Player 1 Spawn Location", null);
    editorObjs[editorObjs.length] = new EditorObj(460, height - 50, 30, 30, color(0, 0, 255), "Player 2 Spawn Location", null);
}