import Tower from './Tower.js';

class ZoneTile extends Phaser.GameObjects.Zone {
    constructor(scene, x, y) {
        super(scene, scene.game.tile.width * x, scene.game.tile.height * y, scene.game.tile.width, scene.game.tile.height);

        this.isTower = false;

        this.state = 'normal';

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

        this.body.allowGravity = false;
        this.body.setCollideWorldBounds(true);
    }

    setInputs() {
        this.setInteractive();
        this.on(
            'pointerdown',
            () => {
                if (this.state === 'selected') {
                    if (this.isTower) {
                        this.tower.levelUp();
                        this.tower.update();
                    }
                } else {
                    this.scene.zones?.selected?.destroy();
                    this.scene.zones.getChildren().forEach((zone) => {
                        zone.state = 'normal';
                    });
                    this.state = 'selected';
                    this.update();
                }
            },
            this
        );

        this.on(
            'pointerover',
            function (pointer) {
                if (this.tower && this.tower.isReady && !this.tower.rangeArea.circle.visible) {
                    this.tower.rangeArea.circle.setVisible(true);
                }
            },
            this
        );

        this.on(
            'pointerout',
            function (pointer) {
                if (this.tower && this.tower.isReady && this.tower.rangeArea.circle.visible) {
                    this.tower.rangeArea.circle.setVisible(false);
                }
            },
            this
        );
    }

    installTower(type) {
        if (this.isTower) return;
        if (this.scene.gold < 50) {
            this.state = 'normal';
            this.update();
            return;
        }
        this.scene.gold -= 50;
        this.isTower = true;
        this.tower = new Tower(type, this.scene, this.x + this.width / 2, this.y + this.height / 2, this);
        this.tower.setPosition(this.tower.x, this.tower.y - (this.tower.height - this.height) / 2);
    }

    update() {
        if (this.state === 'selected') {
            this.scene.zones.selected = this.scene.add.rectangle(this.x, this.y, this.width, this.height, 0xffffff, 0.3);
            this.scene.zones.selected.setStrokeStyle(3, 0xffffff, 0.4);
            this.scene.zones.selected.setOrigin(0, 0);
        } else {
            this.scene.zones.selected.destroy();
        }
    }
}

export default ZoneTile;
