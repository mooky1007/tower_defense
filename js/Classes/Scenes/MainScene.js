import Monster from '../GameObjects/Monster.js';
import GameScreen from '../GameScreen.js';
import Wave from '../Wave.js';

class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.gold = 100;

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

        this.load.image('grass', 'assets/grey_bottom.png');
        this.load.image('grass2', 'assets/grey_bottom2.png');
    }

    create() {
        const bgm = this.sound.add('bgm', {
            loop: true, // BGM을 반복 재생하도록 설정
            volume: 0.5, // 볼륨 조절 (0.0부터 1.0까지)
        });

        bgm.play();

        const { tile } = this.game;
        this.zones = this.add.group();
        this.towers = this.add.group();
        this.projectiles = this.add.group();
        this.enemys = this.add.group();

        this.zones.runChildUpdate = true;
        this.towers.runChildUpdate = true;
        this.projectiles.runChildUpdate = true;
        this.enemys.runChildUpdate = true;

        this.gameScreen = new GameScreen(this, 0, tile.height);

        this.physics.add.collider(this.enemys, this.zones);

        this.spawnWave();

        this.timeScale = 40;
    }

    spawnWave() {
        new Wave(this, 15);
    }

    update() {
        this.gameScreen.update();
    }
}

export default MainScene;
