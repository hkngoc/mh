import Phaser, {
  GameObjects,
} from 'phaser';

import  {
  TILE_SIZE,
  THINK_BORDER_COLOR,
  THINK_FILL_COLOR,
  THINK_ALPHA,
  THINK_SCALE,
  THINK_BORDER_WIDTH,
} from '../config';

export class ThinkCell extends GameObjects.Rectangle {
  public row;
  public col;
  public visited;

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width?: number,
    height?: number,
    fillColor?: number,
    fillAlpha?: number,
    config?: any,
  ) {
    const { visited, size = TILE_SIZE } = (config || {});

    super(
      scene,
      x * size + size / 2,
      y * size + size / 2,
      width || THINK_SCALE * size,
      height || THINK_SCALE * size,
      fillColor || (visited ? THINK_FILL_COLOR : undefined),
      fillAlpha,
    );
    this.setStrokeStyle(THINK_BORDER_WIDTH, THINK_BORDER_COLOR);
    this.setAlpha(THINK_ALPHA);

    scene.add.existing(this);

    this.row = y;
    this.col = x;
    this.visited = visited;
  }

  public visit(fillColor: number = THINK_FILL_COLOR) {
    this.setFillStyle(fillColor);
  }
};
