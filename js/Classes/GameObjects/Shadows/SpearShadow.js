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
        this.damage = [2, 7];
        this.radius = [20, 200];
        this.attackSpeed = 400;
        this.criticalRate = 0.4;

        this.radiusType = 'cross';
    }

    static shadowName = 'Spear';
    static spriteKey = 'spear_man';
}

export default SpearShadow;
