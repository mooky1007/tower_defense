import Monster from './GameObjects/Monster.js';

class Wave {
    constructor(scene, monsterCount) {
        this.maximumMonster = monsterCount;
        this.monsterCount = 0;

        this.spawnTimer = scene.time.addEvent({
            delay: 250, // 타이머의 주기 (1초)
            callback: () => {
                if (this.monsterCount < this.maximumMonster) {
                    this.monsterCount += 1;
                    new Monster(scene, 0, 0);
                } else {
                    this.spawnTimer.destroy();
                }
            },
            callbackScope: scene,
            loop: true,
        });
    }
}

export default Wave;
