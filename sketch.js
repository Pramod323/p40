//5 June 2021
//..
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var obstaclesGroup, obstacle1png, obstacle2png, obstacle4png, obstacle6png;
var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound;
var lastFrameCount = 0;
var bg;

function preload(){
  bg = loadImage("background.jpg");
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  groundImage = loadImage("ground2.png");
  obstacle1png = loadImage("obstacle1.png");
  obstacle2png = loadImage("obstacle2.png");
  obstacle4png = loadImage("obstacle4.png");
  obstacle6png = loadImage("obstacle6.png");
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600, 200);
  frameRate(30);
  
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.setCollider("rectangle",0,0,trex.width-15,trex.height);
  trex.scale = 0.5;
  
  ground = createSprite(1670/2,180,1670,20);
  ground.addImage("ground",groundImage);
  
  gameOver = createSprite(0,75);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;
  
  restart = createSprite(0,115);
  restart.addImage(restartImg);
  restart.scale = 0.5;
  
  invisibleGround = createSprite(trex.x,190,100,10);
  invisibleGround.visible = false;
  
  obstaclesGroup = createGroup();
  
  score = 0;
}

function draw() {
  background(bg);
  frameRate(30);

  invisibleGround.x = trex.x;
  gameOver.x = trex.x;
  restart.x = trex.x;
  trex.velocityX = 6 + 3* score/100;
  camera.position.x = trex.x;
  //displaying score
  fill("black");
  text("Score: "+ score, trex.x+230,50);
  
  if(gameState === PLAY){
    gameOver.visible = false;
    restart.visible = false;
    //scoring
    score = frameCount - lastFrameCount;
    if(trex.x>1600){trex.x = 50}
    if(score>0 && score%100 === 0){checkPointSound.play();}
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= 140) {
      trex.velocityY = -12;
      jumpSound.play();
    }
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
    spawnObstacles();
    if(obstaclesGroup.isTouching(trex)){
      //trex.velocityY = -12;
      jumpSound.play();
      gameState = END;
      dieSound.play();
    }

    
  } else if (gameState === END) {
  gameOver.visible = true;
  restart.visible = true;
  trex.velocityX = 0;
  
  //change the trex animation
  trex.changeAnimation("collided", trex_collided);
  trex.velocityY = 0    
  }
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  if(mousePressedOver(restart)&&gameState===END){
    lastFrameCount = frameCount;
    reset();
  }
  
  drawSprites();
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach();
  trex.changeAnimation("running",trex_running);
  trex.x = 50;
  trex.y = 160;
}

function spawnObstacles(){
  var obstacle1 = createSprite(400,165,10,40);
  var obstacle2 = createSprite(700,165,10,40);
  var obstacle3 = createSprite(980,165,10,40);
  var obstacle4 = createSprite(1300,165,10,40);
  var obstacle5 = createSprite(1590,165,10,40);
  var obstacle6 = createSprite(10,165,10,40);

  obstacle1.scale = 0.5;
  obstacle2.scale = 0.5;
  obstacle3.scale = 0.5;
  obstacle4.scale = 0.5;
  obstacle5.scale = 0.5;
  obstacle6.scale = 0.5;

  obstacle1.addImage(obstacle4png);
  obstacle2.addImage(obstacle1png);
  obstacle3.addImage(obstacle4png);
  obstacle4.addImage(obstacle6png);
  obstacle5.addImage(obstacle2png);
  obstacle6.addImage(obstacle1png);

  obstaclesGroup.add(obstacle1);
  obstaclesGroup.add(obstacle2);
  obstaclesGroup.add(obstacle3);
  obstaclesGroup.add(obstacle4);
  obstaclesGroup.add(obstacle5);
  obstaclesGroup.add(obstacle6);
}

// Pramod Prasad Singh
//WHJR