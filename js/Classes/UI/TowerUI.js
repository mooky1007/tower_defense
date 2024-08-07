class TowerUI extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y);

        this.setPosition(scene.game.config.width / 2, scene.game.tile.height * 9);

        this.box = this.scene.add.rectangle(0, 0, 100, 100, 0x000000);
        this.box.setOrigin(0.5, 0.5);

        this.text = this.scene.add.text(0, 0, 'Hello, Phaser!', { fontSize: '20px', fill: '#fff' });
        this.text.setOrigin(0.5, 0.5);

        this.add(this.box);
        this.add(this.text);

        this.scene.add.existing(this);
    }
}

export default TowerUI;
