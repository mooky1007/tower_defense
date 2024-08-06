window.onload = function () {
    let game = new Phaser.Game(960, 600, Phaser.AUTO, 'game');
    game.state.add('play', new PlayState(game));
    game.state.add('loading', new Loading(game));
    game.state.start('loading');
};
