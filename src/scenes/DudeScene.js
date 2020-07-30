import "phaser";
import dudeImg from '../../assets/dude.png';
import skyImg from '../../assets/sky.png';
import platformImg from '../../assets/platform.png';
import starImg from '../../assets/star.png';
import bombImg from '../../assets/bomb.png';

const platformSpecs = [
    {x: 400, y: 586, scale: 2},
    {x: 1200, y: 586, scale: 2},
    {x: 2000, y: 586, scale: 2},
    {x: 600, y: 400},
    {x: 50, y: 250},
    {x: 750, y: 220},
    {x: 2000, y: 400},
    {x: 1850, y: 350},
    {x: 1550, y: 220},
];

export default class DudeScene extends Phaser.Scene {
    /*
    Teleporters?
    Triple jump (power up?)
    Stronger control?
    */
    constructor(){
        super();
    }
    
    preload() {
        this.load.image('sky', skyImg);
        this.load.image('platform', platformImg);
        this.load.image('star', starImg);
        this.load.image('bomb', bombImg);
        this.load.image('jets', 'assets/particles/blue.png');
        this.load.spritesheet('dude', dudeImg, {
            frameWidth: 32,
            frameHeight: 48,
        });
        this.score = 0;
        this.gameOver = false;
        this.wave = 0;
        this.load.audioSprite('sfx', 'assets/soundeffects/fx_mixdown.json', [
            'assets/soundeffects/fx_mixdown.ogg',
            'assets/soundeffects/fx_mixdown.mp3'
        ]);
    }   
    
    createScene() {
        const platforms = this.physics.add.staticGroup();
        for (let {x, y, scale} of platformSpecs) {
            const curPlat = platforms.create(x, y, 'platform');
            if (typeof scale !== 'undefined') {
                curPlat.setScale(scale).refreshBody();
            } 
        }
        return platforms;
    }
    
    setupBombs(platforms, player) {
        const bombs = this.physics.add.group();
        this.physics.add.collider(bombs, platforms);
        this.physics.add.overlap(bombs, player, this.hitBomb, null, this);
        
        return bombs;
    }


    hitBomb (player, bomb) {
        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play('turn');
        this.gameOver = true;
        this.sound.playAudioSprite('sfx', 'death');
    }

    createPlayer(platforms) {
        const player = this.physics.add.sprite(600, 300, 'dude');
        player.setCollideWorldBounds(true);
        
        this.physics.add.collider(player, platforms);
        
        const animations = [
            {
                key: 'left',
                frameRate: 20,
                repeat: -1,
                frames: this.anims.generateFrameNumbers('dude', {start: 0, end: 3})
            },
            {
                key: 'turn',
                frameRate: 20,
                frames: [{key: 'dude', frame: 4}],
            },
            {
                key: 'right',
                frameRate: 20,
                repeat: -1,
                frames: this.anims.generateFrameNumbers('dude', {start: 5, end: 8}),
            },
        ];
            
        const animationObjects = animations.map(({key, frames, frameRate, repeat}) => {
                return this.anims.create({
                    key,
                    frames,
                    frameRate,
                    repeat,
                });
        });
            
        return player;
    }
        
    collectStar(player, star) {
            star.disableBody(true, true);
            this.sound.playAudioSprite('sfx', 'ping');
            this.score += 1;
            this.scoreText.setText('Score: ' + this.score);
    }
        
        
    create() {
        this.add.image(400, 300, 'sky');
        this.add.image(1200, 300, 'sky');
        this.add.image(2000, 300, 'sky');
        const platforms = this.createScene(); 
        this.player = this.createPlayer(platforms);
        this.bombs = this.setupBombs(platforms, this.player);
        var stars = this.physics.add.group({
            key: 'star',
            repeat: 30,
            setXY: { x: 12, y: 0, stepX: 70 }
        });
        
        stars.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });
        
        this.physics.add.collider(stars, platforms);
        
        this.physics.add.overlap(stars, this.player,this.collectStar, null, this);
        this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
        this.scoreText.setScrollFactor(0); // I want to see my score wherever I go..
        this.canDoubleJump = false;
        this.physics.world.setBounds(0, 0, 2400, 600);
        this.cameras.main.setBounds(0,0, 2400, 600)
        this.cameras.main.startFollow(this.player);
        this.cameras.main.followOffset.set(-100, 0);
        this.scale.startFullscreen();
    }

    createBombs(time) {
        if ((this.score > 10) && (this.score < 20) &&this.bombs.countActive() === 0) {
           for (let counter = 0; counter < 5; counter++) {
               const x = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
               const bomb = this.bombs.create(x, 16, 'bomb');
               bomb.setBounce(1);
               bomb.setCollideWorldBounds(true);
               bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
               bomb.time = time + 10000;
           }
        }

    }

    update(time) {
        if(this.gameOver)  {
            return;
        }

        this.createBombs(time);
        this.bombs.children.each((bomb) => {
            if (time > bomb.time) {
                bomb.disableBody(true, true);
             }
        });

        let pad = this.input.gamepad.getPad(0);
        if (typeof pad === "undefined")  {
            return;
        }
        
        if (pad.axes.length) {
            const axisH = pad.axes[0].getValue();
            let velocityX = 0;
            if (axisH < 0){
                this.player.anims.play('left', true);
                velocityX = -200;
            }  else if (axisH > 0){
                this.player.anims.play('right', true);
                velocityX = 200;
            } else{ 
                this.player.anims.play('turn');
                velocityX = 0;
            }
            

            if (pad.A) {
                velocityX = velocityX / 100;
                if (this.player.body.touching.down){
                    this.player.setVelocityY(-500);
                    this.canDoubleJump = true;
                    this.lastJumpTime = time;
                } else if (this.canDoubleJump && (time > this.lastJumpTime + 1000)) {
                    this.canDoubleJump = false;
                    this.player.setVelocityY(-550);
                }
            }
            this.player.setVelocityX(velocityX)
        }
    }
}