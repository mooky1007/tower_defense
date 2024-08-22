import GameScreen from './Classes/Screens/GameScreen.js';
import TopUI from './Classes/UI/TopUI.js';
import TowerUI from './Classes/UI/TowerUI.js';
import Wave from './Classes/Events/Wave.js';

class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.gold = 15;

        this.waveLevel = 0;
        this.monsterCount = 15;
        this.capacity = 4;
    }

    preload() {
        const defaultFontStyle = { fontFamily: 'mabi', fontSize: '14px', color: '#fff' };
        const frame64 = { frameWidth: 64, frameHeight: 64 };

        this.defaultFontStyle = defaultFontStyle;

        this.load.spritesheet('sword_man', 'assets/images/sword_man.png', frame64);
        this.load.spritesheet('sword_man2', 'assets/images/sword_man2.png', frame64);

        this.load.spritesheet('axe_man', 'assets/images/axe_man.png', frame64);
        this.load.spritesheet('axe_man2', 'assets/images/axe_man2.png', frame64);

        this.load.spritesheet('spear_man', 'assets/images/spear_man.png', frame64);
        this.load.spritesheet('spear_man2', 'assets/images/spear_man2.png', frame64);

        this.load.spritesheet('bow_man', 'assets/images/bow_man.png', frame64);
        this.load.spritesheet('bow_man2', 'assets/images/bow_man2.png', frame64);

        this.load.spritesheet('blackslime', 'assets/images/blackslime.png', frame64);

        this.load.spritesheet('supply', 'assets/images/supply.png', frame64);

        this.load.audio('bgm', 'assets/sounds/bgm.mp3');
        this.load.audio('swordSwipe', 'assets/sounds/slash-21834.mp3');

        this.load.image('bg', 'assets/images/grey_bottom.png');
        this.load.image('load', 'assets/images/grey_bottom2.png');
    }

    create() {
        const bgm = this.sound.add('bgm', {
            loop: true,
            volume: 1,
        });

        bgm.play();

        const { tile } = this.game;
        this.zones = this.add.group();
        this.towers = this.add.group();
        this.enemys = this.add.group();

        this.zones.runChildUpdate = true;
        this.towers.runChildUpdate = true;
        this.enemys.runChildUpdate = true;

        this.topUI = new TopUI(this);
        this.ui = new TowerUI(this);
        this.gameScreen = new GameScreen(this, 0, tile.height);

        this.physics.add.collider(this.enemys, this.zones);
        this.start();
    }

    start() {
        new Wave(this);
    }

    update() {
        this.gameScreen.update();
        this.topUI.update();
    }
}

export default MainScene;
