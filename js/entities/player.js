import Weapon from "../weapons/weapon.js"
import listeners from "../utils/listeners.js";

export default class Player {
    constructor(game, x, y) {
        this.game = game;
        this.sprite = game.physics.add.sprite(x, y, 'Player').setOrigin(0, 0).setImmovable();
        this.sprite.body.setSize(15, 25, 10, 10);
        this.cursors = game.input.keyboard.createCursorKeys();

        this.health = 100;
        this.maxHealth = 100;

        this.movementSpeed = 300;

        this.attackDamage = 1;
        this.attackSpeed = 1;

        this.primaryAttackOnCD = 0;
        this.secondaryAttackOnCD = 0;
        this.range = 300;

        this.rangeWeapon = new Weapon(this.game, this);

        this.ennemies = [];

        this.playerInput = game.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.Z,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.Q,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE,
        })
    }

    getTargetedBy(ennemy) {
        if (!this.ennemies.includes(ennemy)) {
            this.ennemies.push(ennemy);
        }
        this.game.updateHUD();
    }

    lossTargetFrom(ennemy) {
        if (this.ennemies.includes(ennemy)) {
            this.ennemies.splice(this.ennemies.indexOf(ennemy), 1);
        }
        this.game.updateHUD();
    }

    getHurt(damage) {
        this.health -= damage;
        this.game.updateHUD();
    }


    isAlive() {
        if (this.health > 0) return 1;
        return 0;
    }



    checkKeyboard() {
        // Handle keyboard input (Arrows)
        var y = 0;
        var x = 0;

        if (this.playerInput.up.isDown) { // UP
            y -= 1;
            // Anim up
        }
        if (this.playerInput.down.isDown) { // DOWN
            y += 1;
            // Anim down
        }
        if (this.playerInput.left.isDown) { // LEFT
            x -= 1;
            // Anim left
        }
        if (this.playerInput.right.isDown) { // RIGHT
            x += 1;
            // Anim right
        }

        if (this.playerInput.space.isDown) {
            console.log(listeners);
        }

        if (this.game.input.activePointer.isDown) {
            if (this.game.input.activePointer.rightButtonDown() && this.game.time.now > this.secondaryAttackOnCD) { // Right Click
                this.rangeWeapon.fireBullet();
                this.secondaryAttackOnCD = this.game.time.now + 1000 / this.attackSpeed;
            } else if (this.game.input.activePointer.leftButtonDown() && this.game.time.now > this.primaryAttackOnCD) { // Left Click
                this.rangeWeapon.fireBlade();
                this.primaryAttackOnCD = this.game.time.now + 1000 / this.attackSpeed;
            }
        }
        this.sprite.body.setVelocity((this.movementSpeed - 50 * y * y) * x, (this.movementSpeed - 50 * x * x) * y);
    }
}