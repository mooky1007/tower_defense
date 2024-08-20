import Shadow from './Shadow.js';

class SwordMasterShadow extends Shadow {
    constructor(parent) {
        super(parent);
        this.price = 10;

        this.spriteOffsetY = -15;
        this.idleSpriteKey = 'sword_man';
        this.idleFrame = [0, 3];
        this.idleFramRate = 6;

        this.attackSpriteKey = 'sword_man2';
        this.attackFrame = [0, 3];
        this.attckFramRate = 36;

        this.spriteScale = 1.4;

        this.level = 1;
        this.damage = [7, 14];
        this.radius = [50, 100];
        this.attackSpeed = 10;
        this.criticalRate = 0.8;

        this.radiusType = 'cross';
    }

    create() {
        super.create();
        return [this.sprite, ...this.radiusArea];
    }
}

export default SwordMasterShadow;
