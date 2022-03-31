import Player from "./player.js";

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

var player;

class GameScene extends Phaser.Scene {
  constructor() {
    super();
  }

  preload() {
    // Load all images once to prevent lagging
    this.load.image('FloorTiles', 'assets/Tiles.png');
    this.load.tilemapTiledJSON('map', 'assets/maptest.json');
    this.load.atlas('player', 'assets/player.png', 'assets/player.json')
  }

  create() {
    // Import map (floor)
    var map = this.add.tilemap('map');
    var tileset = map.addTilesetImage('FloorTiles', 'FloorTiles');
    map.createLayer('FloorLayer', tileset);
    
    // Player and camera
    player = new Player(this, 0, 0, "Gustave", 100, 150, 6, 12, 3);
    this.cameras.main.startFollow(player.sprite, true);
  
  }

  update() {
    player.checkKeyboard();
  }

  // addImage(x, y, image) {
  //   // Transform the x and y grid coordinates to real isometrci coordinates
  //   let realX = TILE_X_SIZE * (x + y) / 2;
  //   let realY = TILE_Y_SIZE * (x - y - 1 + GRID_Y_SIZE) / 2;
  //   // Display the image to coordinates
  //   this.add.image(realX, realY, image).setOrigin(0,0);
  // }
}

const config = {
  type: Phaser.WEBGL,
  scale: { mode: Phaser.Scale.FIT },
  backgroundColor: '#ff9900',
  scene: [GameScene],
  physics: {
    default: 'arcade',
    arcade: {
        debug: false
    }
  }
}

const game = new Phaser.Game(config);
