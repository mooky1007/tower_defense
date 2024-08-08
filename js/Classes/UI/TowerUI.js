class TowerUI extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y);

        this.setSize(scene.game.config.width, scene.game.config.height);
        this.setPosition(scene.game.tile.width * 2, scene.game.tile.height * 8 + 20);

        const cardCount = 4;
        const gap = 20;

        const totalGapSzie = gap * (cardCount - 1);
        const cardWidth = (scene.game.config.width - totalGapSzie - scene.game.tile.width * 4) / 4;

        this.box = new TowerButton(scene, 0, 0, cardWidth, 150, 0xff0000, 1, this);
        this.box2 = new TowerButton(scene, cardWidth + gap, 0, cardWidth, 150, 0xff0000, 1, this);
        this.box3 = new TowerButton(scene, cardWidth * 2 + gap * 2, 0, cardWidth, 150, 0xff0000, 1, this);
        this.box4 = new TowerButton(scene, cardWidth * 3 + gap * 3, 0, cardWidth, 150, 0xff0000, 1, this);

        this.add([this.box, this.box2, this.box3, this.box4]);

        this.box.addText('normal, 50');
        this.box2.addText('expolstion, 75');
        this.box3.addText('long, 100');
        this.box4.addText('fast, 25');

        this.box.on(
            'pointerdown',
            () => this.scene.zones
                .getChildren()
                .find((zone) => zone.state === 'selected')
                .installTower('normal'),
            this
        );

        this.box2.on(
            'pointerdown',
            () => this.scene.zones
                .getChildren()
                .find((zone) => zone.state === 'selected')
                .installTower('explosion'),
            this
        );

        this.box3.on(
          'pointerdown',
          () => this.scene.zones
              .getChildren()
              .find((zone) => zone.state === 'selected')
              .installTower('long'),
          this
      );

      this.box4.on(
        'pointerdown',
        () => this.scene.zones
            .getChildren()
            .find((zone) => zone.state === 'selected')
            .installTower('fase'),
        this
    );

        this.scene.add.existing(this);
    }
}

class TowerButton extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y, width, height, fillColor, alpha, parent) {
        super(scene, x, y, width, height, fillColor, alpha);
        this.setInteractive();
        this.parent = parent;
        this.scene.add.existing(this);
        this.setOrigin(0, 0);
    }

    addText(text) {
        this.scene.add.text(this.x + this.parent.x, this.y + this.parent.y, `${text}`, 0xffffff).setDepth(this.depth + 1);
    }
}

export default TowerUI;
