import Shadow from './Shadow.js';

class SwordShadow extends Shadow {
    constructor(parent) {
        super(parent);
        this.price = 10;

        this.spriteOffsetY = -15;
        this.idleSpriteKey = 'sword_man';
        this.idleFrame = [0, 3];
        this.idleFramRate = 6;

        this.attackSpriteKey = 'sword_man2';
        this.attackFrame = [0, 3];
        this.attckFramRate = 18;

        this.level = 1;
        this.damage = [3, 6];
        this.attackSpeed = 100;
        this.criticalRate = 0.1;
    }

    create() {
        super.create();
        const ranges = [this.createAttackRange(30, 100, 'instantHit'), this.createAttackRange(100, 30, 'instantHit')];
        return [this.sprite, ...ranges];
    }
}

export default SwordShadow;
