import StartScene from "./scenes/start.js"
import GameScene from "./scenes/game.js"
import DeathScene from "./scenes/death.js";

const config = {
  type: Phaser.AUTO,
  scale: { mode: Phaser.Scale.FIT},
  backgroundColor: '#313131',
  scene: [StartScene, GameScene, DeathScene],
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  }
}

const game = new Phaser.Game(config);
