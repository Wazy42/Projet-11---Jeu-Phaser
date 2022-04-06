import StartScene from "./scenes/start.js"
import GameScene from "./scenes/game.js"

const config = {
  type: Phaser.WEBGL,
  scale: { mode: Phaser.Scale.FIT },
  backgroundColor: '#ff9900',
  scene: [GameScene, StartScene],
  physics: {
    default: 'arcade',
    arcade: {
      debug: true
    }
  }
}

var game = new Phaser.Game(config);
