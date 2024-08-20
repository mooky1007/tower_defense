import DecoTile from './GameObjects/DecoTile.js';
import ZoneTile from './GameObjects/Zone.js';
import MonsterCount from './UI/MonsterCount.js';
import Timer from './UI/Timer.js';

class GameScreen extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y);
        const tile = scene.game.tile;

        this.setSize(tile.width * 7, tile.height * 7);
        this.setPosition(0, tile.height);
        this.setDepth(-10);

        this.createBackground();
        this.createTowerZoneBox(0, 1, 5, 2);
        this.createTowerZoneBox(1, 4, 6, 5);

        this.createLoadZoneBox('load', 0, 0, 6, 0);
        this.createLoadZoneBox('load', 6, 1, 6, 2);
        this.createLoadZoneBox('load', 0, 3, 6, 3);
        this.createLoadZoneBox('load', 0, 4, 0, 5);
        this.createLoadZoneBox('load', 0, 6, 6, 6);

        this.selectedZone = this.scene.add.graphics();
        this.add(this.selectedZone);

        this.topArea = this.scene.add.zone(0, this.scene.game.tile.height - 1, this.scene.game.config.width, 1);
        this.topArea.setOrigin(0, 0);
        this.scene.physics.add.existing(this.topArea);
        this.topArea.body.allowGravity = false;
        this.topArea.body.immovable = true;

        this.bottomArea = this.scene.add.zone(0, this.scene.game.tile.height * 8 + 1, this.scene.game.config.width, 1);
        this.bottomArea.setOrigin(0, 0);
        this.scene.physics.add.existing(this.bottomArea);
        this.bottomArea.body.allowGravity = false;
        this.bottomArea.body.immovable = true;

        this.leftArea = this.scene.add.zone(-1, this.scene.game.tile.height, 1, this.scene.game.tile.height * 7);
        this.leftArea.setOrigin(0, 0);
        this.scene.physics.add.existing(this.leftArea);
        this.leftArea.body.allowGravity = false;
        this.leftArea.body.immovable = true;

        this.rightArea = this.scene.add.zone(this.scene.game.tile.width * 7 + 1, this.scene.game.tile.height, 1, this.scene.game.tile.height * 6);
        this.rightArea.setOrigin(0, 0);
        this.scene.physics.add.existing(this.rightArea);
        this.rightArea.body.allowGravity = false;
        this.rightArea.body.immovable = true;

        this.scene.physics.add.collider(this.scene.enemys, this.topArea);
        this.scene.physics.add.collider(this.scene.enemys, this.bottomArea);
        this.scene.physics.add.collider(this.scene.enemys, this.leftArea);
        this.scene.physics.add.collider(this.scene.enemys, this.rightArea);
        this.scene.physics.add.collider(this.scene.projectiles, this.topArea, (projectile) => projectile.destroy());
        this.scene.physics.add.collider(this.scene.projectiles, this.bottomArea, (projectile) => projectile.destroy());

        // const axeMan = this.scene.add.sprite(tile.width * 6 + tile.width / 2, tile.height * 4 + tile.height / 2 - 15, 'axe_man');
        // axeMan.setDepth = 8;
        // axeMan.anims.create({
        //     key: 'idle',
        //     frames: axeMan.anims.generateFrameNumbers('axe_man', { start: 0, end: 3 }),
        //     frameRate: 6,
        //     repeat: -1, // 무한 반복을 의미
        // });

        // axeMan.anims.create({
        //     key: 'attack',
        //     frames: axeMan.anims.generateFrameNumbers('axe_man2', { start: 0, end: 4 }),
        //     frameRate: 12,
        //     repeat: 0, // 무한 반복을 의미
        // });
        // axeMan.play('idle');
        // axeMan.setSize(tile.width, tile.height);

        // const swMan = this.scene.add.sprite(tile.width * 5 + tile.width / 2, tile.height * 4 + tile.height / 2 - 15, 'sword_man');
        // swMan.setDepth = 8;
        // swMan.anims.create({
        //     key: 'idle',
        //     frames: swMan.anims.generateFrameNumbers('sword_man', { start: 0, end: 3 }),
        //     frameRate: 6,
        //     repeat: -1, // 무한 반복을 의미
        // });

        // swMan.anims.create({
        //     key: 'attack',
        //     frames: swMan.anims.generateFrameNumbers('sword_man2', { start: 0, end: 3 }),
        //     frameRate: 12,
        //     repeat: 0, // 무한 반복을 의미
        // });
        // swMan.play('idle');
        // swMan.setSize(tile.width, tile.height);

        this.timer = new Timer(scene, 10);
        this.monsterCount = new MonsterCount(scene);

        this.scene.add.existing(this);
    }

    createBackground() {
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 7; j++) {
                this.add(new DecoTile(this.scene, i, j, 'bg', false));
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
