import Monster from '../GameObjects/Monster.js';
import GameScreen from '../GameScreen.js';
import TowerUI from '../UI/TowerUI.js';
import Wave from '../Wave.js';

class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.gold = 30;

        this.level = 0;
    }

    preload() {
        const frame64 = { frameWidth: 64, frameHeight: 64 };

        this.load.spritesheet('axe_man', 'assets/axe_man.png', frame64);
        this.load.spritesheet('axe_man2', 'assets/axe_man2.png', frame64);
        this.load.spritesheet('sword_man', 'assets/sword_man.png', frame64);
        this.load.spritesheet('sword_man2', 'assets/sword_man2.png', frame64);
        this.load.spritesheet('blackslime', 'assets/blackslime.png', frame64);

        this.load.audio('bgm', 'assets/bgm.mp3');
        this.load.audio('swordSwipe', 'assets/slash-21834.mp3');

        this.load.image('bg', 'assets/grey_bottom.png');
        this.load.image('load', 'assets/grey_bottom2.png');
    }

    create() {
        const bgm = this.sound.add('bgm', {
            loop: true,
            volume: 1,
        });

        bgm.play();

        this.swordSwipeSound = this.sound.add('swordSwipe', {
            volume: 0.3,
        });

        const { tile } = this.game;
        this.zones = this.add.group();
        this.towers = this.add.group();
        this.projectiles = this.add.group();
        this.enemys = this.add.group();

        this.zones.runChildUpdate = true;
        this.towers.runChildUpdate = true;
        this.projectiles.runChildUpdate = true;
        this.enemys.runChildUpdate = true;

        this.ui = new TowerUI(this);
        this.gameScreen = new GameScreen(this, 0, tile.height);

        this.physics.add.collider(this.enemys, this.zones);

        this.spawnWave();
    }

    spawnWave() {
        new Wave(this, 45);
    }

    update() {
        this.gameScreen.update();
    }
}

export default MainScene;
