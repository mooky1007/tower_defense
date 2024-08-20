import Shadow from './Shadow.js';

class AxeMasterShadow extends Shadow {
    constructor(parent) {
        super(parent);
        this.price = 15;

        this.spriteOffsetY = -15;
        this.idleSpriteKey = 'axe_man';
        this.idleFrame = [0, 3];

        this.attackSpriteKey = 'axe_man2';
        this.attackFrame = [0, 3];
        this.attckFramRate = 12;

        this.spriteScale = 1.6;

        this.attackType = 'instantHitRadius';

        this.level = 1;
        this.price = 15;
        this.damage = [6, 21];
        this.radius = [30, 100];
        this.attackSpeed = 1200;
        this.attackRadius = 90;
        this.criticalRate = 0.7;

        this.radiusType = 'cross';
    }

    create() {
        super.create();
        return [this.sprite, ...this.radiusArea];
    }
}

export default AxeMasterShadow;
