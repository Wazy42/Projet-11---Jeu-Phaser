class Ennemies {
    constructor(classe, health, movementSpeed, attackDamage, attackSpeed) {
        this.classe = classe;
        this.health = health;
        this.movementSpeed = movementSpeed;
        this.attackDamage = attackDamage;
        this.attackSpeed = attackSpeed;
        this.coin = coin;
    }

  

    setClasse(classe) {
        this.classe = classe;
    }
    getClasse() {
		return this.classe;
    }

    setHealth(health) {
        this.health = health;
    }
    getHealth() {
		return this.health;
    }

    setMovementSpeed(movementSpeed) {
        this.movementSpeed = movementSpeed;
    }
    getMovementSpeed() {
		return this.movementSpeed;
	}

    setAttackDamage(attackDamage) {
        this.attackDamage = attackDamage;
    }
	getAttackDamage() {
		return this.attackDamage;
	}

    setAttackSpeed(attackSpeed) {
        this.attackSpeed = attackSpeed;
    }
	getAttackSpeed() {
		return this.attackSpeed;
	}

    
}

class Direction{
    static UP = new Direction("up")
    static DOWN = new Direction("down")
    static LEFT = new Direction("left")
    static RIGHT = new Direction("right")


    constructor(direction){
        this.direction= direction
    }

    static randomDirection = (exclude = Direction) => {
        let newDirection = Phaser.Math.Between(0, 3)
        while (newDirection === exclude)
        {
            newDirection = Phaser.Math.Between(0, 3)
        }
    
        return newDirection
    }
    enemyFollows () {
        this.physics.moveToObject(this.enemy, this.player, 100);
    }
}

