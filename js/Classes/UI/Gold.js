class Gold {
    constructor(scene) {
        this.scene = scene;

        this.text = scene.add.text(0, 0, `${scene.gold} gold`, { color: '#fff', fontSize: '10px', fontFamily: 'mabi' });
        this.text.setStroke('x0000000', 4);
        this.text.setOrigin(0.5, 0.5);
        this.text.setPosition(scene.game.config.width - this.text.width, scene.game.tile.height / 2 + 10);
    }

    update() {
        this.text.text = `${this.scene.gold} gold`;
    }
}

export default Gold;
