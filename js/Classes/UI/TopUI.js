import UI from './UI.js';

class TopUI extends UI {
    constructor(scene) {
        super(scene);

        this.create();
    }

    get list() {
        return this.container.list;
    }

    create() {
        const { game, enemys, waveLevel, defaultFontStyle } = this.scene;
        const { config, tile, maxiumMonster } = game;

        const background = this.new('graphics');
        background.fillStyle(0x111111);
        background.fillRect(0, 0, config.width, tile.height);

        const container = this.new('container', config.width / 2, tile.height / 2);
        this.container = container;

        //center UI
        const centerUI = this.new('container', 0, 0);
        this.centerUI = centerUI;

        const waveText = this.new('text', 0, 0, `[ Wave ${waveLevel + 1} ]`, defaultFontStyle);
        centerUI.waveText = waveText;
        waveText.setOrigin(0.5, 0.5);
        waveText.setPosition(waveText.x, waveText.y - waveText.height / 2);
        waveText.setStroke(0x000000, 4);

        const monsterText = this.new('text', 0, 0, `${enemys.getChildren().length}/${maxiumMonster || 50}`, defaultFontStyle);
        centerUI.monsterText = monsterText;
        monsterText.setStyle({ fontSize: '12px' });
        monsterText.setOrigin(0.5, 0.5);
        monsterText.setPosition(monsterText.x, monsterText.y + waveText.height / 2);
        monsterText.setStroke(0x000000, 4);

        centerUI.add([waveText, monsterText]);

        //right UI
        const rightUI = this.new('container', config.width / 2 - tile.width / 2, 0);
        this.rightUI = rightUI;

        const capacityText = this.new(
            'text',
            0,
            0,
            `${this.scene.zones
                .getChildren()
                .filter((zone) => zone.shadow)
                .reduce((acc, cur) => (acc += cur.shadow.capacity), 0)}/${this.scene.capacity}`,
            defaultFontStyle
        );
        capacityText.setOrigin(1, 0.5);
        capacityText.setPosition(capacityText.x, capacityText.y - capacityText.height / 2);
        capacityText.setStyle({ fontSize: '12px' });
        capacityText.setStroke(0x000000, 4);
        rightUI.capacityText = capacityText;

        const goldText = this.new('text', 0, 0, `${this.scene.gold.toLocaleString()} Gold`, defaultFontStyle);
        goldText.setOrigin(1, 0.5);
        goldText.setPosition(goldText.x, goldText.y + goldText.height / 2);
        goldText.setStyle({ fontSize: '12px' });
        goldText.setStroke(0x000000, 4);
        rightUI.goldText = goldText;

        rightUI.add([capacityText, goldText]);

        //left UI
        const leftUI = this.new('container', -config.width / 2 + tile.width / 2, 0);
        this.leftUI = leftUI;

        const timeText = this.new('text', 0, 0, '00:00', defaultFontStyle);
        centerUI.timeText = timeText;
        timeText.setOrigin(0, 0.5);
        timeText.setPosition(timeText.x, timeText.y);
        timeText.setStyle({ fontSize: '12px' });
        timeText.setStroke(0x000000, 4);

        leftUI.add(timeText);

        // combine
        container.add([this.centerUI, rightUI, leftUI]);
    }

    update() {
        this.centerUI.waveText.text = `[ Wave ${this.scene.waveLevel + 1} ]`;
        this.centerUI.monsterText.text = `${this.scene.enemys.getChildren().length}/${this.scene.maxiumMonster || 50}`;
        this.centerUI.timeText.text =
            this.scene.nextWaveTime === 0
                ? '웨이브 진행중..'
                : `Next Wave \n${
                      Math.trunc(this.scene.nextWaveTime / 60) <= 9
                          ? `0${Math.trunc(this.scene.nextWaveTime / 60)}`
                          : Math.trunc(this.scene.nextWaveTime / 60)
                  } : ${this.scene.nextWaveTime % 60 <= 9 ? `0${this.scene.nextWaveTime % 60}` : this.scene.nextWaveTime % 60}`;

        this.rightUI.capacityText.text = `${this.scene.zones
            .getChildren()
            .filter((zone) => zone.shadow)
            .reduce((acc, cur) => (acc += cur.shadow.capacity), 0)}/${this.scene.capacity}`;
        this.rightUI.goldText.text = `${this.scene.gold.toLocaleString()} Gold`;
    }
}

export default TopUI;
