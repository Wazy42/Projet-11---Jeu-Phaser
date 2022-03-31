import Player from "./player.js";
import Ennemy from "./enemies.js";

const SCREEN_X_SIZE = 1920;
const SCREEN_Y_SIZE = 1080;
const WORLD_X_SIZE = 5000;
const WORLD_Y_SIZE = 5000;


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

class GameScene extends Phaser.Scene {
  constructor() {
    super();
    this.player;
    this.ennemies = [];
  }

  preload() {
    // Load all images once to prevent lagging
    this.load.image('FloorTiles', 'assets/Tiles.png');
    this.load.tilemapTiledJSON('map', 'assets/maptest.json');
    this.load.atlas('player', 'assets/player.png', 'assets/player.json')
    this.load.image('zombie', 'assets/zombie.png');

  }

  create() {
    // Disable option GUI on right click
    this.input.mouse.disableContextMenu();

    // Import map (floor)
    const map = this.add.tilemap('map');
    const tileset = map.addTilesetImage('FloorTiles', 'FloorTiles');
    map.createLayer('FloorLayer', tileset);
    this.wallLayer = map.createLayer('WallLayer', tileset)

    // Player and camera
    this.player = new Player(this, 150, 150, "Gustave", 100, 150, 6, 12, 3);
    this.cameras.main.startFollow(this.player.sprite, true);

    // Ennemies
    for (let i = 0; i < 7; i++) {
      var newGuy = new Ennemy(this, -150+i*50, 300, 'Zombie', 100, 100, 1, 1, 30);
      newGuy.setTarget(this.player);
      
      this.ennemies.forEach(ennemy => { // Add collisions with all enemies
        this.physics.add.collider(newGuy.sprite, ennemy.sprite);
      })
      this.physics.add.collider(newGuy.sprite, this.player.sprite);
      this.ennemies.push(newGuy);
    }

    // Player Collision with world
    map.setCollisionBetween(1, 999, true, 'WallLayer');
    this.physics.world.addCollider(this.player.sprite, this.wallLayer)
    this.wallLayer.setCollisionByProperty({ collides: true });

    // debug config
    const debugGraphics = this.add.graphics().setAlpha(0.7)
	  this.wallLayer.renderDebug(debugGraphics, {
		tileColor: null,
		collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
		faceColor: new Phaser.Display.Color(40, 39, 37, 255)
    });
  }

  update() {
    this.player.checkKeyboard();
    this.ennemies.forEach(ennemy => {
      ennemy.updateIA(this)
      if (!this.player.isAlive()) {
        // Afficher menu mort
      }
    });
  }
}

const config = {
  type: Phaser.WEBGL,
  scale: { mode: Phaser.Scale.FIT },
  backgroundColor: '#ff9900',
  scene: [GameScene],
  physics: {
    default: 'arcade',
    arcade: {
      debug: true
    }
  }
}

var game = new Phaser.Game(config);
