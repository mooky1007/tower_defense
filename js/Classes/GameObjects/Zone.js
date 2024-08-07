import Tower from './Tower.js';

class ZoneTile extends Phaser.GameObjects.Zone {
    constructor(scene, x, y) {
        super(scene, scene.game.tile.width * x, scene.game.tile.height * y, scene.game.tile.width, scene.game.tile.height);

        this.setPhysics();
        this.setObject();
        this.setInputs();
    }

    setObject() {
        this.setOrigin(0, 0);
    }

    setPhysics() {
        this.scene.physics.add.existing(this);

        this.body.allowGravity = false;
        this.body.setCollideWorldBounds(true);
    }

    setInputs() {
        this.setInteractive();
        this.on('pointerdown', () => {
            const tower = new Tower(this.scene, this.x + this.width / 2, this.y + this.height / 2);
            tower.setPosition(tower.x, tower.y - (tower.height - this.height) / 2);
        });
    }
}

export default ZoneTile;
