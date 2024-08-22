import Shadow from './Shadow.js';

class SpearShadow extends Shadow {
    constructor(parent) {
        super(parent);

        this.name = 'Spear';
        this.price = 10;

        this.spriteOffsetY = -15;
        this.idleSpriteKey = 'spear_man';
        this.idleFrame = [0, 3];
        this.idleFramRate = 6;

        this.attackSpriteKey = 'spear_man2';
        this.attackFrame = [0, 3];
        this.attckFramRate = 24;

        this.attackType = 'instantHitRadius';

        this.level = 1;
        this.damage = [1, 3];
        this.radius = this.radius = [this.parent.scene.game.tile.width * 2, this.parent.scene.game.tile.width * 4];
        this.attackSpeed = 1200;
        this.criticalRate = 0.2;

        this.attackRadius = 5;

        this.radiusType = 'cross';
    }

    static shadowName = 'Spear';
    static spriteKey = 'spear_man';

    hitMonster(enemy) {
        super.hitMonster(enemy);
        enemy.applyDamageOverTime(4000, 1000, this.level * 3, this);
    }
}

export default SpearShadow;
