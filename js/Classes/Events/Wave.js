import Monster from '../GameObjects/Monster.js';

class Wave {
    constructor(scene, monsterCount) {
        this.scene = scene;
        this.maximumMonster = monsterCount || this.scene.monsterCount;

        this.scene.nextWaveTime = 5;
        this.waveTimer = this.scene.time.addEvent({
            delay: 1000,
            callback: () => {
                this.scene.nextWaveTime -= 1;
                if (this.scene.nextWaveTime <= 0) {
                    this.start();
                }
            },
            loop: true,
        });
    }

    start() {
        this.waveTimer.destroy();
        this.monsterCount = 0;

        const max = this.maximumMonster;

        this.spawnTimer = this.scene.time.addEvent({
            delay: 5000/max,
            callback: () => {
                if (this.monsterCount < this.maximumMonster) {
                    this.monsterCount += 1;
                    new Monster(this.scene, 0, 0, this.scene.waveLevel);
                } else {
                    this.spawnTimer.destroy();
                }
            },
            loop: true,
        });

        this.spawnWaveTimer = this.scene.time.addEvent({
            delay: this.maximumMonster * 250 + 500,
            callback: () => {
                this.scene.waveLevel += 1;
                this.nextWave();
                this.spawnWaveTimer.destroy();
            },
        });
    }

    pause() {}

    nextWave() {
        this.scene.nextWaveTime = 10;
        this.waveTimer = this.scene.time.addEvent({
            delay: 1000,
            callback: () => {
                if (this.scene.enemys.getChildren().length === 0) {
                    this.scene.gold += this.scene.nextWaveTime * (this.scene.waveLevel + 1);
                    this.scene.nextWaveTime = 0;
                } else {
                    this.scene.nextWaveTime -= 1;
                }

                if (this.scene.nextWaveTime <= 0) {
                    this.start();
                }
            },
            loop: true,
        });
    }
}

export default Wave;
