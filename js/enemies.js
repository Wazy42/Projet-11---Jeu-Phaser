const VIEW_DISTANCE = 300;

export default class Ennemy {
  constructor(game, posX, posY, classe, health, movementSpeed, attackDamage, attackSpeed, range) {
    this.sprite = game.physics.add.sprite(posX, posY, classe).setOrigin(0, 0);
    this.sprite.body.setSize(15, 30, 10, 10);

    this.classe = classe;
    this.health = health;
    this.maxHealth = health;
    this.movementSpeed = movementSpeed;
    this.attackDamage = attackDamage;
    this.attackSpeed = attackSpeed;
    this.range = range; // range (in pixels)
    this.attackOnCD = 0;
    this.ennemies = [];
  }

  setClasse(classe) {
    this.classe = classe;
  }

  setHealth(health) {
    this.health = health;
  }

  setMovementSpeed(movementSpeed) {
    this.movementSpeed = movementSpeed;
  }

  setAttackDamage(attackDamage) {
    this.attackDamage = attackDamage;
  }

  setAttackSpeed(attackSpeed) {
    this.attackSpeed = attackSpeed;
  }

  setRange(range) {
    this.range = range;
  }

  setTarget(target) {
    this.target = target;
  }

  getTargetedBy(ennemy) {
    this.ennemies.push(ennemy);
  }

  lossTargetFrom(ennemy) {
    this.ennemies.splice(this.ennemies.indexOf(ennemy), 1);
  }

  getHurt(damage) {
    this.health -= damage;
    console.log(this.health)
  }

  isAlive() {
    if (this.health > 0) return 1;
    return 0;
  }

  destroyItself() {
    this.setTarget(null);
    this.ennemies.forEach(ennemy => {
      ennemy.setTarget(null);
    });
    this.sprite.destroy();
  }

  updateIA(game) { // this function is called in the phaser update (main loop)
    /*
    The ennemy focus one target at a time, it goes straight to it
    */

    this.sprite.setVelocity(0, 0); // Idle animation ?

    if (Phaser.Math.Distance.BetweenPoints(this.sprite, this.target.sprite) > VIEW_DISTANCE) {
      this.target.lossTargetFrom(this);
      return;
    }

    this.target.getTargetedBy(this)
    if (Phaser.Math.Distance.BetweenPoints(this.sprite, this.target.sprite) > this.range)
      game.physics.moveToObject(this.sprite, this.target.sprite, this.movementSpeed);
    else {
      this.sprite.setVelocity(0, 0);
      if (!this.attackOnCD) {
        this.attackCooldown();
        game.time.delayedCall(1000 / this.attackSpeed, this.attackCooldown, [], this);
        this.attackTarget()
      }
    }
  }

  attackTarget() {
    this.target.getHurt(this.attackDamage);
    // add animation here
  }

  attackCooldown() {
    if (this.attackOnCD == 0)
      this.attackOnCD = 1;
    else
      this.attackOnCD = 0;
  }

}
