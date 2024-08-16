import DecoTile from './GameObjects/DecoTile.js';
import ZoneTile from './GameObjects/Zone.js';
import MonsterCount from './UI/MonsterCount.js';
import Timer from './UI/Timer.js';

class GameScreen extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y);
        const tile = scene.game.tile;

        this.setSize(tile.width * 11, tile.height * 11);
        this.setPosition(0, tile.height);
        this.setDepth(-10);

        this.createBackground();

        this.createTowerZoneBox(3, 0, 6, 3);
        this.createTowerZoneBox(0, 1, 1, 5);
        this.createTowerZoneBox(2, 5, 9, 5);
        this.createTowerZoneBox(8, 1, 9, 4);
        this.createTowerZoneBox(6, 7, 10, 9);
        this.createTowerZoneBox(1, 9, 5, 9);
        this.createTowerZoneBox(0, 6, 4, 7);
        this.createTowerZoneBox(-1, 8, -1, 10);
        this.createTowerZoneBox(11, 0);

        this.createLoadZoneBox('grass2', 0, 0, 1, 0);
        this.createLoadZoneBox('grass2', 3, 4, 6, 4);
        this.createLoadZoneBox('grass2', 8, 0, 9, 0);
        this.createLoadZoneBox('grass2', 6, 6, 9, 6);
        this.createLoadZoneBox('grass2', 1, 8, 4, 8);
        this.createLoadZoneBox('grass2', 1, 10, 10, 10);
        this.createLoadZoneBox('grass2', 7, 4, 7, 4);
        this.createLoadZoneBox('grass2', 10, 6, 10, 6);
        this.createLoadZoneBox('grass2', 5, 8, 5, 8);
        this.createLoadZoneBox('grass2', 2, 1, 2, 3);
        this.createLoadZoneBox('grass2', 7, 1, 7, 3);
        this.createLoadZoneBox('grass2', 10, 1, 10, 5);
        this.createLoadZoneBox('grass2', 5, 7, 5, 7);
        this.createLoadZoneBox('grass2', 0, 9, 0, 9);
        this.createLoadZoneBox('grass2', 2, 4);
        this.createLoadZoneBox('grass2', 0, 10);
        this.createLoadZoneBox('grass2', 0, 8);
        this.createLoadZoneBox('grass2', 5, 6);
        this.createLoadZoneBox('grass2', 7, 0);
        this.createLoadZoneBox('grass2', 2, 0);
        this.createLoadZoneBox('grass2', 10, 0);

        this.selectedZone = this.scene.add.graphics();
        this.add(this.selectedZone);

        this.topArea = this.scene.add.zone(0, this.scene.game.tile.height - 1, this.scene.game.config.width, 1);
        this.topArea.setOrigin(0, 0);
        this.scene.physics.add.existing(this.topArea);
        this.topArea.body.allowGravity = false;
        this.topArea.body.immovable = true;

        this.bottomArea = this.scene.add.zone(0, this.scene.game.tile.height * 12, this.scene.game.config.width, 1);
        this.bottomArea.setOrigin(0, 0);
        this.scene.physics.add.existing(this.bottomArea);
        this.bottomArea.body.allowGravity = false;
        this.bottomArea.body.immovable = true;

        this.scene.physics.add.collider(this.scene.enemys, this.topArea);
        this.scene.physics.add.collider(this.scene.enemys, this.bottomArea);
        this.scene.physics.add.collider(this.scene.projectiles, this.topArea, (projectile) => projectile.destroy());
        this.scene.physics.add.collider(this.scene.projectiles, this.bottomArea, (projectile) => projectile.destroy());

        const axeMan = this.scene.add.sprite(tile.width * 6 + tile.width / 2, tile.height * 4 + tile.height / 2 - 15, 'axe_man');
        axeMan.setDepth = 8;
        axeMan.anims.create({
            key: 'idle',
            frames: axeMan.anims.generateFrameNumbers('axe_man', { start: 0, end: 3 }),
            frameRate: 6,
            repeat: -1, // 무한 반복을 의미
        });

        axeMan.anims.create({
            key: 'attack',
            frames: axeMan.anims.generateFrameNumbers('axe_man2', { start: 0, end: 4 }),
            frameRate: 12,
            repeat: 0, // 무한 반복을 의미
        });
        axeMan.play('idle');
        axeMan.setSize(tile.width, tile.height);

        const swMan = this.scene.add.sprite(tile.width * 5 + tile.width / 2, tile.height * 4 + tile.height / 2 - 15, 'sword_man');
        swMan.setDepth = 8;
        swMan.anims.create({
            key: 'idle',
            frames: swMan.anims.generateFrameNumbers('sword_man', { start: 0, end: 3 }),
            frameRate: 6,
            repeat: -1, // 무한 반복을 의미
        });

        swMan.anims.create({
            key: 'attack',
            frames: swMan.anims.generateFrameNumbers('sword_man2', { start: 0, end: 3 }),
            frameRate: 12,
            repeat: 0, // 무한 반복을 의미
        });
        swMan.play('idle');
        swMan.setSize(tile.width, tile.height);

        this.timer = new Timer(scene, 90);
        this.monsterCount = new MonsterCount(scene);

        this.scene.add.existing(this);
    }

    createBackground() {
        for (let i = 0; i < 11; i++) {
            for (let j = 0; j < 11; j++) {
                this.add(new DecoTile(this.scene, i, j, 'grass', false));
            }
        }
    }

    createTowerZoneBox(x1, y1, x2 = x1, y2 = y1) {
        for (let i = y1; i <= y2; i++) {
            for (let j = x1; j <= x2; j++) {
                const zone = new ZoneTile(this.scene, j, i, this);
                this.add(zone);
                this.scene.zones.add(zone);
            }
        }
    }

    createLoadZoneBox(name, x1, y1, x2 = x1, y2 = y1) {
        for (let i = y1; i <= y2; i++) {
            for (let j = x1; j <= x2; j++) {
                this.add(new DecoTile(this.scene, j, i, name, true, this));
            }
        }
    }

    update() {
        this.getAll('name', 'monster').forEach((monster) => monster.update());
        this.scene.gameScreen.monsterCount.update();
    }
}

export default GameScreen;
