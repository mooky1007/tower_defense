class TowerUI extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y);

        this.setSize(scene.game.config.width - 40, scene.game.config.height);
        this.setPosition(20, scene.game.tile.height * 12 + 20);

        const cardCount = 4;
        const gap = 20;

        const totalGapSzie = gap * (cardCount - 1);
        const cardWidth = (scene.game.config.width - totalGapSzie - 40) / 4;

        for (let i = 0; i < cardCount; i++) {
            new InstallTowerButton(scene, cardWidth * i + gap * i, 0, cardWidth, 150, this);
        }

        this.scene.add.existing(this);
    }
}

class InstallTowerButton extends Phaser.GameObjects.Container {
    constructor(scene, x, y, width, height, parent) {
        super(scene, x, y);
        this.setSize(width, height);
        this.parent = parent;
        this.setInteractive();
        this.scene.add.existing(this);
        this.parent.add(this);

        this.setPosition(this.x + this.width / 2, this.y + this.height / 2);

        this.background = this.scene.add.rectangle(-this.width / 2, -this.height / 2, this.width, this.height, 0xffffff);
        this.background.setOrigin(0, 0);
        this.add(this.background);

        this.text = this.scene.add.text(-this.width / 2, -this.height / 2, 'hello ', { color: '#000000' });
        this.text2 = this.scene.add.text(-this.width / 2, -this.height / 2 + this.text.height, 'phaser', { color: '#000000' });
        this.add([this.text, this.text2]);
        this.text.setDepth(this.background.depth + 1);

        this.on(
            'pointerdown',
            () => {
                this.scene.zones
                    .getChildren()
                    .find((zone) => zone.state === 'selected')
                    .installTower('normal');
            },
            this
        );
    }
}

export default TowerUI;
