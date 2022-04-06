import Player from "../entities/player.js";
import Ennemy from "../entities/enemies.js";
import listeners from "../utils/listeners.js";

let baseStats = {
  'Melee': [
    4, // health
    100, // movementSpeed
    2, // attackDamage
    0.5, // attackSpeed5,
    30 // range
  ],
  'Range': [
    3, // health
    75, // movementSpeed
    3, // attackDamage
    0.3, // attackSpeed5,
    200 // range
  ]
}


//               (0, 1)
//           Y    /  \
//              /      \
//            /          \
//          /              \
// (0, 0) <                  > (1, 1)
//          \              /
//            \          /
//              \      /
//           X    \  /
//               (1, 0)

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({key: "GameScene"});
    this.player;
    this.ennemies = [];
    this.text;
  }

  preload() {
    // Load all images once to prevent lagging
    this.load.image('FloorTiles', 'map/Tiles.png');
    this.load.tilemapTiledJSON('map', 'map/maptest.json');
    this.load.image('Player', 'assets/entities/Player.png');
    this.load.image('Melee', 'assets/entities/clownMelee.png');
    this.load.image('Range', 'assets/entities/clownRanged.png');
    this.load.image('Bullet', 'assets/animation/bullet.png');
    this.load.image('Punch', 'assets/animation/punch.png');

  }

  create() {
    console.log(this);

    // Import map (floor)
    const map = this.add.tilemap('map');
    var tileset = map.addTilesetImage('FloorTiles');
    map.createLayer('FloorLayer', tileset);

    // Player and camera
    this.player = new Player(this, 150, 150);
    this.cameras.main.startFollow(this.player.sprite, true);

    // Ennemies
    this.addEnnemy(100, 200, 'Range');

    // Disable option GUI on right click
    this.input.mouse.disableContextMenu();


    // HUD setup
    this.leftText = this.add.text(5, 5).setScrollFactor(0).setFontSize(16).setColor('#ffffff')
    this.rightText = this.add.text(this.scale.canvasBounds.height, 5).setOrigin(1, 0).setScrollFactor(0).setFontSize(16).setColor('#ffffff')
  }

  update() {
    this.player.checkKeyboard();
    this.player.rangeWeapon.checkCollision(this.ennemies)
    this.ennemies.forEach(ennemy => {
      ennemy.updateIA(this);
      if (!ennemy.isAlive()) {
        ennemy.destroyItself();
        this.ennemies.splice(this.ennemies.indexOf(ennemy), 1);
        listeners.killCount += 1;
        listeners.score += 10;
      }
      if (!this.player.isAlive()) {
        // Afficher menu mort
      }
    });
    this.updateHUD();
  }

  updateHUD() {
    this.leftText.setText([
      'HP: ' + this.player.health + '/' + this.player.maxHealth,
      'Mobs attacking: ' + this.player.ennemies.length
    ]);
    this.rightText.setText([
      'SCORE: ' + listeners.score,
    ]);
  }

  addEnnemy(x, y, type) {
    var newGuy = new Ennemy(this, x, y, type, ...baseStats[type]);
    this.ennemies.forEach(ennemy => { // Add collisions with all enemies
      this.physics.add.collider(newGuy.sprite, ennemy.sprite);
    })
    this.physics.add.collider(newGuy.sprite, this.player.sprite); // add collisions with player

    this.ennemies.push(newGuy); // add to list of ennemies
    newGuy.setTarget(this.player); // Set target to player
  }
}