import DecoTile from './GameObjects/DecoTile.js';
import ZoneTile from './GameObjects/Zone.js';

class GameScreen extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y);
        const tile = scene.game.tile;

        this.setSize(tile.width * 11, tile.height * 11);
        this.setPosition(0, tile.height);
        this.setDepth(-10);

        this.createBackground();
        this.createGrass();

        this.createTowerZoneBox(3, 0, 6, 3);
        this.createTowerZoneBox(0, 1, 1, 5);
        this.createTowerZoneBox(2, 5, 9, 5);
        this.createTowerZoneBox(8, 1, 9, 4);
        this.createTowerZoneBox(6, 7, 10, 9);
        this.createTowerZoneBox(1, 9, 5, 9);
        this.createTowerZoneBox(0, 6, 4, 7);
        this.createTowerZoneBox(-1, 8, -1, 10);
        this.createTowerZoneBox(11, 0);
      

        this.scene.add.existing(this);
    }

    createBackground() {
        const background = this.scene.add.image(0, 0, 'background');
        background.setOrigin(0, 0);
        background.setDepth(-10);
        background.setPosition(0, 0);
        background.setDisplaySize(this.width, this.height);
        background.setTexture('grass');

        this.add(background);
    }

    createGrass() {
        const grassKey = (i, j) => `grass0${(i + j) % 2 === 0 ? Math.floor(Math.random() * 3 + 1) : Math.floor(Math.random() * 3 + 3)}`;

        for (let i = 0; i < 11; i++) {
            for (let j = 0; j < 11; j++) {
                this.add(new DecoTile(this.scene, i, j, grassKey(i, j), false));
            }
        }
    }

    createTowerZoneBox(x1, y1, x2 = x1, y2 = y1) {
        for (let i = y1; i <= y2; i++) {
            for (let j = x1; j <= x2; j++) {
                const zone = new ZoneTile(this.scene, j, i);
                this.add(zone);
                this.scene.zones.add(zone);
            }
        }
    }
}

export default GameScreen;
