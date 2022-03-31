export default class Player {
    constructor(game, posX, posY, name, health, movementSpeed, attackDamage, attackSpeed, tickets) {
        this.sprite = game.physics.add.sprite(posX, posY, 'player', 'walk-down/walk-down-3.png').setOrigin(0, 0);
        this.cursors = game.input.keyboard.createCursorKeys();

        this.name = name;
        this.health = health;
        this.movementSpeed = movementSpeed;
        this.attackDamage = attackDamage;
        this.attackSpeed = attackSpeed;
        this.tickets = tickets;
    }

    setName(name) {
        this.name = name;
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

    setTickets(tickets) {
        this.tickets = tickets;
    }

    checkKeyboard() {
        // Handle keyboard input (Arrows)
        var y = 0;
        var x = 0;
        

        if (this.cursors.up.isDown) {
            y = -1;
            // Anim up
        }
        else if (this.cursors.down.isDown) {
            y = 1;
            // Anim down
        }
        if (this.cursors.left.isDown) {
            x = -1;
            // Anim left
        }
        else if (this.cursors.right.isDown) {
            x = 1;
            // Anim right
        }

        this.sprite.body.setVelocityY((this.movementSpeed - 50 * x * x) * y);
        this.sprite.body.setVelocityX((this.movementSpeed - 50 * y * y) * x);
    }

}
