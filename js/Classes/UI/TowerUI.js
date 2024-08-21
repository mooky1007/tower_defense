import AxeShadow from '../GameObjects/Shadows/AxeShadow.js';
import BowShadow from '../GameObjects/Shadows/BowShadow.js';
import SpearShadow from '../GameObjects/Shadows/SpearShadow.js';
import SwordShadow from '../GameObjects/Shadows/SwordShadow.js';

class TowerUI extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y);
        this.setVisible(false);

        this.setPosition(20, this.scene.game.tile.height * 10 + 20);
        this.setSize(this.scene.game.tile.width, this.scene.game.tile.height);
        this.scene.add.existing(this);

        this.summonUI = new SummonUI(this).buttons;

        const testButton3 = this.scene.add.container(scene);
        this.testButton3 = testButton3;
        testButton3.setSize(this.scene.game.tile.width * 2, this.scene.game.tile.height * 2 - 40);
        testButton3.setPosition(testButton3.width / 2, testButton3.height / 2);

        const line3 = this.scene.add.graphics();
        line3.fillStyle(0xffffff, 0.3);
        line3.fillRect(-testButton3.width / 2, -testButton3.height / 2, testButton3.width, testButton3.height);

        const text3 = this.scene.add.text(-testButton3.width / 2 + 5, -testButton3.height / 2 + 5, '', {
            fontSize: '13px',
            color: '#000',
            fontFamily: 'mabi',
        });

        const img3 = this.scene.add.sprite(0, 0, '');

        const text4 = this.scene.add.text(0, 0, `Damage: 2~3\nSpeed : 0.3s`, {
            fontSize: '13px',
            color: '#fff',
            fontFamily: 'mabi',
        });
        text4.setOrigin(0, 0);
        text4.setPosition(testButton3.width / 2 + 10, text3.y);

        testButton3.inforText = text4;

        testButton3.add([line3, text3, img3, text4]);
        testButton3.setInteractive();
        testButton3.on('pointerdown', () => {
            this.scene.selectedZone.shadow.levelUp();
            this.update();
        });

        this.add(testButton3);
    }

    update() {
        this.setVisible(this.scene.selectedZone);
        this.summonUI.forEach((el) => el.setVisible(!this.scene.selectedZone?.shadow));
        this.testButton3.setVisible(this.scene.selectedZone?.shadow);
        if (this.scene.selectedZone?.shadow) {
            this.testButton3.list.find((el) => el.type === 'Sprite').setTexture(this.scene.selectedZone.shadow.idleSpriteKey);
            this.testButton3.list.find(
                (el) => el.type === 'Text'
            ).text = `Lv. ${this.scene.selectedZone.shadow.level} ${this.scene.selectedZone.shadow.name}`;
            this.testButton3.inforText.text = `Damage: ${this.scene.selectedZone.shadow.damage.map((el) => Math.round(el)).join('~')}\nSpeed : ${
                this.scene.selectedZone.shadow.attackSpeed
            }ms\nCritical Rate: ${this.scene.selectedZone.shadow.criticalRate * 100}%\nExp: ${[
                this.scene.selectedZone.shadow.exp,
                this.scene.selectedZone.shadow.nextExp,
            ].join('/')}\nLevel Up Price: ${this.scene.selectedZone.shadow.level * this.scene.selectedZone.shadow.price}gold`;
        }
    }
}

export default TowerUI;

class SummonUI {
    constructor(parent) {
        this.parent = parent;
        this.scene = parent.scene;

        this.buttons = [
            new SummonButton(this, {
                idx: 0,
                summon: SwordShadow,
            }),
            new SummonButton(this, {
                idx: 1,
                summon: AxeShadow,
            }),
            new SummonButton(this, {
                idx: 2,
                summon: SpearShadow,
            }),
            new SummonButton(this, {
                idx: 3,
                summon: BowShadow,
            }),
        ];
    }
}

class SummonButton extends Phaser.GameObjects.Container {
    constructor(parent, config) {
        super(parent.scene);
        this.parent = parent;
        this.setSize(100, this.scene.game.tile.height * 2 - 40);
        this.setPosition(this.width / 2 + 100 * config.idx + (config.idx - 1) * 10, this.height / 2);

        const line = this.scene.add.graphics();
        line.fillStyle(0xffffff, 0.3);
        line.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

        const text = this.scene.add.text(-this.width / 2 + 5, -this.height / 2 + 5, config.summon.shadowName, {
            fontSize: '13px',
            color: '#000',
            fontFamily: 'mabi',
        });

        const img = this.scene.add.sprite(0, 0, config.summon.spriteKey);

        this.add([line, text, img]);
        this.parent.parent.add(this);

        this.setInteractive();
        this.on('pointerdown', () => {
            this.scene.selectedZone.summon(new config.summon(this.scene.selectedZone));

            this.parent.parent.update();
        });
    }
}
