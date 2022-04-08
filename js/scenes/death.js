import listeners from "../utils/listeners.js";

export default class DeathScene extends Phaser.Scene {
    constructor() {
        super({ key: "DeathScene" });

        this.nameForm;
    }

    preload() {
        this.keyboardInput = this.input.keyboard.addKeys({
            space: Phaser.Input.Keyboard.KeyCodes.SPACE,
        })
        this.load.image('Title', 'assets/menus/Title.png');
        this.load.image('MapouLogo', 'assets/menus/mapouLogo.png');
    }

    create() {
        this.add.image(this.scale.gameSize.width / 2, this.scale.gameSize.height / 4, 'Title').setOrigin(0.5, 0.5).scale = 0.25;
        this.add.image(this.scale.gameSize.width - 5, this.scale.gameSize.height - 5, 'MapouLogo').setOrigin(1, 1).scale = 0.2;


        this.deathMessage = this.add.text(this.scale.gameSize.width / 2, this.scale.gameSize.width / 3)
            .setOrigin(0.5, 0.5)
            .setScrollFactor(0)
            .setFontSize(36)
            .setColor('#ffffff')
            .setText("YOU'RE DEAD, SO SAD :(");
        console.log(this.deathMessage);
        this.score = this.add.text(this.scale.gameSize.width / 2, this.deathMessage.y + this.deathMessage.height)
            .setOrigin(0.5, 0.5)
            .setScrollFactor(0)
            .setFontSize(26)
            .setColor('#ffffff')
            .setText('SCORE: ' + listeners.score);
        this.replay = this.add.text(this.scale.gameSize.width / 2, this.scale.gameSize.height / 1.5)
            .setOrigin(0.5, 0.5)
            .setScrollFactor(0)
            .setFontSize(46)
            .setColor('#ffffff')
            .setText('PRESS SPACE TO REPLAY');
    }

    update() {
        this.checkKeyboard();
    }

    checkKeyboard() {
        if (this.keyboardInput.space.isDown) {
            location.reload();
        }
    }
}