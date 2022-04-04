// class Bullet extends Phaser.Physics.Sprite {
//   constructor(game, x, y) {
//     super(game, x, y, 'bullet');
//   }
// }

export default class rangeWeapon extends Phaser.Physics.Arcade.Group {
  constructor(game, player, attackDamage, range, velocity) {
    super(game.physics.world, game);

    // this.createMultiple({
    //   classType: Bullet
    //   frameQuantity: 30,
    //   active: false,
    //   visible: false,
    //   key: 'bullet'
    // });

    this.game = game;
    this.player = player;
    this.attackDamage = attackDamage;
    this.range = range;
    this.velocity = velocity;

    this.bullets = [];
  }

  fireBullet() {
    var sprite = this.game.physics.add.sprite(this.player.x, this.player.y, 'Bullet').setOrigin(0, 0);
    sprite.body.setSize(15, 15, 5, 5);
    this.game.physics.velocityFromRotation(
      Phaser.Math.Angle.Between(sprite.x, sprite.y, this.game.input.mousePointer.worldX, this.game.input.mousePointer.worldY),
      this.velocity,
      sprite.body.velocity
    );
    this.bullets.push(sprite);
    // add sprite to bullet group
    this.game.time.delayedCall((this.range / this.velocity) * 1000, this.destroyBullet, [sprite], this);
  }

  destroyBullet(sprite) {
    this.bullets.splice(this.bullets.indexOf(sprite), 1);
    sprite.destroy();
  }

  // check collision
  // if (tapé) {
  //   entity.damage
  //}
}