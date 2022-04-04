import Player from "./player.js";
import Ennemy from "./enemies.js";


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
    this.load.atlas('Player', 'assets/player.png', 'assets/player.json')
    this.load.image('Zombie', 'assets/zombie.png');
    this.load.image('Archer', 'assets/archer.png');
    this.load.image('Bullet', 'assets/bullet.png');
    this.load.image('Punch', 'assets/punch.png');

  }

  create() {

    // Import map (floor)
    const map = this.add.tilemap('map');
    var tileset = map.addTilesetImage('FloorTiles');
    map.createLayer('FloorLayer', tileset);

    // Player and camera
    this.player = new Player(this, 150, 150, "Gustave", 100, 150, 6, 2);
    this.cameras.main.startFollow(this.player.sprite, true);

    // Ennemies
    for (let i = 0; i < 7; i++) { // Zombies
      var newGuy = new Ennemy(this, -150 + i * 50, 300, 'Zombie', 100, 100, 1, 1, 30);
      this.ennemies.forEach(ennemy => { // Add collisions with all enemies
        this.physics.add.collider(newGuy.sprite, ennemy.sprite);
      })
      this.ennemies.push(newGuy); // add to list of ennemies
    }
    for (let i = 0; i < 3; i++) { // Archers
      var newGuy = new Ennemy(this, -50 + i * 50, 400, 'Archer', 100, 75, 10, 0.3, 100);
      this.ennemies.forEach(ennemy => { // Add collisions with all enemies
        this.physics.add.collider(newGuy.sprite, ennemy.sprite);
      })
      this.ennemies.push(newGuy); // add to list of ennemies
    }
    this.ennemies.forEach(ennemy => { // Adding collision with and targetting the player
      ennemy.setTarget(this.player);
      this.physics.add.collider(ennemy.sprite, this.player.sprite);
    });

    // Disable option GUI on right click
    this.input.mouse.disableContextMenu();
  }

  update() {
    var pointer = this.input.activePointer;
    this.player.checkKeyboard();
    this.ennemies.forEach(ennemy => {
      ennemy.updateIA(this);
      if (!ennemy.isAlive) {
        ennemy.destroyItself();
        this.ennemies.splice(this.ennemies.indexOf(ennemy), 1);
        destroy(ennemy);

      }
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
