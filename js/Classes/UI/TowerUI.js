class TowerUI extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y);

        this.setSize(scene.game.config.width - 40, scene.game.config.height);
        this.setPosition(20, scene.game.tile.height * 12 + 20);

        const cardCount = 4;
        const gap = 20;

        const totalGapSzie = gap * (cardCount - 1);
        const cardWidth = (scene.game.config.width - totalGapSzie - 40) / 4;

        const towerInfor = [
            {
                name: 'Normal',
                type: 'normal',
                range: 30,
                radius: 0,
                damage: 5,
                attackSpeed: 250,
                projectileSpeed: 300,
                gold: 25,
            },
            {
                name: 'Explosion',
                type: 'explosion',
                range: 30,
                radius: 30,
                damage: 5,
                attackSpeed: 250,
                projectileSpeed: 300,
                gold: 50,
            },
            {
                name: 'Fast',
                type: 'fase',
                range: 30,
                radius: 0,
                damage: 5,
                attackSpeed: 250,
                projectileSpeed: 300,
                gold: 100,
            },
            {
                name: 'Long',
                type: 'long',
                range: 30,
                radius: 0,
                damage: 5,
                attackSpeed: 250,
                projectileSpeed: 300,
                gold: 150,
            },
        ];

        for (let i = 0; i < cardCount; i++) {
            this.add(new InstallTowerButton(scene, cardWidth * i + gap * i, 0, cardWidth, 150, towerInfor[i]));
        }

        this.scene.add.existing(this);
    }
}

class InstallTowerButton extends Phaser.GameObjects.Container {
    constructor(scene, x, y, width, height, tower) {
        super(scene, x, y);
        this.setSize(width, height);
        this.setInteractive();
        this.scene.add.existing(this);

        this.setPosition(this.x + this.width / 2, this.y + this.height / 2);

        this.background = this.scene.add.rectangle(-this.width / 2, -this.height / 2, this.width, this.height, 0xffffff);
        this.background.setOrigin(0, 0);
        this.add(this.background);

        this.text = this.scene.add.text(-this.width / 2, -this.height / 2, `${tower.name} Tower`, { fontSize: 13, color: '#000000' });
        this.text2 = this.scene.add.text(-this.width / 2, -this.height / 2 + this.text.height, `${tower.gold}gold`, {fontSize: 13, color: '#000000' });
        this.add([this.text, this.text2]);
        this.text.setDepth(this.background.depth + 1);

        this.on(
            'pointerdown',
            () => {
                this.scene.zones
                    .getChildren()
                    .find((zone) => zone.state === 'selected')
                    .installTower(tower);
            },
            this
        );
    }
}

export default TowerUI;
