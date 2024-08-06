class Hero extends Phaser.Sprite {
    constructor(game, x, y) {
        super(game, x, y, 'hero');
        this.anchor.set(0.5, 0.5);

        this.game.physics.enable(this);
        this.body.collideWorldBounds = true;
        console.log(this.animations);
        this.animations.add('stop', [0]);
        console.log(this.animations);
        this.animations.add('run', [1, 2], 8, true); // 8fps looped
        this.animations.add('jump', [3]);
        this.animations.add('fall', [4]);
        this.animations.add('die', [5, 6, 5, 6, 5, 6, 5, 6], 12); // 12fps no loop

        this.animations.play('stop');
    }

    move(direction) {
        if (this.isFrozen) return;

        const SPEED = 200;
        this.body.velocity.x = direction * SPEED;

        if (this.body.velocity.x < 0) {
            this.scale.x = -1;
        } else if (this.body.velocity.x > 0) {
            this.scale.x = 1;
        }
    }

    jump() {
        const JUMP_SPEED = 400;
        let canJump = this.body.touching.down && this.alive && !this.isFrozen;

        if (canJump || this.isBoosting) {
            this.body.velocity.y = -JUMP_SPEED;
            this.isBoosting = true;
        }

        return canJump;
    }

    stopJumpBoost() {
        this.isBoosting = false;
    }

    bounce() {
        const BOUNCE_SPEED = 200;
        this.body.velocity.y = -BOUNCE_SPEED;
    }

    update() {
        let animationName = this._getAnimationName();
        if (this.animations.name !== animationName) {
            this.animations.play(animationName);
        }
    }

    freeze() {
        this.body.enable = false;
        this.isFrozen = true;
    }

    die() {
        this.alive = false;
        this.body.enable = false;

        this.animations.play('die').onComplete.addOnce(function () {
            this.kill();
        }, this);
    }

    _getAnimationName() {
        let name = 'stop'; // default animation

        // dying
        if (!this.alive) {
            name = 'die';
        }
        // frozen & not dying
        else if (this.isFrozen) {
            name = 'stop';
        }
        // jumping
        else if (this.body.velocity.y < 0) {
            name = 'jump';
        }
        // falling
        else if (this.body.velocity.y >= 0 && !this.body.touching.down) {
            name = 'fall';
        } else if (this.body.velocity.x !== 0 && this.body.touching.down) {
            name = 'run';
        }

        return name;
    }
}
