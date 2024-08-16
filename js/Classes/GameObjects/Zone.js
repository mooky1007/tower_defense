import Tower from './Tower.js';

class ZoneTile extends Phaser.GameObjects.Zone {
    constructor(scene, x, y) {
        super(scene, scene.game.tile.width * x, scene.game.tile.height * y, scene.game.tile.width, scene.game.tile.height);

        this.center = {
            x: this.x + scene.game.tile.width / 2,
            y: this.y + scene.game.tile.height + scene.game.tile.height / 2,
        };

        this.setPhysics();
        this.setObject();
        this.setInputs();

        this.init();
    }

    init() {}

    setObject() {
        this.setOrigin(0, 0);
    }

    setPhysics() {
        this.scene.physics.add.existing(this);
        this.body.immovable = true;
        this.body.allowGravity = false;
    }

    setInputs() {
        this.setInteractive();
        this.on('pointerdown', () => {
            const a = this.scene.add.graphics();
            a.fillStyle(0xff0000);
            a.fillCircle(this.center.x, this.center.y, 3);

            const b = this.scene.add.rectangle(this.center.x, this.center.y);
            this.scene.physics.add.existing(b);
            b.body.immovable = true;
            b.body.allowGravity = false;
            b.body.setCircle(10);
            b.setPosition(this.center.x, this.center.y)
        });
    }

    installTower(towerConfig) {
        console.log(towerConfig);
        if (this.isTower) return;
        if (this.scene.gold < 50) return;
        this.scene.gold -= 50;
        this.isTower = true;
        this.tower = new Tower(towerConfig, this.scene, this.x + this.width / 2, this.y + this.height / 2 + this.height, this);
        this.tower.setPosition(this.tower.x, this.tower.y - (this.tower.height - this.height) / 2);
        this.scene?.towerUI?.destroy();
    }

    update() {}
}

export default ZoneTile;
