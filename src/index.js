import Phaser from "phaser";
import TestScene from "./scenes/TestScene"
import DudeScene from "./scenes/DudeScene"
import MenuScene from "./scenes/MenuScene"
import CreditsScene from "./scenes/CreditsScene"

const config = {
  type: Phaser.WEBGL, //AUTO,
  parent: "phaser-example",
  width: 800 ,
  height: 600,
  physics : {
    default: 'arcade',
    arcade: {
      gravity : {y : 500},
      debug: false,
    },
  },
  input : {
    gamepad: true,
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  audio: {
    disableWebAudio: true
  },
  pixelArt: true,
};



class MainGame extends Phaser.Game {
  constructor() {
    super(config);
    
    this.scene.add('TestScene', TestScene);
    this.scene.add('DudeScene', DudeScene);
    this.scene.add('MenuScene', MenuScene);
    this.scene.add('CreditsScene', CreditsScene);
    this.scene.start('MenuScene')
  }
}


const game = new  MainGame(); //Phaser.Game(config);
