var AM = new AssetManager();

function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spriteSheet,
                 xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
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
    this.animation = new Animation(spritesheet, 158, 200, 1586, .15, 10, true, .8);
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
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}
function Pumpkin_Run(game, spritesheet) {
    this.animation = new Animation(spritesheet, 157, 700, 1586, .1, 10, true, .5);
    this.speed = 200;
    this.ctx = game.ctx;
    Entity.call(this, game, 0, 100);
}

Pumpkin_Run.prototype = new Entity();
Pumpkin_Run.prototype.constructor = Pumpkin_Run;

Pumpkin_Run.prototype.update = function () {
    this.x += this.game.clockTick * this.speed;
    if (this.x > 630) this.x = -230;
    Entity.prototype.update.call(this);
}

Pumpkin_Run.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

AM.queueDownload("./img/background.jpg");
AM.queueDownload("./img/pumpkin_death.png");
AM.queueDownload("./img/pumpkinSprite.png")

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/background.jpg")));
    gameEngine.addEntity(new Pumpkin_Death(gameEngine, AM.getAsset("./img/pumpkin_death.png")));
    gameEngine.addEntity(new Pumpkin_Run(gameEngine, AM.getAsset("./img/pumpkinSprite.png")));


    console.log("All Done!");
});