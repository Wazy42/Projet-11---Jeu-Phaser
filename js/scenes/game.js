import Player from "../entities/player.js";
import Enemy from "../entities/enemies.js";
import listeners from "../utils/listeners.js";

let listOfClasses = ['Melee', 'Range'];
// DO NOT FORGET IF RANGE < 100: ATTACK DAMAGE AUTOMATICLY MULTIPLIED BY 2
let baseStats = {
  'Melee': [
    3, // health
    150, // movementSpeed
    1, // attackDamage
    0.5, // attackSpeed,
    75 // range
  ],
  'Range': [
    2, // health
    100, // movementSpeed
    3, // attackDamage
    0.3, // attackSpeed,
    200 // range
  ]
};

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
    this.player;
    this.enemies = [];
  }

  /* 
  Here is preloading:
  Loading all images into Phaser here to prevent lagging in game
  */
  preload() {
    this.load.image('FloorTiles', 'map/Tiles.png');
    this.load.tilemapTiledJSON('map', 'map/maptest.json');
    this.load.image('Player', 'assets/entities/Player.png');
    this.load.image('Melee', 'assets/entities/clownMelee.png');
    this.load.image('Range', 'assets/entities/clownRanged.png');
    this.load.image('Bullet', 'assets/animation/bullet.png');
    this.load.image('Punch', 'assets/animation/punch.png');
    this.load.image('BarContainer', 'assets/hud/HealthBarContainer.png');
    this.load.image('MapouLogo', 'assets/menus/mapouLogo.png');
    this.load.image('HealthIcon', 'assets/hud/HealthIcon.png')
    this.load.image('SpeedIcon', 'assets/hud/SpeedIcon.png')
    this.load.image('StrengthIcon', 'assets/hud/StrengthIcon.png')
    this.load.image('AttackIcon', 'assets/hud/AttackIcon.png')
    this.load.image('TicketIcon', 'assets/hud/TicketIcon.png')
  }

  /*
  The create function:
  It's executed once before the first frame of the Game
  All the setups are done here (graphics, object creation, etc)
  */
  create() {
    // Import map (floor)
    const map = this.add.tilemap('map');
    const tileset = map.addTilesetImage('FloorTiles');
    map.createLayer('FloorLayer', tileset);
    this.wallsLayer = map.createLayer('WallLayer', tileset)

    this.wallsLayer.setCollisionByProperty({ collides: false }, true, false);
    const debugGraphics = this.add.graphics().setAlpha(0.75);
    this.wallsLayer.renderDebug(debugGraphics, {
      tileColor: null, // Color of non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
      faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    })

    // Player and camera
    this.player = new Player(this, 500, 800);
    this.cameras.main.startFollow(this.player.sprite, true);
    this.physics.add.collider(this.player.sprite, this.wallsLayer);

    // Enemy
    this.waveNumber = 1;
    this.enemyWave([1, 1, 1, 1, 1], 3, 1);

    // Disable option GUI on right click 
    this.input.mouse.disableContextMenu();

    // HUD setup 
    this.makeProgressBar(22, this.scale.gameSize.height - 77, 226, 40, 0x303030).setDepth(1); // behind health bar
    this.healthBar = this.makeProgressBar(22, this.scale.gameSize.height - 77, 226, 40, 0x2ecc71).setDepth(1); // health bar
    this.makeProgressBar(22, this.scale.gameSize.height - 37, 226, 40, 0x303030).setDepth(1); // behind stamina bar
    this.staminaBar = this.makeProgressBar(22, this.scale.gameSize.height - 37, 226, 40, 0xffff00).setDepth(1); // stamina bar
    this.add.image(0, this.scale.gameSize.height, 'BarContainer').setOrigin(0, 1).setScrollFactor(0).setDepth(1).scale = 0.25; // Container around stamina and health bar
    this.statText = this.add.text(5, 5).setScrollFactor(0)

    // Shop HUD
    this.shopTexts = []
    listeners.shop.forEach((shopItem, i) => {
      this.add.image(this.scale.gameSize.width - 20, 30 + i * 50, shopItem.spriteName).setScrollFactor(0).setScale(0.07);
      this.shopTexts.push(this.add.text(this.scale.gameSize.width - 150, 15 + i * 50).setScrollFactor(0));
    });
  }


  /*
  The update function:
  It's executed between each frame of the game
  All checks in game are executed here (collisions, inputs, HUD, etc)
  */
  update() {
    // Player
    this.player.checkKeyboard();
    this.player.rangeWeapon.checkCollision(this.enemies); // Check collisions between player's bullets and enemies
    // Stamina regen (after a few seconds)
    if (this.player.stamina < this.player.maxStamina && this.time.now > this.player.staminaCooldown) {
      this.player.stamina++;
      this.player.staminaCooldown = this.time.now + 50;
    }
    // Health regen (if stamina full and after a few seconds)
    else if (this.time.now > this.player.staminaCooldown + 5000 && this.player.health < this.player.maxHealth) {
      this.player.health += this.player.maxHealth/100;
      this.player.staminaCooldown = this.time.now - 4550;
    }

    // Shut down if player is dead
    if (!this.player.isAlive()) {
      this.scene.start('DeathScene');
    }

    // Enemy
    if (this.enemies.length == 0) { // Force next wave if all enemies are killed
      this.time._active[0].remove(true);
    }
    this.enemies.forEach(enemy => {
      enemy.updateIA(this); // Make the enemy move and shoot
      enemy.weapon.checkCollision([this.player]); // Check collisions between enemies' bullets and player
      if (!enemy.isAlive()) { // Removes dead enemies
        enemy.destroyItself();
        this.enemies.splice(this.enemies.indexOf(enemy), 1);

        listeners.killCount += 1; // stats
        listeners.tickets += 1;
        listeners.score += 10;
      }
    });

    // Game
    this.updateHUD();
  }


  //  ^^^^^^^^^^^^^^^^
  //  PHASER FUNCTIONS
  //
  // SEPARATION BEWTEEN
  //
  //   OTHER FUNCTIONS
  //   vvvvvvvvvvvvvvv


  updateHUD() {
    this.updateProgressBar(this.healthBar, this.player.health, this.player.maxHealth);
    this.updateProgressBar(this.staminaBar, this.player.stamina, this.player.maxStamina);
    this.statText.setText([
      'Wave number ' + this.waveNumber,
      'Enemies: ' + this.enemies.length,
      'Tickets: ' + listeners.tickets
    ])
    this.shopTexts.forEach((text, i) => {
      text.setText([
        'Level: ' + listeners.shop[i].level,
        'Price: ' + listeners.shop[i].price
      ]);
    });
  }

  makeProgressBar(x, y, w, h, color, displayNumbers=false) {
    let progressBar = this.add.graphics().setScrollFactor(0); // init
    progressBar.fillStyle(color, 1); // color inside
    progressBar.fillRect(0, 0, w, h); // draw the rectangle
    progressBar.x = x; // position of the bar
    progressBar.y = y;
    return progressBar;
  }

  updateProgressBar(progressBar, value, maximumValue) {
    progressBar.setScale(value / maximumValue, 1);
  }


  addEnemy(x, y, type, multipliers = [1, 1, 1, 1, 1]) {
    var stats = [...baseStats[type]];
    stats.forEach((e, i) => { // Apply multipliers
      stats[i] = stats[i] * multipliers[i];
    });

    var newGuy = new Enemy(this, x, y, type, ...stats);
    this.enemies.forEach(enemy => { // Add collisions with all enemies
      this.physics.add.collider(newGuy.sprite, enemy.sprite);
    })
    this.physics.add.collider(newGuy.sprite, this.player.sprite); // add collisions with player

    this.enemies.push(newGuy); // add to list of enemies
    newGuy.setTarget(this.player); // Set target to player
  }

  enemyWave(multipliers, numberOfEnemies) {
    let GRID_SIZE = 20;
    let TILE_X_SIZE = 303;
    let TILE_Y_SIZE = 152;

    for (let i = 0; i < numberOfEnemies; i++) {

      let x = Phaser.Math.Between(-8, 9);
      let y = Phaser.Math.Between(-8, 9);

      // Transform the x and y grid coordinates to real isometric coordinates
      let realX = TILE_X_SIZE * (x + y) / 2;
      let realY = TILE_Y_SIZE * (x - y - 1 + GRID_SIZE) / 2;

      this.addEnemy(
        realX, realY,
        listOfClasses[Phaser.Math.Between(0, listOfClasses.length - 1)],
        multipliers
      )
    }

    // NEXT WAVE PREPARATION
    numberOfEnemies = 3 * this.waveNumber

    multipliers[0] += 3      // health
    multipliers[1] += 0       // movementSpeed
    multipliers[2] += 5       // attackDamage
    multipliers[3] += 0.1     // attackSpeed,
    multipliers[4] += 0       // range

    this.waveNumber ++
    this.time.delayedCall( // Next wave is called

      this.waveNumber * 10000, // delay before call 
      this.enemyWave, // function to call
      [ // arguments
        multipliers,
        numberOfEnemies
      ], this)
  }

}