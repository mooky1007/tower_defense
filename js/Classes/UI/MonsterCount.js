class MonsterCount {
    constructor(scene) {
        this.scene = scene;

        this.text = scene.add.text(0, 0, `${scene.enemys.getChildren().length}/60`, { color: '#fff', fontSize: '14px', fontFamily: 'mabi' });
        this.text.setOrigin(0.5, 0.5);
        this.text.setPosition(scene.game.config.width / 2, scene.game.tile.height / 2 + 10);
    }

    update() {
        this.text.text = `${this.scene.enemys.getChildren().length}/60`;
        this.text.setStyle({ color: this.scene.enemys.getChildren().length > 50 ? 'red' : '#fff' });
    }
}

export default MonsterCount;
