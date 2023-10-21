import Phaser, {
  GameObjects,
} from 'phaser';

export class Player extends GameObjects.Sprite {
  private config?: object;
  private position: any;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string | Phaser.Textures.Texture,
    frame?: string | number,
    config?: any,
  ) {
    const { size = 35 } = (config || {});

    super(
      scene,
      x * size + size / 2,
      y * size + size / 2,
      texture,
      frame
    );
    this.config = config;

    this.position = { x, y };

    this.anims.create({
      key: 'up',
      frames: this.anims.generateFrameNumbers(
        typeof(texture) == "string" ? texture : texture.key,
        {
          frames: [ 9, 10, 11 ]
        }
      ),
      frameRate: 15,
      repeat: 0
    });
    this.anims.create({
      key: 'down',
      frames: this.anims.generateFrameNumbers(
        typeof(texture) == "string" ? texture : texture.key,
        {
          frames: [ 0, 1, 2 ]
        }
      ),
      frameRate: 15,
      repeat: 0
    });
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers(
        typeof(texture) == "string" ? texture : texture.key,
        {
          frames: [ 6, 7, 8 ]
        }
      ),
      frameRate: 15,
      repeat: 0
    });
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers(
        typeof(texture) == "string" ? texture : texture.key,
        {
          frames: [ 3, 4, 5 ]
        }
      ),
      frameRate: 15,
      repeat: 0
    });

    scene.add.existing(this);

    // this.anims.add('up', [9, 10, 11], 15, true);
    // this.anims.add('down', [0, 1, 2], 15, true);
    // this.anims.add('right', [6, 7, 8], 15, true);
    // this.anims.add('left', [3, 4, 5], 15, true);
  }

  update() {
    // console.log("work here", this.config);
  }

  goTo(position: any, speed: any) {
    // console.log("player can be move", position, this.position);
    const { size = 35 } = (this.config ?? {}) as any;

    this.animateFace(position);

    this.setPosition(position.x * size + size / 2, position.y * size + size / 2);

    // const duration = size * 1000 / speed;
    // this.game.add.tween(this).to(newPosition, duration, Phaser.Easing.Linear.None, true);
    // this.scene.tweens.add({
    //   targets: this,
    //   x: position.x * size + size / 2,
    //   y: position.y * size + size / 2,
    //   duration,
    //   ease: Phaser.Math.Easing.Linear,
    // });
  }

  animateFace(position: any) {
    // const { size = 35} = (this.config || {});

    let face = null;
    let diffX = position.x - this.position.x;
    let diffY = position.y - this.position.y;

    if (diffX < 0) {
      face = 'left'
    } else if (diffX > 0) {
      face = 'right'
    } else if (diffY < 0) {
      face = 'up'
    } else if (diffY > 0) {
      face = 'down'
    }

    if (face) {
      // console.log("new position", position.x, position.y);
      this.anims?.play?.(face);
    }
    this.position = position;
  }
};
