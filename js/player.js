import rangeWeapon from "./rangeWeapon.js"
// import { fire } from "./bullet.js";
export default class Player {
    constructor(game, posX, posY, name, health, movementSpeed, attackDamage, attackSpeed) {
        this.game = game;
        this.sprite = game.physics.add.sprite(posX, posY, 'Player', 'walk-down/walk-down-3.png').setOrigin(0, 0).setImmovable();
        this.sprite.body.setSize(15, 25, 10, 10);
        this.cursors = game.input.keyboard.createCursorKeys();

        this.name = name;
        this.health = health;
        this.maxHealth = health;

        this.movementSpeed = movementSpeed;
        this.attackDamage = attackDamage;
        this.attackSpeed = attackSpeed;
        this.PrimaryAttackOnCD = 0;
        this.secondaryAttackOnCD = 0;
        this.range = 400;

        this.rangeWeapon = new rangeWeapon(this.game, this.sprite, this.attackDamage, this.range, 300); 

        this.ennemies = [];

        // HUD setup
        this.text = game.add.text(5, 5).setScrollFactor(0).setFontSize(16).setColor('#ffffff').setText([
            'HP: ' + this.health + '/' + this.maxHealth,
            'Mobs attacking: ' + this.ennemies.length
        ]);
    }

    setName(name) {
        this.name = name;
    }

    setMaxHealth(health) {
        this.maxHealth = health;
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

    setTickets(tickets) {
        this.tickets = tickets;
    }

    updateHUD() {
        this.text.setText([
            'HP: ' + this.health + '/' + this.maxHealth,
            'Mobs attacking: ' + this.ennemies.length
        ]);
    }

    getTargetedBy(ennemy) {
        if (!this.ennemies.includes(ennemy)) {
            this.ennemies.push(ennemy);
        }
        this.updateHUD();
    }

    lossTargetFrom(ennemy) {
        if (this.ennemies.includes(ennemy)) {
            this.ennemies.splice(this.ennemies.indexOf(ennemy), 1);
        }
        this.updateHUD();
    }

    getHurt(damage) {
        this.health -= damage;
        this.updateHUD();
    }


    isAlive() {
        if (this.health > 0) return 1;
        return 0;
    }



    checkKeyboard() {
        // Handle keyboard input (Arrows)
        var y = 0;
        var x = 0;

        if (this.cursors.up.isDown) { // UP
            y -= 1;
            // Anim up
        }
        if (this.cursors.down.isDown) { // DOWN
            y += 1;
            // Anim down
        }
        if (this.cursors.left.isDown) { // LEFT
            x -= 1;
            // Anim left
        }
        if (this.cursors.right.isDown) { // RIGHT
            x += 1;
            // Anim right
        }

        if (this.game.input.activePointer.isDown) {
            if (this.game.input.activePointer.rightButtonDown() && this.game.time.now > this.secondaryAttackOnCD) { // Right Click
                this.rangeWeapon.fireBullet(this.game, this.sprite, this.attackDamage, this.range, 300);
                this.secondaryAttackOnCD = this.game.time.now + 1000/this.attackSpeed;
            } else if (this.game.input.activePointer.leftButtonDown() && this.game.time.now > this.primaryAttackOnCD) { // Left Click
                // Blade
                this.primaryAttackOnCD = this.game.time.now + 1000/this.attackSpeed;
            }
        }
        this.sprite.body.setVelocity((this.movementSpeed - 50 * y * y) * x, (this.movementSpeed - 50 * x * x) * y);
    }
}