import Shadow from './Shadow.js';

class Supply extends Shadow {
    constructor(parent) {
        super(parent);

        this.name = 'Supply';
        this.price = 25;
        this.capacity = 0;

        this.spriteOffsetY = -15;
        this.idleSpriteKey = 'supply';
        this.idleFrame = [0, 0];

        this.attackType = null;
        this.radiusType = null;
        this.level = 1;
    }

    create() {
        super.create();

        this.levelText.destroy();
        this.scene.capacity += 4;
    }

    static shadowName = 'Supply';
    static spriteKey = 'supply';

    levelUp() {}
}

export default Supply;
