import MainScene from './Classes/Scenes/MainScene.js';

const config = {
    type: Phaser.AUTO,
    width: 576,
    height: 768,
    backgroundColor: '#222',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        },
    },
    scene: [MainScene],
    scale: {
        mode: Phaser.Scale.FIT,
    },
    audio: {
        disableWebAudio: false,
    },
};

class App extends Phaser.Game {
    constructor(config) {
        super(config);
        this.tileSize = [9, 12];
        this.tile = {
            width: config.width / this.tileSize[0],
            height: config.height / this.tileSize[1],
        };

        this.init();
    }

    init() {
        document.addEventListener('contextmenu', function (event) {
            event.preventDefault();
        });
    }
}

const game = new App(config);
