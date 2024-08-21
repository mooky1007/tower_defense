import Monster from './GameObjects/Monster.js';

class Wave {
    constructor(scene, monsterCount) {
        this.maximumMonster = monsterCount;
        this.monsterCount = 0;
        this.waveLevel = scene.waveLevel;

        this.spawnTimer = scene.time.addEvent({
            delay: 250,
            callback: () => {
                if (this.monsterCount < this.maximumMonster) {
                    if (this.waveLevel > 0 && this.waveLevel % 5 === 0) {
                        this.monsterCount = this.maximumMonster;
                        new Monster(scene, 0, 0, this.waveLevel, 'boss');
                    } else {
                        this.monsterCount += 1;
                        new Monster(scene, 0, 0, this.waveLevel);
                    }
                } else {
                    scene.gameScreen.timer.start();
                    scene.waveLevel += 1;
                    this.spawnTimer.destroy();
                }
            },
            callbackScope: scene,
            loop: true,
        });
    }
}

export default Wave;
