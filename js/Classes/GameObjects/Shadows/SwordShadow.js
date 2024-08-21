import Shadow from './Shadow.js';

class SwordShadow extends Shadow {
    constructor(parent) {
        super(parent);

        this.name = 'Sword';
        this.price = 10;

        this.spriteOffsetY = -15;
        this.idleSpriteKey = 'sword_man';
        this.idleFrame = [0, 3];
        this.idleFramRate = 6;

        this.attackSpriteKey = 'sword_man2';
        this.attackFrame = [0, 3];
        this.attckFramRate = 18;

        this.level = 1;
        this.damage = [5, 7];
        this.radius = [this.parent.scene.game.tile.width, this.parent.scene.game.tile.width * 3];
        this.attackSpeed = 500;
        this.criticalRate = 0.2;

        this.radiusType = 'cross';
    }

    static shadowName = 'Sword';
    static spriteKey = 'sword_man';
}

export default SwordShadow;
