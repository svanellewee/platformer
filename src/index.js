import Phaser from "phaser";
import TestScene from "./scenes/TestScene"
import DudeScene from "./scenes/DudeScene"

const config = {
  type: Phaser.WEBGL, //AUTO,
  parent: "phaser-example",
  width: 800 ,
  height: 600,
  physics : {
    default: 'arcade',
    arcade: {
      gravity : {y : 500},
      debug: true,
    },
  },
  input : {
    gamepad: true,
  },
  scale: {
    mode: Phaser.Scale.FIT,
    //  parent: 'phaser-example',
    autoCenter: Phaser.Scale.CENTER_BOTH,
    //width: 800,
    //height: 600
  },
  audio: {
    disableWebAudio: true
  }
};



class MainGame extends Phaser.Game {
  constructor() {
    super(config);
    
    this.scene.add('TestScene', TestScene);
    this.scene.add('DudeScene', DudeScene);
    this.scene.start('DudeScene')
  }
}


const game = new  MainGame(); //Phaser.Game(config);
