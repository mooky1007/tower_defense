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

        this.level = 1;
        this.damage = [2, 5];
        this.radius = [this.parent.scene.game.tile.width, this.parent.scene.game.tile.width * 5];
        this.attackSpeed = 1200;
        this.criticalRate = 0.3;

        this.radiusType = 'cross';
    }

    static shadowName = 'Spear';
    static spriteKey = 'spear_man';

    hitMonster(enemy) {
        super.hitMonster(enemy);
        enemy.applyDamageOverTime(2000, 500, this.damage[0]/4, this);
    }
}

export default SpearShadow;
