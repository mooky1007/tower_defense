class Timer {
    constructor(scene, second) {
        this.scene = scene;
        this.second = second;

        this.timer = scene.time.addEvent({
            delay: 1000, // 타이머의 주기 (1초)
            callback: this.updateTimer,
            callbackScope: this,
            loop: true,
        });

        this.text = scene.add.text(
            0,
            0,
            `${Math.trunc(this.second / 60) < 9 ? `0${Math.trunc(this.second / 60)}` : Math.trunc(this.second / 60)} : ${
                this.second % 60 < 9 ? `0${this.second % 60}` : this.second % 60
            }`,
            { color: '#fff', fontSize: '14px', fontFamily: 'mabi' }
        );
        this.text.setOrigin(0.5, 0.5);
        this.text.setPosition(scene.game.config.width / 2, scene.game.tile.height / 2 - 10);
    }

    updateTimer() {
        if (this.second === 0) {
            this.second = 10;
            this.scene.spawnWave();
        }
        this.second -= 1;
        this.text.text = `${Math.trunc(this.second / 60) < 9 ? `0${Math.trunc(this.second / 60)}` : Math.trunc(this.second / 60)} : ${
            this.second % 60 < 9 ? `0${this.second % 60}` : this.second % 60
        }`;
    }
}

export default Timer;
