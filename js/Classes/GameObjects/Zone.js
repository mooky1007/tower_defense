import Tower from './Tower.js';
import TowerUI from '../UI/TowerUI.js';

class ZoneTile extends Phaser.GameObjects.Zone {
    constructor(scene, x, y, parent) {
        super(scene, scene.game.tile.width * x, scene.game.tile.height * y, scene.game.tile.width, scene.game.tile.height);
        this.parent = parent;
        this.center = {
            x: this.x + scene.game.tile.width / 2,
            y: this.y + scene.game.tile.height / 2,
        };

        this.setPhysics();
        this.setObject();
        this.setInputs();

        this.init();
    }

    init() {
        const a = this.scene.add.graphics();
        a.fillStyle(0xff0000);
        a.fillCircle(this.center.x, this.center.y, 3);
        a.lineStyle(1, 0xff0000);
        a.strokeRect(this.x, this.y, this.width, this.height);
        a.setVisible(false);

        this.parent.add(a);

        this.dot = a;
    }

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
            this.dot.setVisible(!this.dot.visible);
            if (this.dot.visible) {
              this.scene.towerUI = new TowerUI(this.scene, 0, 0);
            }else{
              this.scene.towerUI.destroy();
            }
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
