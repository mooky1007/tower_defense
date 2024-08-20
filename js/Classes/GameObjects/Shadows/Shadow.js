class Shadow {
    constructor(parent) {
        this.scene = parent.scene;

        this.parent = parent;
        this.price = 5;

        this.spriteOffsetY = 0;
        this.idleSpriteKey = '';
        this.idleFrame = [0, 0];
        this.idleFramRate = 6;

        this.attackSpriteKey = '';
        this.attackFrame = [0, 0];
        this.attckFramRate = 18;

        this.spriteScale = 1;

        this.attackType = 'instantHit';

        this.level = 0;
        this.damage = [0, 0];
        this.radius = [30, 100];
        this.attackSpeed = 1000;
        this.attackRadius = 30;
        this.criticalRate = 0;

        this.radiusType = 'cross';
        this.radiusArea = [];
    }

    create() {
        this.sprite = this.scene.add.sprite(this.parent.center.x, this.parent.center.y + this.spriteOffsetY * this.spriteScale, this.idleSpriteKey);
        this.sprite.setOrigin(0.5, 0.5);
        this.sprite.setSize(this.width, this.height);
        this.sprite.setScale(this.spriteScale);
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

        this[`${this.radiusType}Area`]();
    }

    crossArea() {
        this.radiusArea = [
            this.createAttackRange(this.radius[0], this.radius[1], this.attackType),
            this.createAttackRange(this.radius[1], this.radius[0], this.attackType),
        ];
    }

    instantHit(enemy, shadow) {
        if (this.attack) return;
        if (!enemy.alive) return;

        this.sprite.setFlipX(enemy.x > this.sprite.x);
        this.attack = true;

        this.scene.sound.add('swordSwipe', {
            volume: 0.1,
        }).play();

        this.sprite.anims.play('attack');
        enemy.hit(Math.floor(Math.random() * (this.damage[1] - this.damage[0]) + this.damage[0]), this.criticalRate);
        this.sprite.on('animationcomplete', () => {
            this.sprite.play('idle');
            this.sprite.off('animationcomplete');
            setTimeout(() => {
                this.attack = false;
            }, this.attackSpeed);
        });
    }

    instantHitRadius(enemy, shadow) {
        if (this.attack) return;
        if (!enemy.alive) return;

        this.sprite.setFlipX(enemy.x > this.sprite.x);
        this.attack = true;
        this.sprite.anims.play('attack');

        const radius = this.scene.add.rectangle(enemy.x, enemy.y + this.scene.game.tile.height, this.attackRadius, this.attackRadius);

        this.scene.physics.add.existing(radius);
        radius.body.immovable = true;
        radius.body.allowGravity = false;
        radius.attackedEnemy = [];

        this.scene.physics.add.overlap(this.scene.enemys, radius, (enemy) => {
            if (!enemy.alive) return;
            if (radius.attackedEnemy.includes(enemy)) return;
            radius.attackedEnemy.push(enemy);
            // console.log(Phaser.Math.Distance.Between(radius.x + radius.width / 2, radius.y  + radius.height / 2, enemy.sprite.x, enemy.sprite.y));

            enemy.hit(Math.floor(Math.random() * (this.damage[1] - this.damage[0]) + this.damage[0]), this.criticalRate);
        });

        this.sprite.on('animationcomplete', () => {
            radius.destroy();
            this.sprite.play('idle');
            this.sprite.off('animationcomplete');
            setTimeout(() => {
                this.attack = false;
            }, this.attackSpeed);
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
        const { price } = this;
        return this.scene.gold < price;
    }
}

export default Shadow;
