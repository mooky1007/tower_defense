import Shadow from './Shadow.js';

class SwordShadow extends Shadow {
    constructor(parent) {
        super(parent);

        this.name = 'Sword';
        this.price = 5;

        this.spriteOffsetY = -15;
        this.idleSpriteKey = 'sword_man';
        this.idleFrame = [0, 3];
        this.idleFramRate = 6;

        this.attackSpriteKey = 'sword_man2';
        this.attackFrame = [0, 3];
        this.attckFramRate = 18;

        this.attackType = 'instantHitRadius';

        this.level = 1;
        this.damage = [1, 2];
        this.radius = [this.parent.scene.game.tile.width * 2, this.parent.scene.game.tile.width * 2];
        this.attackSpeed = 250;
        this.attackRadius = 1;
        this.criticalRate = 0.15;

        this.radiusType = 'cross';
    }

    static shadowName = 'Sword';
    static spriteKey = 'sword_man';
}

export default SwordShadow;
