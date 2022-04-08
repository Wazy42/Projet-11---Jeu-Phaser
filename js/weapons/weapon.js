export default class Weapon extends Phaser.Physics.Arcade.Group {
  constructor(game, holder) {
    super(game.physics.world, game);

    this.game = game;
    this.holder = holder;
    this.velocity = 300;

    this.bullets = [];
    this.blades = []
  }

  fireBullet(target) {
    var sprite = this.game.physics.add.sprite(this.holder.sprite.x, this.holder.sprite.y, 'Bullet');
    let angle = Phaser.Math.Angle.Between(sprite.x, sprite.y, target.x, target.y);
    sprite.rotation = angle + 1.57079632679; // pi / 2 = 1.57079632679
    this.game.physics.velocityFromRotation(
      angle,
      this.velocity,
      sprite.body.velocity
    );
    this.bullets.push(sprite);
    this.game.time.delayedCall((this.holder.range / this.velocity) * 1000, this.destroyBullet, [sprite], this);
  }

  destroyBullet(sprite) {
    this.bullets.splice(this.bullets.indexOf(sprite), 1);
    sprite.destroy()
  }

  fireBlade(target) {
    var sprite = this.game.physics.add.sprite(this.holder.sprite.x, this.holder.sprite.y, 'Punch');
    sprite.setSize(20, 20, true);
    let angle = Phaser.Math.Angle.Between(sprite.x, sprite.y, target.x, target.y);
    sprite.rotation = angle + 1.57079632679; // pi / 2 = 1.57079632679
    this.game.physics.velocityFromRotation(
      angle,
      300,
      sprite.body.velocity
    );
    this.blades.push(sprite);
    this.game.time.delayedCall(200, this.destroyBlade, [sprite], this);
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
          element.getHurt(this.holder.attackDamage);
        }
      });
      this.blades.forEach(blade => {
        if (Phaser.Geom.Intersects.RectangleToRectangle(blade.getBounds(), element.sprite.getBounds())) {
          this.destroyBlade(blade);
          element.getHurt(this.holder.attackDamage * 2);
        }
      });
    });
  }
}