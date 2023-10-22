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

export const EXPLOSION_TIME = 2000;

export const EXPLOSION_DIRECTIONS = [
  { x:  0, y: -1, end: 'up',    plumb: 'vertical'   },
  { x:  1, y:  0, end: 'right', plumb: 'horizontal' },
  { x:  0, y:  1, end: 'down',  plumb: 'vertical'   },
  { x: -1, y:  0, end: 'left',  plumb: 'horizontal' },
];

export const EXPLOSION_STOP = [1, 2, 5];
export const EXPLOSION_DESTROYED = [2, 5];

export const THINK_BORDER_COLOR = 0x6c757d // 0xdc3545;
export const THINK_FILL_COLOR =0x6c757d;
export const THINK_ALPHA = 0.6;
export const THINK_BORDER_WIDTH = 2;
export const THINK_SCALE = 0.75;
