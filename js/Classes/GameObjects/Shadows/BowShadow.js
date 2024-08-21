import Shadow from './Shadow.js';

class BowShadow extends Shadow {
    constructor(parent) {
        super(parent);

        this.name = 'Bow';
        this.price = 15;

        this.spriteOffsetY = -15;
        this.idleSpriteKey = 'bow_man';
        this.idleFrame = [0, 3];

        this.attackSpriteKey = 'bow_man2';
        this.attackFrame = [0, 3];
        this.attckFramRate = 18;

        this.attackType = 'instantHit';

        this.level = 1;
        this.price = 15;
        this.damage = [9, 11];
        this.radius = [this.parent.scene.game.tile.width, this.parent.scene.game.tile.width * 2.5];
        this.attackSpeed = 1500;
        this.attackRadius = 40;
        this.criticalRate = 0.4;

        this.radiusType = 'circle';
    }

    static shadowName = 'Bow';
    static spriteKey = 'bow_man';
}

export default BowShadow;
