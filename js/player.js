import Weapon from "./weapon.js";
export default class Player {
    constructor(game, posX, posY, name, health, movementSpeed, attackDamage, attackSpeed, tickets) {
        this.game = game;
        this.sprite = game.physics.add.sprite(posX, posY, 'player', 'walk-down/walk-down-3.png').setOrigin(0, 0).setImmovable();
        this.sprite.body.setSize(15, 25, 10, 10);
        this.cursors = game.input.keyboard.createCursorKeys();

        this.name = name;
        this.health = health;
        this.maxHealth = health;

        this.weapon = new Weapon(game, posX, posY)
        this.movementSpeed = movementSpeed;
        this.attackDamage = attackDamage;
        this.attackSpeed = attackSpeed;
        this.attackOnCD = 0;
        this.tickets = tickets;

        // HUD setup
        this.text = game.add.text(5, 5).setScrollFactor(0).setFontSize(16).setColor('#ffffff').setText(['HP: ' + this.health + '/' + this.maxHealth]);
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

    getHurt(damage) {
        this.health -= damage;
        this.text.setText([
            'HP: ' + this.health + '/' + this.maxHealth
        ])
    }

    isAlive() {
        if (this.health > 0) return 1;
        return 0;
    }

    checkKeyboard() {
        // Handle keyboard input (Arrows)
        var y = 0;
        var x = 0;

        if (this.cursors.up.isDown) {
            y -= 1;
            // Anim up
        }
        if (this.cursors.down.isDown) {
            y += 1;
            // Anim down
        }
        if (this.cursors.left.isDown) {
            x -= 1;
            // Anim left
        }
        if (this.cursors.right.isDown) {
            x += 1;
            // Anim right
        }

        

        this.sprite.body.setVelocity((this.movementSpeed - 50 * y * y) * x, (this.movementSpeed - 50 * x * x) * y);
    }


}
