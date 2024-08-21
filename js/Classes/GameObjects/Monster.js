import Sprite from './Monsters/Sprite.js';

class Monster extends Phaser.GameObjects.Container {
    constructor(scene, x, y, waveLevel, type) {
        super(scene, x, y);
        this.name = 'monster';
        this.alive = true;
        this.type = type;

        const tileWidth = scene.game.tile.width;
        const tileHeight = scene.game.tile.height;

        this.setPosition(tileWidth * 1, tileHeight * 1);
        this.x -= tileWidth / 2;
        this.y -= tileHeight / 2;
        this.setSize(tileWidth, tileHeight);

        this.center = {
            x: this.x - tileWidth / 2,
            y: this.y - tileHeight / 2,
        };

        this._hp = 6 + (waveLevel * 1.5) ** (waveLevel * 0.1);
        this.gold = Math.floor(1 + waveLevel * 1.2);
        this.speed = 100;

        this.scene.physics.world.enable(this);
        this.body.allowGravity = false;

        this.scene.enemys.add(this);

        this.sprite = new Sprite(this.scene, x, y, 'blackslime');
        this.sprite.setPosition(
            this.sprite.x + Math.random() * (Math.random() < 0.5 ? 1 : -1) * 10,
            this.sprite.y + Math.random() * (Math.random() < 0.5 ? 1 : -1) * 10
        );

        this.sprite.anims.play('right');
        this.add(this.sprite);

        if (this.type === 'boss') {
            this._hp *= 10;
            this.gold *= 10;
            this.speed = 80;
            this.sprite.setScale(2);
        }
        this.body.setVelocity(this.speed, 0);
        scene.gameScreen.add(this);
    }

    get hp() {
        return this._hp;
    }

    set hp(value) {
        this._hp = value;
        if (this._hp <= 0) this.die();
    }

    hit(value, cr) {
        if (!this.alive) return;
        this.sprite.setTintFill(0xff0000, 1);

        const critical = Math.random() < cr ? true : false;
        if (critical) value *= 2;

        this.damageText = this.scene.add.text(this.center.x, this.center.y - 10, value, {
            fontSize: critical ? '13px' : '9px',
            color: critical ? 'red' : '#fff',
            fontFamily: 'mabi',
        });

        this.add(this.damageText);

        this.damageText.setOrigin(0.5, 0.5);
        this.damageText.setStroke('x0000000', 4);

        this.scene.tweens.add({
            targets: this.damageText,
            alpha: 0,
            y: this.damageText.y - 6,
            duration: 600,
            onComplete: () => {
                this.damageText.destroy();
            },
        });

        this.scene.time.addEvent({
            delay: 100,
            callback: () => {
                this.sprite.clearTint();
                this.hp -= value;
            },
            callbackScope: this,
            loop: false,
        });
    }

    die() {
        if (!this.alive) return;
        this.alive = false;
        this.scene.gold += this.gold;

        this.scene.time.addEvent({
            delay: 200,
            callback: () => {
                this.destroy();
            },
            callbackScope: this,
            loop: false,
        });
    }

    update() {
        const {
            speed,
            body: { blocked },
        } = this;

        if (blocked.right) {
            this.body.setVelocity(0, speed);
            this.sprite.play('left');
            if (this.body.wasTouching.down) {
                this.body.setVelocity(0, -speed);
            }
        }

        if (blocked.down) {
            this.body.setVelocity(-speed, 0);
            if (this.body.wasTouching.right) {
                this.body.setVelocity(0, -speed);
            }
        }

        if (blocked.left) {
            this.body.setVelocity(0, -speed);
            this.sprite.play('right');
            if (this.body.wasTouching.down) {
                this.body.setVelocity(speed, 0);
            }
        }

        if (blocked.up) {
            this.body.setVelocity(speed, 0);
            if (this.body.wasTouching.left) {
                this.body.setVelocity(0, speed);
            }
        }

        const tileWidth = this.scene.game.tile.width;
        const tileHeight = this.scene.game.tile.height;

        if (this.x > this.scene.game.config.width) {
            this.setPosition(tileWidth / 2, tileHeight / 2);
            this.scene.gold -= 1;
            if(this.scene.gold < 0) this.scene.gold = 0;
        }
    }
}

export default Monster;
