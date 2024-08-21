class Timer {
    constructor(scene, second) {
        this.scene = scene;
        this.second = second;
        this.originSecond = second;

        this.text = scene.add.text(0, 0, `${this.scene.waveLevel + 1} Wave`, { color: '#fff', fontSize: '14px', fontFamily: 'mabi' });
        this.text.setStroke('x0000000', 4);
        this.text.setOrigin(0.5, 0.5);
        this.text.setPosition(scene.game.config.width / 2, scene.game.tile.height / 2 - 10);
    }

    start() {
        this.timer = this.scene.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true,
        });
    }

    updateTimer() {
        if (this.second === 0) {
            this.timer.destroy();
            this.second = this.originSecond;
            this.scene.spawnWave();
            this.text.text = `${this.scene.waveLevel + 1} Wave`;
            return;
        }
        this.second -= 1;
        this.text.text = `${Math.trunc(this.second / 60) <= 9 ? `0${Math.trunc(this.second / 60)}` : Math.trunc(this.second / 60)} : ${
            this.second % 60 <= 9 ? `0${this.second % 60}` : this.second % 60
        }`;

        if (this.scene.enemys.getChildren().length <= 0) {
            this.second = 0;
        }
    }
}

export default Timer;
