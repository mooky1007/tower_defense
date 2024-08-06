import MainScene from './Classes/Scenes/MainScene.js';

const config = {
    type: Phaser.AUTO,
    width: 600,
    height: 600,
    backgroundColor: '#489338',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false,
        },
    },
    scene: [MainScene],
    scale: {
        mode: Phaser.Scale.FIT, // 게임 화면을 부모 컨테이너에 맞게 조정
        // autoCenter: Phaser.Scale.CENTER_BOTH, // 수평 및 수직 중앙 정렬
    },
};

const game = new Phaser.Game(config);

document.addEventListener('contextmenu', function (event) {
    event.preventDefault(); // 기본 컨텍스트 메뉴의 표시를 막습니다.
});
