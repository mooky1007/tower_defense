class Shadow {
    constructor(parent) {
        this.scene = parent.scene;

        this.parent = parent;
        this.name = 'unknown';
        this.level = 1;
        this.price = 5;

        this._exp = 0;

        this.spriteOffsetY = 0;
        this.idleSpriteKey = '';
        this.idleFrame = [0, 0];
        this.idleFramRate = 6;

        this.attackSpriteKey = '';
        this.attackFrame = [0, 0];
        this.attckFramRate = 18;

        this.spriteScale = 1;

        this.attackType = 'instantHit';

        this.damage = [0, 0];
        this.radius = [30, 100];
        this.attackSpeed = 1000;
        this.attackRadius = 30;
        this.criticalRate = 0;

        this.radiusType = 'cross';
        this.radiusArea = [];
    }

    get exp() {
        return this._exp;
    }

    set exp(value) {
        this._exp = value;
        this.scene.ui.update();
        if (this._exp >= this.nextExp) {
            this.levelUp();
        }
    }

    get nextExp() {
        return this.level * 20;
    }

    create() {
        this.sprite = this.scene.add.sprite(this.parent.center.x, this.parent.center.y + this.spriteOffsetY * this.spriteScale, this.idleSpriteKey);
        this.sprite.setOrigin(0.5, 0.5);
        this.sprite.setSize(this.width, this.height);
        this.sprite.setScale(this.spriteScale);
        this.sprite.setPosition(this.sprite.x + Math.random() * 3, this.sprite.y + Math.random() * 3);
        this.sprite.anims.create({
            key: 'idle',
            frames: this.sprite.anims.generateFrameNumbers(this.idleSpriteKey, { start: this.idleFrame[0], end: this.idleFrame[1] }),
            frameRate: this.idleFramRate,
            repeat: -1, // 무한 반복을 의미
        });

        this.sprite.anims.create({
            key: 'attack',
            frames: this.sprite.anims.generateFrameNumbers(this.attackSpriteKey, { start: this.attackFrame[0], end: this.attackFrame[1] }),
            frameRate: this.attckFramRate,
            repeat: 0, // 무한 반복을 의미
        });

        this.sprite.play('idle');

        this.levelText = this.scene.add.text(this.parent.x, this.parent.y + this.parent.height, this.level, {
            fontSize: '9px',
            color: '#fff',
            fontFamily: 'mabi',
        });
        this.levelText.setStroke(4, 0x000000);

        this[`${this.radiusType}Area`]();
    }

    levelUp() {
        if (this.scene.gold < this.price * this.level) return;
        this.scene.gold -= this.price * this.level;
        this.level += 1;
        this.exp = 0;

        this.levelText.text = this.level;
        this.damage = this.damage.map((el) => el * 1.1 + 1);
        this.attackSpeed -= 10;
    }

    crossArea() {
        this.radiusArea = [
            this.createAttackRange(this.radius[0], this.radius[1], this.attackType),
            this.createAttackRange(this.radius[1], this.radius[0], this.attackType),
        ];
    }

    circleArea() {
        const radius = Math.max(...this.radius); // 원형 영역의 반지름
        const range = this.scene.add.circle(this.parent.center.x, this.parent.center.y, radius, 0x000000, 0); // 투명 원형 영역 생성
        this.scene.physics.add.existing(range);
        range.body.setSize(radius * 2, radius * 2); // 원형 영역의 크기 설정
        range.body.setCircle(radius);
        range.body.immovable = true;
        range.body.allowGravity = false;

        this.scene.physics.add.overlap(this.scene.enemys, range, this[this.attackType].bind(this));

        this.radiusArea = [range];
    }

    hitMonster(enemy) {
        enemy.hit(Math.floor(Math.random() * (this.damage[1] - this.damage[0]) + this.damage[0]), this.criticalRate, this);
    }

    instantHit(enemy, shadow) {
        if (this.attack) return;
        if (!enemy.alive) return;

        this.sprite.setFlipX(enemy.x > this.sprite.x);
        this.attack = true;

        this.scene.sound
            .add('swordSwipe', {
                volume: 0.3,
            })
            .play();

        this.sprite.anims.play('attack');
        this.hitMonster(enemy);
        this.sprite.on('animationcomplete', () => {
            this.sprite.play('idle');
            this.sprite.off('animationcomplete');
            this.scene.time.addEvent({
                delay: this.attackSpeed,
                callback: () => (this.attack = false),
                callbackScope: this,
                loop: false,
            });
        });
    }

    instantHitRadius(enemy, shadow) {
        if (this.attack) return;
        if (!enemy.alive) return;

        this.sprite.setFlipX(enemy.x > this.sprite.x);
        this.attack = true;
        this.sprite.anims.play('attack');

        const radius = this.scene.add.circle(enemy.x, enemy.y + this.scene.game.tile.height, this.attackRadius, 0x000000, 0);

        this.scene.physics.add.existing(radius);
        radius.body.setCircle(this.attackRadius);
        radius.body.immovable = true;
        radius.body.allowGravity = false;
        radius.attackedEnemy = [];

        this.scene.physics.add.overlap(this.scene.enemys, radius, (enemy) => {
            if (!enemy.alive) return;
            if (radius.attackedEnemy.includes(enemy)) return;
            radius.attackedEnemy.push(enemy);

            this.hitMonster(enemy);
        });

        this.sprite.on('animationcomplete', () => {
            radius.destroy();
            this.sprite.play('idle');
            this.sprite.off('animationcomplete');
            this.scene.time.addEvent({
                delay: this.attackSpeed,
                callback: () => (this.attack = false),
                callbackScope: this,
                loop: false,
            });
        });
    }

    createAttackRange(x, y, attackFunc) {
        const range = this.scene.add.zone(this.parent.center.x, this.parent.center.y, x, y);
        this.scene.physics.add.existing(range);
        range.body.immovable = true;
        range.body.allowGravity = false;
        this.scene.physics.add.overlap(this.scene.enemys, range, this[attackFunc].bind(this));

        return range;
    }

    checkGold() {
        return this.scene.gold < this.price;
    }
}

export default Shadow;
