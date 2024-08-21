import AxeShadow from './Shadows/AxeShadow.js';
import SwordShadow from './Shadows/SwordShadow.js';

class ZoneTile extends Phaser.GameObjects.Zone {
    constructor(scene, x, y, parent) {
        super(scene, scene.game.tile.width * x, scene.game.tile.height * y, scene.game.tile.width, scene.game.tile.height);
        this.parent = parent;
        this.center = {
            x: this.x + scene.game.tile.width / 2,
            y: this.y + scene.game.tile.height / 2,
        };

        this.selected = false;

        this.setPhysics();
        this.setObject();
        this.setInputs();

        this.init();
    }

    init() {
        const a = this.scene.add.graphics();
        a.fillStyle(0xffffff, 0.05);
        a.fillRect(this.x, this.y, this.width, this.height);
        a.setDepth(this.depth + 3);
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
            if (this.scene.selectedZone === this) this.scene.selectedZone = null;
            else this.scene.selectedZone = this;

            this.scene.ui.update();
        });
    }

    summon(shadow) {
        if (this.shadow) return;
        if (shadow.checkGold()) return;
        if(this.scene.zones.getChildren().filter(el => el.shadow).length >= this.scene.applyShadow) return;

        this.scene.gold -= shadow.price;

        shadow.create();
        this.shadow = shadow;

        this.parent.add(this.shadow.sprite);
        this.parent.add(this.shadow.radiusArea);
    }

    update() {
        this.dot.setVisible(this.scene.selectedZone === this);
    }
}

export default ZoneTile;
