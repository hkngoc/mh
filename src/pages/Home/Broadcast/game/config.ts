import Phaser from 'phaser';

import { Play } from './scenes';

const DEFAULT_CONFIG = {
  width: "100%",
  height: "100%",
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  render: {
    antialias: false,
    pixelArt: true,
    roundPixels: true
  },
  scene: Play,
};

export default DEFAULT_CONFIG;
