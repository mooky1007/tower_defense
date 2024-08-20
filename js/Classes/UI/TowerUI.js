import AxeShadow from '../GameObjects/Shadows/AxeShadow.js';
import SwordShadow from '../GameObjects/Shadows/SwordShadow.js';

class TowerUI extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y);
        this.setVisible(false);

        this.setPosition(20, this.scene.game.tile.height * 10 + 20);
        this.setSize(this.scene.game.tile.width, this.scene.game.tile.height);

        const testButton = this.scene.add.container(scene);
        testButton.setSize(100, 60);
        testButton.setPosition(50, 15);

        const line = this.scene.add.graphics();
        line.fillStyle(0xffffff, 0.3);
        line.fillRect(-testButton.width / 2, -testButton.height / 2, testButton.width, testButton.height);

        const text = this.scene.add.text(-testButton.width / 2 + 5, -testButton.height / 2, 'Sword', {
            fontSize: '13px',
            color: '#000',
            fontFamily: 'mabi',
        });

        const img = this.scene.add.sprite(0, 0, 'sword_man');

        testButton.add([line, text, img]);
        this.add(testButton);

        testButton.setInteractive();
        testButton.on('pointerdown', () => {
            this.scene.selectedZone.summon(new SwordShadow(this.scene.selectedZone));
        });

        const testButton2 = this.scene.add.container(scene);
        testButton2.setSize(100, 60);
        testButton2.setPosition(50 + testButton.width + 20, 15);

        const line2 = this.scene.add.graphics();
        line2.fillStyle(0xffffff, 0.3);
        line2.fillRect(-testButton.width / 2, -testButton2.height / 2, testButton2.width, testButton2.height);

        const text2 = this.scene.add.text(-testButton2.width / 2 + 5, -testButton2.height / 2, 'Axe', {
            fontSize: '13px',
            color: '#000',
            fontFamily: 'mabi',
        });

        const img2 = this.scene.add.sprite(0, 0, 'axe_man');
        
        testButton2.add([line2, text2, img2]);
        this.add(testButton2);

        testButton2.setInteractive();
        testButton2.on('pointerdown', () => {
            this.scene.selectedZone.summon(new AxeShadow(this.scene.selectedZone));
        });

        this.scene.add.existing(this);
    }

    update() {
        this.setVisible(this.scene.selectedZone);
    }
}

export default TowerUI;
