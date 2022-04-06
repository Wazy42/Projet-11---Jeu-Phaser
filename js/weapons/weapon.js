import listeners from "../utils/listeners.js";

export default class Weapon extends Phaser.Physics.Arcade.Group {
  constructor(game, player) {
    super(game.physics.world, game);

    this.game = game;
    this.player = player;
    this.velocity = 300;

    this.bullets = [];
    this.blades = []
  }

  fireBullet() {
    var sprite = this.game.physics.add.sprite(this.player.sprite.x+this.player.sprite.width/2, this.player.sprite.y+this.player.sprite.height/2, 'Bullet');
    sprite.setSize(10, 10, true);
    let angle = Phaser.Math.Angle.Between(sprite.x, sprite.y, this.game.input.mousePointer.worldX, this.game.input.mousePointer.worldY);
    sprite.rotation = angle + 1.57079632679; // pi / 2 = 1.57079632679
    this.game.physics.velocityFromRotation(
      angle,
      this.velocity,
      sprite.body.velocity
    );
    this.bullets.push(sprite);
    this.game.time.delayedCall((this.player.range / this.velocity) * 1000, this.destroyBullet, [sprite], this);
    listeners.bulletFired += 1;
  }

  destroyBullet(sprite) {
    sprite.destroy()
    this.bullets.splice(this.bullets.indexOf(sprite), 1);
  }

  fireBlade() {
    var sprite = this.game.physics.add.sprite(this.player.sprite.x + this.player.sprite.width / 2, this.player.sprite.y + this.player.sprite.height / 2, 'Punch');
    sprite.setSize(10, 10, true);
    let angle = Phaser.Math.Angle.Between(sprite.x, sprite.y, this.game.input.mousePointer.worldX, this.game.input.mousePointer.worldY);
    sprite.rotation = angle + 1.57079632679; // pi / 2 = 1.57079632679
    this.game.physics.velocityFromRotation(
      angle,
      100,
      sprite.body.velocity
    );
    this.blades.push(sprite);
    this.game.time.delayedCall(200, this.destroyBlade, [sprite], this);
    listeners.punchFired += 1;
  }

  destroyBlade(sprite) {
    this.blades.splice(this.blades.indexOf(sprite), 1);
    sprite.destroy();
  }

  checkCollision(list) {
    list.forEach(element => {
      this.bullets.forEach(bullet => {
        if (Phaser.Geom.Intersects.RectangleToRectangle(bullet.getBounds(), element.sprite.getBounds())) {
          this.destroyBullet(bullet);
          element.getHurt(this.player.attackDamage);
          listeners.damageDealt += this.player.attackDamage;
          listeners.score += this.player.attackDamage;
        }
      });
      this.blades.forEach(blade => {
        if (Phaser.Geom.Intersects.RectangleToRectangle(blade.getBounds(), element.sprite.getBounds())) {
          element.getHurt(this.player.attackDamage*2);
          listeners.damageDealt += this.player.attackDamage*2;
          listeners.score += this.player.attackDamage*2;
        }
      });
    });
  }
}