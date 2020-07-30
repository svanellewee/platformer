import "phaser"
import buttonSpriteSheet from "../../assets/flixel-button.png"
import skyImg from '../../assets/sky.png';


const markers = [
    { name: 'back', nextScene: 'MenuScene', },
    { name: "Phaser!", nextScene: 'TestScene'},
];

function setButtonFrame(button, frame) {
    button.frame = button.scene.textures.getFrame('button', frame);
}



export default class CreditsScene extends Phaser.Scene {
    constructor() {
        super();
        this.initMessage = "Compiled by Stephan van Ellewee\nout of examples found in the\nPhaser community";
        this.currentOption = 0;
    }

    init(data) {
        if (typeof data !== 'undefined') {
           console.log(`data passed ${data.message}`);
           this.initMessage = data.message || this.initMessage;
        }
    }

    preload() {
        this.load.image('sky', skyImg);
        this.load.spritesheet('button', buttonSpriteSheet, {frameWidth: 80, frameHeight: 20});
        this.load.bitmapFont('nokia', 'assets/fonts/nokia16black.png', 'assets/fonts/nokia16black.xml');
    }

    create() {
        this.add.image(400, 300, 'sky');
        this.headerText = this.add.text(0, 16, this.initMessage, { fontSize: '32px', fill: '#fff' });
        markers.forEach((marker, index) =>{
            this.makeButton(marker, index)
        });
        this.buttons = markers.map((marker, index) => {
            return this.makeButton(marker, index);
        })

        this.input.on('gameobjectover', (pointer, button) => {
            setButtonFrame(button, 0);
        });

        this.input.on('gameobjectout', (pointer, button) => {
            setButtonFrame(button, 1);
        });

        this.input.on('gameobjectdown', (pointer, button) => {
            const index = button.getData('index');    
            setButtonFrame(button, 2);
            console.log(`index:::${index}`);
        }, this);

        this.input.on('gameobjectup', (pointer, button) => {
            setButtonFrame(button, 0);
            const nextScene = button.getData('nextScene');
            console.log(nextScene);
            this.scene.start(nextScene);
        });
    }

    update(time, delta) {
        let pad = this.input.gamepad.getPad(0);
        if (typeof pad === "undefined")  {
            return;
        }
        
        
        let axisV = 0;
        if (pad.axes.length > 0) {
            axisV = pad.axes[1].getValue();   
            //console.log('>>>',axisV);   
            if (time < (this.lastTime + 300)) {
                return;
            }    
        }

        if (this.currentOption === 0) {
            if(axisV > 0) {
                this.currentOption = 1;
            }
        } else if (this.currentOption === 1) {
            if(axisV < 0) {
                this.currentOption = 0;
            }
        }
        this.lastTime = time;

        if (axisV !== 0) {
            console.log("axisV = ", this.lastTime, axisV, markers[this.currentOption].name);
        }
        this.buttons.forEach((button, index) =>{
            if (this.currentOption === index) {
                setButtonFrame(button, 0);
            } else {
                setButtonFrame(button, 1);
            }
        });

        if (pad.A) {
            this.scene.start(markers[this.currentOption].nextScene);
        }
    }

    makeButton(buttonMeta, index) {
        const button = this.add.image(400,  300 + index*40, 'button', 1).setInteractive();
        button.setData('index', index);
        button.setData('nextScene', buttonMeta.nextScene);
        button.setScale(2, 1.5);

        const text = this.add.bitmapText(button.x - 40, button.y - 8, 'nokia', buttonMeta.name, 16);
        text.x += (button.width - text.width) / 2;
        return button;
    }
};