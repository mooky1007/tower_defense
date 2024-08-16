class Sprite extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);

        // this.anims.create({
        //     key: 'left',
        //     frames: this.anims.generateFrameNumbers(texture, { start: 0, end: 5 }),
        //     frameRate: 5,
        //     repeat: -1, // 무한 반복을 의미
        // });

        // this.anims.create({
        //     key: 'turn',
        //     frames: [{ key: texture, frame: 0 }],
        //     frameRate: 5,
        // });

        // this.anims.create({
        //     key: 'right',
        //     frames: this.anims.generateFrameNumbers(texture, { start: 0, end: 5 }),
        //     frameRate: 5,
        //     repeat: -1,
        // });

        // this.anims.create({
        //     key: 'die',
        //     frames: this.anims.generateFrameNumbers(`${texture}_death`, { start: 0, end: 5 }),
        //     frameRate: 5,
        //     repeat: -1,
        // });
    }
}

export default Sprite;
