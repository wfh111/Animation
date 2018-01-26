var AM = new AssetManager();

function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y, scaleBy) {
    var scaleBy = scaleBy || 1;
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    } else if (this.isDone()) {
        return;
    }
    var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    var vindex = 0;
    if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
        index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
        vindex++;
    }
    while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
        index -= Math.floor(this.spriteSheet.width / this.frameWidth);
        vindex++;
    }

    var locX = x;
    var locY = y;
    var offset = vindex === 0 ? this.startX : 0;
    ctx.drawImage(this.spriteSheet,
                  index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
                  this.frameWidth, this.frameHeight,
                  locX, locY,
                  this.frameWidth * scaleBy,
                  this.frameHeight * scaleBy);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

// no inheritance
function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y);
};

Background.prototype.update = function () {
};

// inheritance 
function Pumpkin_Death(game, spritesheet) {
    this.animation = new Animation(spritesheet, 0, 0, 409, 325, .15, 10, true);
    this.speed = 0;
    this.ctx = game.ctx;
    Entity.call(this, game, 0, 0);
}

Pumpkin_Death.prototype = new Entity();
Pumpkin_Death.prototype.constructor = Pumpkin_Death;

Pumpkin_Death.prototype.update = function () {
    this.x += this.game.clockTick * this.speed;
    if (this.x > 630) this.x = -230;
    Entity.prototype.update.call(this);
}

Pumpkin_Death.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 0.4);
    Entity.prototype.draw.call(this);
}

function Pumpkin_Run(game, spritesheet) {
    this.animation = new Animation(spritesheet, 0, 700, 240, 300,  .1, 8, true);
    this.speed = 230;
    this.ctx = game.ctx;
    Entity.call(this, game, 0, 150);
}

Pumpkin_Run.prototype = new Entity();
Pumpkin_Run.prototype.constructor = Pumpkin_Run;

Pumpkin_Run.prototype.update = function () {
    this.x += this.game.clockTick * this.speed;
    if (this.x > 630) this.x = -230;
    Entity.prototype.update.call(this);
}

Pumpkin_Run.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 0.4);
    Entity.prototype.draw.call(this);
}

function Pumpkin_Jump(game, spritesheet) {
    this.animation = new Animation(spritesheet, 0, 330, 243, 320,  .2, 10, true);
    this.speed = 150;
    this.ctx = game.ctx;
    this.ground = 525;
    Entity.call(this, game, 0, 450);
}

Pumpkin_Jump.prototype = new Entity();
Pumpkin_Jump.prototype.constructor = Pumpkin_Jump;

Pumpkin_Jump.prototype.update = function () {
    this.x += this.game.clockTick * this.speed;
    if (this.x > 630) this.x = -230;
    if (this.animation.isDone()) {
        this.animation.elapsedTime = 0;
    }
    var jumpDistance = this.animation.elapsedTime / this.animation.totalTime;
    var totalHeight = 200;

    if (jumpDistance > 0.5)
        jumpDistance = 1 - jumpDistance;

    //var height = jumpDistance * 2 * totalHeight;
    var height = totalHeight*(-4 * (jumpDistance * jumpDistance - jumpDistance));
    this.y = this.ground - height;
    Entity.prototype.update.call(this);
}

Pumpkin_Jump.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x + 17, this.y - 34, 0.4);
    Entity.prototype.draw.call(this);
}

function Pumpkin_Walk(game, spritesheet) {
    this.animation = new Animation(spritesheet, 0, 1000, 240, 300,  .2, 10, true);
    this.speed = 100;
    this.ctx = game.ctx;
    Entity.call(this, game, 0, 300);
}

Pumpkin_Walk.prototype = new Entity();
Pumpkin_Walk.prototype.constructor = Pumpkin_Walk;

Pumpkin_Walk.prototype.update = function () {
    this.x += this.game.clockTick * this.speed;
    if (this.x > 630) this.x = -230;
    Entity.prototype.update.call(this);
}

Pumpkin_Walk.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 0.4);
    Entity.prototype.draw.call(this);
}

AM.queueDownload("./img/background.jpg");
AM.queueDownload("./img/pumpkin.png");


AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/background.jpg")));
    gameEngine.addEntity(new Pumpkin_Death(gameEngine, AM.getAsset("./img/pumpkin.png")));
    gameEngine.addEntity(new Pumpkin_Jump(gameEngine, AM.getAsset("./img/pumpkin.png")));
    gameEngine.addEntity(new Pumpkin_Run(gameEngine, AM.getAsset("./img/pumpkin.png")));
    gameEngine.addEntity(new Pumpkin_Walk(gameEngine, AM.getAsset("./img/pumpkin.png")));


    console.log("All Done!");
});