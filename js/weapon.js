class Weapon {
    constructor(knife, shotgun){
        this.knife = knife;
        this.sprite = knife.physics.add.sprite(posX, posY, '').setOrigin(player);
        this.shotgun = shotgun;
        this.cursor = game.input.keyboard.createCursorKeys();
    }

    checkweapon() {
        if (this.cursor.A.isDown) {
            knife = new knife(this, posX , posY);
        }
    }
}