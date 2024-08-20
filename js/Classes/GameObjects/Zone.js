import Tower from './Tower.js';
import TowerUI from '../UI/TowerUI.js';

class ZoneTile extends Phaser.GameObjects.Zone {
    constructor(scene, x, y, parent) {
        super(scene, scene.game.tile.width * x, scene.game.tile.height * y, scene.game.tile.width, scene.game.tile.height);
        this.parent = parent;
        this.center = {
            x: this.x + scene.game.tile.width / 2,
            y: this.y + scene.game.tile.height / 2,
        };

        this.selected = false;

        this.setPhysics();
        this.setObject();
        this.setInputs();

        this.init();
    }

    init() {
        const a = this.scene.add.graphics();
        a.fillStyle(0xffffff, 0.05);
        a.fillRect(this.x, this.y, this.width, this.height);
        a.setDepth(this.depth + 3);
        a.setVisible(false);

        this.parent.add(a);

        this.dot = a;
    }

    setObject() {
        this.setOrigin(0, 0);
    }

    setPhysics() {
        this.scene.physics.add.existing(this);
        this.body.immovable = true;
        this.body.allowGravity = false;
    }

    setInputs() {
        this.setInteractive();
        this.on('pointerdown', () => {
            if (this.scene.selectedZone === this) this.scene.selectedZone = null;
            else this.scene.selectedZone = this;

            this.scene.ui.update();
        });
    }

    summon() {
        if (this.shadow) return;
        if (this.scene.gold < 10) return;
        this.scene.gold -= 10;
        this.shadow = true;

        const swMan = this.scene.add.sprite(this.center.x, this.center.y - 15, 'sword_man');
        swMan.setOrigin(0.5, 0.5);
        swMan.setDepth = 8;
        swMan.anims.create({
            key: 'idle',
            frames: swMan.anims.generateFrameNumbers('sword_man', { start: 0, end: 3 }),
            frameRate: 6,
            repeat: -1, // 무한 반복을 의미
        });

        swMan.anims.create({
            key: 'attack',
            frames: swMan.anims.generateFrameNumbers('sword_man2', { start: 0, end: 3 }),
            frameRate: 18,
            repeat: 0, // 무한 반복을 의미
        });
        swMan.play('idle');
        swMan.setSize(this.width, this.height);

        const range = this.scene.add.zone(this.center.x, this.center.y, 30, 100);

        this.scene.physics.add.existing(range);
        range.body.immovable = true;
        range.body.allowGravity = false;

        const range2 = this.scene.add.zone(this.center.x, this.center.y, 100, 30);

        this.scene.physics.add.existing(range2);
        range2.body.immovable = true;
        range2.body.allowGravity = false;

        this.scene.physics.add.overlap(this.scene.enemys, range, (enemy, shadow) => {
            if (this.attack) return;
            if (!enemy.alive) return;

            swMan.setFlipX(enemy.x > swMan.x);
            this.attack = true;
            swMan.anims.play('attack');
            swMan.on('animationcomplete', () => {
                enemy.hit(Math.floor(Math.random() * 2 + 3));
                swMan.play('idle');
                swMan.off('animationcomplete');
                setTimeout(() => {
                    this.attack = false;
                }, 500);
            });
        });

        this.scene.physics.add.overlap(this.scene.enemys, range2, (enemy, shadow) => {
            if (this.attack) return;

            swMan.setFlipX(enemy.x > swMan.x);
            this.attack = true;
            swMan.anims.play('attack');
            swMan.on('animationcomplete', () => {
                enemy.hit(3);
                swMan.play('idle');
                swMan.off('animationcomplete');
                setTimeout(() => {
                    this.attack = false;
                }, 500);
            });
        });

        this.parent.add([swMan, range, range2]);
    }

    update() {
        this.dot.setVisible(this.scene.selectedZone === this);
    }
}

export default ZoneTile;
