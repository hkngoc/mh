import {
  GameObjects,
} from 'phaser';

import {
  TILE_SIZE,
  DRAGON_EGG_SPEED,
  DRAGON_EGG_ATTACK,
  DRAGON_EGG_DELAY,
  DRAGON_EGG_MYSTIC,
} from '../config';

export class Spoil extends GameObjects.Sprite {
  private config?: object;

  public row;
  public col;
  public type;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string | Phaser.Textures.Texture,
    frame?: string | number,
    config?: any,
  ) {
    const { type, size = TILE_SIZE } = (config || {});

    super(
      scene,
      x * size + size / 2,
      y * size + size / 2,
      texture,
      frame
    );

    scene.add.existing(this);

    this.config = config;
    this.row = y;
    this.col = x;
    this.type = type;
  }

  public static mapTypeToFrame(type: number) {
    switch (type) {
      case DRAGON_EGG_SPEED:
        return 3;
      case DRAGON_EGG_DELAY:
        return 2;
      case DRAGON_EGG_ATTACK:
        return 1;
      case DRAGON_EGG_MYSTIC:
        return 0;
      default:
        return 0;
    }
  }
}
