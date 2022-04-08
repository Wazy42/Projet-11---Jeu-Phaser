import Weapon from "../weapons/weapon.js"
import listeners from "../utils/listeners.js";

export default class Player {
    constructor(game, x, y) {
        this.game = game;
        this.sprite = game.physics.add.sprite(x, y, 'Player').setImmovable();
        this.cursors = game.input.keyboard.createCursorKeys();

        this.health = 100;
        this.maxHealth = 100;

        this.movementSpeed = 150;
        this.dashing = 0;
        this.stamina = 100;
        this.maxStamina = 100;
        this.staminaDashCost = 50;
        this.staminaCooldown = 0.25;

        this.attackDamage = 1;
        this.attackSpeed = 1;
        this.range = 300;

        this.primaryAttackOnCD = 0;
        this.secondaryAttackOnCD = 0;
        this.buyCooldown = 0;

        this.rangeWeapon = new Weapon(this.game, this);

        this.enemies = [];

        this.playerInput = game.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.Z,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.Q,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            shift: Phaser.Input.Keyboard.KeyCodes.SHIFT,
            /*SHOP CONTROLS*/
            one: Phaser.Input.Keyboard.KeyCodes.ONE,
            two: Phaser.Input.Keyboard.KeyCodes.TWO,
            three: Phaser.Input.Keyboard.KeyCodes.THREE,
            four: Phaser.Input.Keyboard.KeyCodes.FOUR
        })
    }
    
    getTargetedBy(enemy) {
        if (!this.enemies.includes(enemy)) {
            this.enemies.push(enemy);
        }
    }

    lossTargetFrom(enemy) {
        if (this.enemies.includes(enemy)) {
            this.enemies.splice(this.enemies.indexOf(enemy), 1);
        }
    }

    getHurt(damage) {
        this.health -= damage;
        if (this.stamina == this.maxStamina) {
            this.staminaCooldown = this.game.time.now + 2550;
        }
    }

    isAlive() {
        if (this.health > 0) return 1;
        return 0;
    }

    toggleDash() {
        this.dashing = 1 - this.dashing;
        this.movementSpeed += 200 * (this.dashing - 0.5) * 2;
        if (this.dashing) {
            this.game.time.delayedCall(500, this.toggleDash, [], this);
            this.staminaCooldown = this.game.time.now + 1200;
        }
    }


    checkKeyboard() { // Handle keyboard input

        if (!this.dashing) { // If dashing: we can't move in the dash
            var y = 0;
            var x = 0;

            if (this.playerInput.up.isDown) { // UP
                y -= 1;
            }
            else if (this.playerInput.down.isDown) { // DOWN
                y += 1;
            }
            if (this.playerInput.left.isDown) { // LEFT
                x -= 1;
                this.sprite.flipX = false;
            }
            else if (this.playerInput.right.isDown) { // RIGHT
                x += 1;
                this.sprite.flipX = true;
            }

            if (this.playerInput.shift.isDown) {
                if (this.sprite.body.velocity.x == 0 && this.sprite.body.velocity.y == 0) return;
                if (this.stamina >= this.staminaDashCost) {
                    this.stamina -= this.staminaDashCost;
                    this.toggleDash();
                }
            }

            this.sprite.body.setVelocity((this.movementSpeed - 50 * y * y) * x, (this.movementSpeed - 50 * x * x) * y);

        }

        if (this.game.input.activePointer.isDown) { // Mouse inputs
            let target = {
                x: this.game.input.mousePointer.worldX,
                y: this.game.input.mousePointer.worldY
            }

            if (this.game.input.activePointer.rightButtonDown() && this.game.time.now > this.secondaryAttackOnCD) { // Right Click
                this.rangeWeapon.fireBullet(target);
                this.secondaryAttackOnCD = this.game.time.now + 1000 / this.attackSpeed;
                listeners.punchFired += 1;

            } else if (this.game.input.activePointer.leftButtonDown() && this.game.time.now > this.primaryAttackOnCD) { // Left Click
                this.rangeWeapon.fireBlade(target);
                this.primaryAttackOnCD = this.game.time.now + 1000 / this.attackSpeed / 2;
                listeners.bulletFired += 1;
            }
        }

        if (this.game.time.now > this.buyCooldown) { // Shop keyboard
            [this.playerInput.one, this.playerInput.two, this.playerInput.three, this.playerInput.four].forEach((key, i) => {
                if (key.isDown && listeners.tickets >= listeners.shop[i].price) {
                    listeners.tickets -= listeners.shop[i].price;
                    listeners.shop[i].level += 1;
                    this.buyCooldown = this.game.time.now + 500;

                    if (i == 0) { // Health
                        this.health *= 1.5;
                        this.maxHealth *= 1.5;
                        listeners.shop[i].price *= 2;
                    }
                    if (i == 1) { // Attack Damage
                        this.attackDamage = 1 + this.attackDamage * 1.3;
                        listeners.shop[i].price *= 2;
                    }
                    if (i == 2) { // Attack Speed
                        this.attackSpeed += 0.4
                        listeners.shop[i].price += 10;
                    }
                    if (i == 3) { // Stamina consumption
                        this.staminaDashCost = 100 / (listeners.shop[3].level + 1);
                        listeners.shop[i].price *= 10;
                    }
                }
            });
        }
    }
}