import "phaser"
import logoImg from "../../assets/logo.png";
import buttonSpriteSheet from "../../assets/flixel-button.png"



export default class MenuScene extends Phaser.Scene {
    constructor() {
        super();
    }


    makeButton(name, index) {
        var button = this.add.image(680, 115 + index*40, 'button', 1).setInteractive();
        button.setData('index', index);
        button.setScale(2, 1.5);

        var text = this.add.bitmapText(button.x - 40, button.y - 8, 'nokia', name, 16);
        text.x += (button.width - text.width) / 2;
    }
    
    preload() {
        this.load.spritesheet('button', buttonSpriteSheet, {frameWidth: 60, frameHeight: 20});
        this.load.bitmapFont('nokia', 'assets/fonts/bitmap/nokia16black.png', 'assets/fonts/bitmap/nokia16black.xml');
    }

    create() {
        // const logo = this.add.image(400, 150, "logo");

        // this.tweens.add({
        //     targets: logo,
        //     y: 450,
        //     duration: 2000,
        //     ease: "Power2",
        //     yoyo: true,
        //     loop: -1
        // });
    }

};