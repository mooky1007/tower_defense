const LEVEL_COUNT = 2;

class PlayState {
    constructor(game) {
        this.game = game;
    }

    init(data) {
        this.keys = this.game.input.keyboard.addKeys({
            left: Phaser.KeyCode.LEFT,
            right: Phaser.KeyCode.RIGHT,
            up: Phaser.KeyCode.UP,
        });

        this.coinPickupCount = 0;
        this.hasKey = false;
        this.level = (data.level || 0) % LEVEL_COUNT;
    }

    create() {
        this.camera.flash('#000000');

        this.sfx = {
            jump: this.game.add.audio('sfx:jump'),
            coin: this.game.add.audio('sfx:coin'),
            key: this.game.add.audio('sfx:key'),
            stomp: this.game.add.audio('sfx:stomp'),
            door: this.game.add.audio('sfx:door'),
        };
        this.bgm = this.game.add.audio('bgm');
        this.bgm.loopFull();

        this.game.add.image(0, 0, 'background');
        this._loadLevel(this.game.cache.getJSON(`level:${this.level}`));

        this._createHud();
    }

    update() {
        this._handleCollisions();
        this._handleInput();

        this.coinFont.text = `x${this.coinPickupCount}`;
        this.keyIcon.frame = this.hasKey ? 1 : 0;
    }

    shutdown() {
        this.bgm.stop();
    }

    _handleCollisions() {
        this.game.physics.arcade.collide(this.spiders, this.platforms);
        this.game.physics.arcade.collide(this.spiders, this.enemyWalls);
        this.game.physics.arcade.collide(this.hero, this.platforms);

        this.game.physics.arcade.overlap(this.hero, this.coins, this._onHeroVsCoin, null, this);
        this.game.physics.arcade.overlap(this.hero, this.key, this._onHeroVsKey, null, this);
        this.game.physics.arcade.overlap(
            this.hero,
            this.door,
            this._onHeroVsDoor,
            function (hero, door) {
                return this.hasKey && hero.body.touching.down;
            },
            this
        );
        this.game.physics.arcade.overlap(this.hero, this.spiders, this._onHeroVsEnemy, null, this);
    }

    _handleInput() {
        if (this.keys.left.isDown) {
            this.hero.move(-1);
        } else if (this.keys.right.isDown) {
            this.hero.move(1);
        } else {
            this.hero.move(0);
        }

        const JUMP_HOLD = 200; // ms
        if (this.keys.up.downDuration(JUMP_HOLD)) {
            let didJump = this.hero.jump();
            if (didJump) {
                this.sfx.jump.play();
            }
        } else {
            this.hero.stopJumpBoost();
        }
    }

    _onHeroVsKey(hero, key) {
        this.sfx.key.play();
        key.kill();
        this.hasKey = true;
    }

    _onHeroVsCoin(hero, coin) {
        this.sfx.coin.play();
        coin.kill();
        this.coinPickupCount++;
    }

    _onHeroVsEnemy(hero, enemy) {
        if (hero.body.velocity.y > 0) {
            enemy.die();
            hero.bounce();
            this.sfx.stomp.play();
        } else {
            hero.die();
            this.sfx.stomp.play();
            hero.events.onKilled.addOnce(function () {
                this.game.state.restart(true, false, { level: this.level });
            }, this);

            enemy.body.touching = enemy.body.wasTouching;
        }
    }

    _onHeroVsDoor(hero, door) {
        door.frame = 1;
        this.sfx.door.play();

        hero.freeze();
        this.game.add.tween(hero).to({ x: this.door.x, alpha: 0 }, 500, null, true).onComplete.addOnce(this._goToNextLevel, this);
    }

    _goToNextLevel() {
        this.camera.fade('#000000');
        this.camera.onFadeComplete.addOnce(function () {
            this.game.state.restart(true, false, {
                level: this.level + 1,
            });
        }, this);
    }

    _loadLevel(data) {
        this.bgDecoration = this.game.add.group();
        this.platforms = this.game.add.group();
        this.coins = this.game.add.group();
        this.spiders = this.game.add.group();
        this.enemyWalls = this.game.add.group();
        this.enemyWalls.visible = false;

        this._spawnCharacters({ hero: data.hero, spiders: data.spiders });

        data.decoration.forEach(function (deco) {
            this.bgDecoration.add(this.game.add.image(deco.x, deco.y, 'decoration', deco.frame));
        }, this);

        data.platforms.forEach(this._spawnPlatform, this);

        data.coins.forEach(this._spawnCoin, this);
        this._spawnKey(data.key.x, data.key.y);
        this._spawnDoor(data.door.x, data.door.y);

        const GRAVITY = 1200;
        this.game.physics.arcade.gravity.y = GRAVITY;
    }

    _spawnCharacters(data) {
        data.spiders.forEach(function (spider) {
            let sprite = new Spider(this.game, spider.x, spider.y);
            this.spiders.add(sprite);
        }, this);

        this.hero = new Hero(this.game, data.hero.x, data.hero.y);
        this.game.add.existing(this.hero);
    }

    _spawnPlatform(platform) {
        let sprite = this.platforms.create(platform.x, platform.y, platform.image);

        this.game.physics.enable(sprite);
        sprite.body.allowGravity = false;
        sprite.body.immovable = true;

        this._spawnEnemyWall(platform.x, platform.y, 'left');
        this._spawnEnemyWall(platform.x + sprite.width, platform.y, 'right');
    }

    _spawnEnemyWall(x, y, side) {
        let sprite = this.enemyWalls.create(x, y, 'invisible-wall');
        sprite.anchor.set(side === 'left' ? 1 : 0, 1);
        this.game.physics.enable(sprite);
        sprite.body.immovable = true;
        sprite.body.allowGravity = false;
    }

    _spawnCoin(coin) {
        let sprite = this.coins.create(coin.x, coin.y, 'coin');
        sprite.anchor.set(0.5, 0.5);

        this.game.physics.enable(sprite);
        sprite.body.allowGravity = false;

        sprite.animations.add('rotate', [0, 1, 2, 1], 6, true); // 6fps, looped
        sprite.animations.play('rotate');
    }

    _spawnKey(x, y) {
        this.key = this.bgDecoration.create(x, y, 'key');
        this.key.anchor.set(0.5, 0.5);
        this.game.physics.enable(this.key);
        this.key.body.allowGravity = false;

        this.key.y -= 3;
        this.game.add
            .tween(this.key)
            .to({ y: this.key.y + 6 }, 800, Phaser.Easing.Sinusoidal.InOut)
            .yoyo(true)
            .loop()
            .start();
    }

    _spawnDoor(x, y) {
        this.door = this.bgDecoration.create(x, y, 'door');
        this.door.anchor.setTo(0.5, 1);
        this.game.physics.enable(this.door);
        this.door.body.allowGravity = false;
    }

    _createHud() {
        const NUMBERS_STR = '0123456789X ';
        this.coinFont = this.game.add.retroFont('font:numbers', 20, 26, NUMBERS_STR, 6);

        this.keyIcon = this.game.make.image(0, 19, 'icon:key');
        this.keyIcon.anchor.set(0, 0.5);

        let coinIcon = this.game.make.image(this.keyIcon.width + 7, 0, 'icon:coin');
        let coinScoreImg = this.game.make.image(coinIcon.x + coinIcon.width, coinIcon.height / 2, this.coinFont);
        coinScoreImg.anchor.set(0, 0.5);

        this.hud = this.game.add.group();
        this.hud.add(coinIcon);
        this.hud.add(coinScoreImg);
        this.hud.add(this.keyIcon);
        this.hud.position.set(10, 10);
    }
}
