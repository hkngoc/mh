import Phaser from 'phaser';

export const DEFAULT_CONFIG = {
  width: "100%",
  height: "100%",
  type: Phaser.AUTO,
  scale: {
    // mode: Phaser.Scale.NONE,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  render: {
    antialias: false,
    pixelArt: true,
    roundPixels: true
  },
  // scene: Play,
};

export const TILE_SIZE = 35;

export const DRAGON_EGG_SPEED = 3;
export const DRAGON_EGG_ATTACK = 4;
export const DRAGON_EGG_DELAY = 5;
export const DRAGON_EGG_MYSTIC = 6;
