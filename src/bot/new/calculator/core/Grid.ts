// @ts-nocheck
import {
  Grid as BaseGrid,
  Node,
} from 'pathfinding';

class Grid extends BaseGrid {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(width: number, height: number, matrix: any) {
    super(width, height, matrix);
  }

  public _buildNodes(width: number, height: number, matrix: any) {
    let nodes = new Array(height);
  
    for (let i = 0; i < height; ++i) {
      nodes[i] = new Array(width);
      for (let j = 0; j < width; ++j) {
        nodes[i][j] = new Node(j, i);
      }
    }
  
  
    if (matrix === undefined) {
      return nodes;
    }
  
    if (matrix.length !== height || matrix[0].length !== width) {
      throw new Error('Matrix size does not fit');
    }
  
    for (let i = 0; i < height; ++i) {
      for (let j = 0; j < width; ++j) {
        const value = matrix[i][j];
  
        nodes[i][j].value = value;
  
        if (value) {
          // 0, false, null will be walkable
          // while others will be un-walkable
          nodes[i][j].walkable = false;
        }
      }
    }
  
    return nodes;
  }
  
  public isWalkableAt(x: number, y: number, playerNumber: any) {
    return this.isInside(x, y) && (this.nodes[y][x].walkable || this.nodes[y][x].value === playerNumber);
  };
  
  /**
   * Get the neighbors of the given node.
   * in current game rule, ignore diagonalMovement
   *
   *     offsets      diagonalOffsets:
   *  +---+---+---+    +---+---+---+
   *  |   | 0 |   |    | 0 |   | 1 |
   *  +---+---+---+    +---+---+---+
   *  | 3 |   | 1 |    |   |   |   |
   *  +---+---+---+    +---+---+---+
   *  |   | 2 |   |    | 3 |   | 2 |
   *  +---+---+---+    +---+---+---+
   *
   *  When allowDiagonal is true, if offsets[i] is valid, then
   *  diagonalOffsets[i] and
   *  diagonalOffsets[(i + 1) % 4] is valid.
   * @param {Node} node
   * @param {DiagonalMovement} diagonalMovement
   */
  public getNeighbors(node, diagonalMovement, playerNumber) {
    const { x, y } = node;
    const neighbors = [];
    const nodes = this.nodes;
  
    // ↑
    if (this.isWalkableAt(x, y - 1, playerNumber)) {
      neighbors.push(nodes[y - 1][x]);
    }
    // →
    if (this.isWalkableAt(x + 1, y, playerNumber)) {
      neighbors.push(nodes[y][x + 1]);
    }
    // ↓
    if (this.isWalkableAt(x, y + 1, playerNumber)) {
      neighbors.push(nodes[y + 1][x]);
    }
    // ←
    if (this.isWalkableAt(x - 1, y, playerNumber)) {
      neighbors.push(nodes[y][x - 1]);
    }
  
    return neighbors;
  };
  
  public getAllNeighbors(node) {
    const { x, y } = node;
    const neighbors = [];
    const nodes = this.nodes;
  
    // ↑
    if (this.isInside(x, y - 1,)) {
      neighbors.push(nodes[y - 1][x]);
    }
    // →
    if (this.isInside(x + 1, y)) {
      neighbors.push(nodes[y][x + 1]);
    }
    // ↓
    if (this.isInside(x, y + 1)) {
      neighbors.push(nodes[y + 1][x]);
    }
    // ←
    if (this.isInside(x - 1, y)) {
      neighbors.push(nodes[y][x - 1]);
    }
  
    // ↖
    if (this.isInside(x - 1, y - 1)) {
        neighbors.push(nodes[y - 1][x - 1]);
    }
    // ↗
    if (this.isInside(x + 1, y - 1)) {
        neighbors.push(nodes[y - 1][x + 1]);
    }
    // ↘
    if (this.isInside(x + 1, y + 1)) {
        neighbors.push(nodes[y + 1][x + 1]);
    }
    // ↙
    if (this.isInside(x - 1, y + 1)) {
        neighbors.push(nodes[y + 1][x - 1]);
    }
  
    return neighbors;
  }
  
  public wouldStopFlameAt(x, y, remainTime) {
    if (this.isInside(x, y)) {
      if (this.nodes[y][x].value === 1 || this.nodes[y][x].value === 5) {
        return true;
      } else if (this.nodes[y][x].value === 2) {
        const { flameRemain = [] } = this.nodes[y][x];
        for (const remain of flameRemain) {
          if (remain < remainTime) {
            // exist flame of other bomb with smaller remainTime
            return false;
          }
        }
  
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  };
  
  public wouldStopHumanAt(x, y) {
    return this.isInside(x, y) && ([1, 2].includes(this.nodes[y][x].value));
  };
  
  public wouldStopVirusAt(x, y) {
    return this.isInside(x, y) && ([1, 2].includes(this.nodes[y][x].value));
  };
  
  public dropBombAt(x, y){
    if (this.isInside(x, y)) {
      this.nodes[y][x].value = 3;
      this.nodes[y][x].walkable = false;
    }
  };
  
  public removeBombAt(x, y){
    if (this.isInside(x, y)) {
      this.nodes[y][x].value = 0;
      this.nodes[y][x].walkable = true;
    }
  };
}

export default Grid;
