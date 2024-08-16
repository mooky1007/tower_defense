import Sprite from './Monsters/Sprite.js';

class Monster extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y);
        this.name = 'monster';
        this.alive = true;

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

        this.speed = 75;

        this.scene.physics.world.enable(this);
        this.body.allowGravity = false;

        this.scene.enemys.add(this);
        this.body.setVelocity(this.speed, 0);

        this.sprite = new Sprite(this.scene, x, y, 'swordman');
        this.sprite.setPosition(this.sprite.x, this.sprite.y - 8)
        this.sprite.anims.play('right');
        this.add(this.sprite);

        // this.centerDot = this.scene.add.graphics();
        // this.centerDot.fillStyle(0xff0000);
        // this.centerDot.fillCircle(this.center.x, this.center.y, 2);
        // this.add(this.centerDot);

        scene.gameScreen.add(this);
    }

    hit() {
        this.sprite.setTint(0xff0000, 1);
        this.destroy();
    }

    update() {
        const {
            speed,
            body: { blocked },
        } = this;

        if (blocked.right) {
            this.body.setVelocity(0, speed);
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
        }
    }
}

export default Monster;
