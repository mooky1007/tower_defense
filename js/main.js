import MainScene from './Classes/Scenes/MainScene.js';

const config = {
    type: Phaser.AUTO,
    width: 770,
    height: 770,
    backgroundColor: '#222',
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
        },
    },
    scene: [MainScene],
    scale: {
        mode: Phaser.Scale.FIT,
    },
};

class App extends Phaser.Game {
    constructor(config) {
        super(config);
        this.tileSize = [11, 11];
        this.tile = {
            width: config.width / this.tileSize[0],
            height: config.height / this.tileSize[1],
        };

        this.init();
    }

    init() {
        document.addEventListener('contextmenu', function (event) {
            event.preventDefault(); // 기본 컨텍스트 메뉴의 표시를 막습니다.
        });
    }
}

const game = new App(config);
