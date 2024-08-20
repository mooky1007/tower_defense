import Shadow from './Shadow.js';

class AxeShadow extends Shadow {
    constructor(parent) {
        super(parent);
        this.price = 15;

        this.spriteOffsetY = -15;
        this.idleSpriteKey = 'axe_man';
        this.idleFrame = [0, 3];

        this.attackSpriteKey = 'axe_man2';
        this.attackFrame = [0, 3];
        this.attckFramRate = 12;

        this.level = 1;
        this.price = 15;
        this.damage = [1, 6];
        this.attackSpeed = 1200;
        this.attackRadius = 40;
        this.criticalRate = 0;
    }

    create() {
        super.create();
        const ranges = [this.createAttackRange(50, 120, 'instantHitRadius'), this.createAttackRange(120, 50, 'instantHitRadius')];
        return [this.sprite, ...ranges];
    }
}

export default AxeShadow;
