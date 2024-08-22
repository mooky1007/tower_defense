import Shadow from './Shadow.js';

class AxeShadow extends Shadow {
    constructor(parent) {
        super(parent);

        this.name = 'Axe';
        this.price = 15;

        this.spriteOffsetY = -15;
        this.idleSpriteKey = 'axe_man';
        this.idleFrame = [0, 3];

        this.attackSpriteKey = 'axe_man2';
        this.attackFrame = [0, 3];
        this.attckFramRate = 18;

        this.attackType = 'instantHitRadius';

        this.level = 1;
        this.price = 15;
        this.damage = [2, 3];
        this.radius = [this.parent.scene.game.tile.width * 2, this.parent.scene.game.tile.width * 2];
        this.attackSpeed = 900;
        this.attackRadius = 60;
        this.criticalRate = 0.05;

        this.radiusType = 'cross';
    }

    static shadowName = 'Axe';
    static spriteKey = 'axe_man';

    hitMonster(enemy) {
        super.hitMonster(enemy);
        enemy.applySlow(100, 0);
    }
}

export default AxeShadow;
