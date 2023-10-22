import Phaser, {
  GameObjects,
} from 'phaser';

import  {
  TILE_SIZE,
  EXPLOSION_TIME,
} from '../config';

export class FireBlast extends GameObjects.Sprite {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string | Phaser.Textures.Texture,
    frame?: string | number,
    config?: any,
  ) {
    const { size = TILE_SIZE } = (config || {});

    super(
      scene,
      x * size + size / 2,
      y * size + size / 2,
      texture,
      frame
    );

    this.setAlpha(0);

    this.anims.create({
      key: "blast",
      frames: this.anims.generateFrameNumbers(
        typeof(texture) == "string" ? texture : texture.key,
        {
          // frames:  [0, 1, 2, 3, 4]
          frames: [0]
        }
      ),
      frameRate: 15,
      // repeat: -1,
      // hideOnComplete: true,
    });

    scene.tweens.add({
      targets: this,
      alpha: 0.7,
      duration: EXPLOSION_TIME,
      ease: 'Linear',
      // repeat: -1,
    });

    // this.game.physics.arcade.enable(this);

    scene.add.existing(this);

    this.anims.play("blast");
  }
}
