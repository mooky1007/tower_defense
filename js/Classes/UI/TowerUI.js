class TowerUI extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y);
        this.setVisible(false);

        this.setPosition(20, this.scene.game.tile.height * 8 + 20);
        this.setSize(this.scene.game.tile.width, this.scene.game.tile.height);

        const testButton = this.scene.add.container(scene);
        testButton.setSize(100, 30);
        testButton.setPosition(50, 15);

        const line = this.scene.add.graphics();
        line.fillStyle(0xffffff, 0.3);
        line.fillRect(-testButton.width/2, -testButton.height/2, testButton.width, testButton.height);

        const text = this.scene.add.text(-testButton.width/2, -testButton.height/2, 'summon', { fontSize: '13px', color: '#000' });
        testButton.add([line, text]);
        this.add(testButton);

        testButton.setInteractive();
        testButton.on('pointerdown', () => {
          this.scene.selectedZone.summon();
        });

        this.scene.add.existing(this);
    }

    update() {
        this.setVisible(this.scene.selectedZone);
    }
}

export default TowerUI;
