import Phaser, {
  GameObjects,
} from 'phaser';

import  {
  TILE_SIZE,
  // EXPLOSION_TIME,
} from '../config';

import { FireBlast } from './FireBlast';

export class Bomb extends GameObjects.Sprite {
  private config?: object;
  private blasted?: GameObjects.Group;

  public row;
  public col;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string | Phaser.Textures.Texture,
    frame?: string | number,
    config?: any,
  ) {
    const { size = TILE_SIZE, blasted = [] } = (config || {});

    super(
      scene,
      x * size + size / 2,
      y * size + size / 2,
      texture,
      frame
    );

    this.setScale(0.7);
    this.setAlpha(0.7);
    // this.anchor.setTo(0.5);

    this.config = config;
    this.row = y;
    this.col = x;

    this.anims.create({
      key: "bomb",
      frames: this.anims.generateFrameNumbers(
        typeof(texture) == "string" ? texture : texture.key,
        {
          // frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
          frames: [0]
        }
      ),
      frameRate: 6,
      // repeat: -1,
    });

    // scene.tweens.add({
    //   targets: this,
    //   scale: 1.2,
    //   duration: EXPLOSION_TIME,
    //   ease: 'Linear',
    //   repeat: -1,
    // });

    this.blasted = new GameObjects.Group(scene, []);

    for (const b of blasted) {
      const {
        row,
        col,
        type,
        destroyed,
        stopped,
      } = b;

      if (!stopped || destroyed) {
        const fb = new FireBlast(
          scene,
          col,
          row,
          type,
          undefined,
        );

        this.blasted.add(fb);
      }
    }

    scene.add.existing(this);

    this.anims.play("bomb");
  }

  destroy(fromScene?: boolean | undefined): void {
    super.destroy(fromScene);
    this.blasted?.destroy(true, fromScene);
  }
};
