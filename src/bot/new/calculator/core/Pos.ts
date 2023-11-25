import {
  DIRECT
} from './constants';

class Pos {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public adj(direct: any) {
    const strDirect = `${direct}`;

    switch (strDirect) {
      case DIRECT.LEFT:
        return new Pos(this.x - 1, this.y);
      case DIRECT.RIGHT:
        return new Pos(this.x + 1, this.y);
      case DIRECT.UP:
        return new Pos(this.x, this.y - 1);
      case DIRECT.DOWN:
        return new Pos(this.x, this.y + 1);
    }
  }

  public directTo (other: Pos) {
    if (this.x === other.x) {
      if (this.y < other.y) {
        return DIRECT.DOWN;
      } else {
        return DIRECT.UP;
      }
    } else {
      if (this.x < other.x) {
        return DIRECT.RIGHT;
      } else {
        return DIRECT.LEFT;
      }
    }
  }

  public static getDirect(fromPos: Pos, toPos: Pos) {
    if (fromPos.x === toPos.x) {
      if (fromPos.y < toPos.y) {
        return DIRECT.DOWN;
      } else {
        return DIRECT.UP;
      }
    } else {
      if (fromPos.x < toPos.x) {
        return DIRECT.RIGHT;
      } else {
        return DIRECT.LEFT;
      }
    }
  }
}

export default Pos;
