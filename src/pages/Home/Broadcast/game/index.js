import Phaser from 'phaser';

import { Play } from './scenes';

class Game extends Phaser.Game {
  constructor({ mapConfig, mode, match, player, ...config }) {
    super(config);

    this.registry.set("mapConfig", mapConfig);
    this.registry.set("mode", mode);
    this.registry.set("match", match);
    this.registry.set("player", player);

    this.scene.add('play', Play, true);
  }

  init() {
  }

  destroy() {
    console.log("game destroy 2");
  }
};

export default Game;

