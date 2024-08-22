import DecoTile from '../GameObjects/DecoTile.js';
import ZoneTile from '../GameObjects/Zone.js';

class GameScreen extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y);
        const tile = scene.game.tile;

        this.setSize(tile.width * scene.game.tileSize[0], tile.height * scene.game.tileSize[1]);
        this.setPosition(0, tile.height);
        this.setDepth(-10);

        this.createBackground();
        this.createTowerZoneBox(0, 1, 6, 2);
        this.createTowerZoneBox(1, 4, 8, 5);
        this.createTowerZoneBox(8, 0, 8, 3);
        this.createTowerZoneBox(7, 6, 8, 7);
        this.createTowerZoneBox(0, 7, 5, 8);

        this.createLoadZoneBox('load', 0, 0, 7, 0);
        this.createLoadZoneBox('load', 7, 1, 7, 3);
        this.createLoadZoneBox('load', 0, 3, 6, 3);
        this.createLoadZoneBox('load', 0, 4, 0, 5);
        this.createLoadZoneBox('load', 0, 6, 6, 6);
        this.createLoadZoneBox('load', 6, 7, 6, 8);
        this.createLoadZoneBox('load', 7, 8, 8, 8);

        this.selectedZone = this.scene.add.graphics();
        this.add(this.selectedZone);

        this.topArea = this.scene.add.zone(0, this.scene.game.tile.height - 1, this.scene.game.config.width, 1);
        this.topArea.setOrigin(0, 0);
        this.scene.physics.add.existing(this.topArea);
        this.topArea.body.allowGravity = false;
        this.topArea.body.immovable = true;

        this.bottomArea = this.scene.add.zone(0, this.scene.game.tile.height * (scene.game.tileSize[1] - 4) + 1, this.scene.game.config.width, 1);
        this.bottomArea.setOrigin(0, 0);
        this.scene.physics.add.existing(this.bottomArea);
        this.bottomArea.body.allowGravity = false;
        this.bottomArea.body.immovable = true;

        this.leftArea = this.scene.add.zone(-1, this.scene.game.tile.height, 1, this.scene.game.tile.height * (scene.game.tileSize[0] - 1));
        this.leftArea.setOrigin(0, 0);
        this.scene.physics.add.existing(this.leftArea);
        this.leftArea.body.allowGravity = false;
        this.leftArea.body.immovable = true;

        this.scene.physics.add.collider(this.scene.enemys, this.topArea);
        this.scene.physics.add.collider(this.scene.enemys, this.bottomArea);
        this.scene.physics.add.collider(this.scene.enemys, this.leftArea);

        // this.timer = new Timer(scene, 30);
        // this.monsterCount = new MonsterCount(scene);
        // this.goldCount = new Gold(scene);

        this.scene.add.existing(this);
    }

    createBackground() {
        for (let i = 0; i < this.scene.game.tileSize[0]; i++) {
            for (let j = 0; j < this.scene.game.tileSize[0]; j++) {
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
    }
}

export default GameScreen;
