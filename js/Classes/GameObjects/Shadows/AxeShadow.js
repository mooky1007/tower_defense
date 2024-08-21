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
        this.attckFramRate = 12;

        this.attackType = 'instantHitRadius';

        this.level = 1;
        this.price = 15;
        this.damage = [1, 6];
        this.radius = [30, 100];
        this.attackSpeed = 1200;
        this.attackRadius = 40;
        this.criticalRate = 0;

        this.radiusType = 'cross';
    }

    static shadowName = 'Axe';
    static spriteKey = 'axe_man';
}

export default AxeShadow;
