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
        this.load.spritesheet('tower', 'assets/tower/1.png', {
            frameWidth: 70,
            frameHeight: 130,
        });

        this.load.image('projectile', 'assets/arrow.png');
        this.load.image('dirty01', 'assets/tileset/FieldsTile_30.png');
        this.load.image('dirty02', 'assets/tileset/FieldsTile_28.png');
        this.load.image('dirty03', 'assets/tileset/FieldsTile_32.png');
        this.load.image('dirty04', 'assets/tileset/FieldsTile_26.png');
        this.load.image('dirty05', 'assets/tileset/FieldsTile_10.png');
        this.load.image('dirty06', 'assets/tileset/FieldsTile_12.png');

        this.load.image('grass', 'assets/tileset/work_grass.png');

        this.load.image('grass01', 'assets/grass/1.png');
        this.load.image('grass02', 'assets/grass/2.png');
        this.load.image('grass03', 'assets/grass/3.png');
        this.load.image('grass04', 'assets/grass/4.png');
        this.load.image('grass05', 'assets/grass/5.png');
        this.load.image('grass06', 'assets/grass/6.png');

        this.load.image('swordman', 'assets/swordman.png');

        this.load.spritesheet('slime', 'assets/S_Walk.png', {
            frameWidth: 48,
            frameHeight: 48,
        });
        this.load.spritesheet('slime_death', 'assets/S_Death.png', {
            frameWidth: 48,
            frameHeight: 48,
        });
    }

    create() {
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
