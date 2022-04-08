import Weapon from "../weapons/weapon.js"
import listeners from "../utils/listeners.js";
const VIEW_DISTANCE = 90000; // Distance in pixel (the enemy attack if the player is within this radius)

export default class Enemy {
  constructor(game, x, y, type, health, movementSpeed, attackDamage, attackSpeed, range) {
    this.game = game;
    this.sprite = game.physics.add.sprite(x, y, type).setPushable();

    this.health = health;
    this.movementSpeed = movementSpeed;
    this.attackDamage = attackDamage;
    this.attackSpeed = attackSpeed;
    this.range = range; // range (in pixels)
    this.attackOnCD = 0;
    this.weapon = new Weapon(this.game, this);

    this.enemies = [];
  }

  setTarget(target) {
    this.target = target;
  }

  getTargetedBy(enemy) {
    this.enemies.push(enemy);
  }

  lossTargetFrom(enemy) {
    this.enemies.splice(this.enemies.indexOf(enemy), 1);
  }
  
  getHurt(damage) {
    this.health -= damage;
    listeners.damageDealt += damage;
    listeners.score += damage;
  }

  isAlive() {
    if (this.health > 0) return 1;
    return 0;
  }

  destroyItself() {
    this.enemies.forEach(enemy => {
      enemy.setTarget(null);
    });
    this.sprite.destroy();
    this.target.lossTargetFrom(this);
  }

  updateIA(game) { // this function is called in the phaser update (main loop)
    /*
    The enemy focus one target at a time, it goes straight to it
    */

    this.sprite.setVelocity(0, 0);

    if (Phaser.Math.Distance.BetweenPoints(this.sprite, this.target.sprite) > VIEW_DISTANCE) {
      this.target.lossTargetFrom(this);
      return;
    }
    this.target.getTargetedBy(this)

    let distanceToTarget = Phaser.Math.Distance.BetweenPoints(this.sprite, this.target.sprite)
    game.physics.moveToObject(this.sprite, this.target.sprite, this.movementSpeed);
    if (this.sprite.body.velocity.x > 0)
      this.sprite.flipX = true;
    else
      this.sprite.flipX = false;

    if (distanceToTarget < this.range) {
      if (distanceToTarget < this.range * 0.8) this.sprite.setVelocity(0, 0); // Enemy stop when he reach 80% of his range
      if (!this.attackOnCD) {
        this.attackCooldown();
        game.time.delayedCall(1000 / this.attackSpeed, this.attackCooldown, [], this);
        this.attackTarget()
      }
    }
  }

  attackTarget() {
    if (this.range > 100) {
      this.weapon.fireBullet(this.target.sprite);
    } else {
      this.weapon.fireBlade(this.target.sprite);
    }
  }

  attackCooldown() {
    if (this.attackOnCD == 0)
      this.attackOnCD = 1;
    else
      this.attackOnCD = 0;
  }

}
