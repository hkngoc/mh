// // @ts-nocheck
// import {
//   BehaviorTree,
//   Blackboard,
//   Priority, // Selector
// } from 'behavior3js';

// import {
//   Grid, 
//   Node
// } from 'pathfinding';

// import _ from 'lodash';

// const Direct = {
//   LEFT: '1',
//   RIGHT: '2',
//   UP: '3',
//   DOWN: '4'
// };

// const DirectOf = {
//   '1': Direct.LEFT,
//   '2': Direct.RIGHT,
//   '3': Direct.UP,
//   '4': Direct.DOWN
// };

// class Pos {
//   private x: number;
//   private y: number;

//   constructor(x, y) {
//     this.x = x;
//     this.y = y;
//   }

//   public adj = function(direct) {
//     switch (direct) {
//       case Direct.LEFT:
//         return new Pos(this.x - 1, this.y);
//       case Direct.RIGHT:
//         return new Pos(this.x + 1, this.y);
//       case Direct.UP:
//         return new Pos(this.x, this.y - 1);
//       case Direct.DOWN:
//         return new Pos(this.x, this.y + 1);
//     }
//   }

//   public directTo = function(other) {
//     if (this.x == other.x) {
//       if (this.y < other.y) {
//         return Direct.DOWN;
//       } else {
//         return Direct.UP;
//       }
//     } else {
//       if (this.x < other.x) {
//         return Direct.RIGHT;
//       } else {
//         return Direct.LEFT;
//       }
//     }
//   }

//   public static getDirect = (fromPos: Pos, toPos: Pos) => {
//     if (fromPos.x === toPos.x) {
//       if (fromPos.y < toPos.y) {
//         return Direct.DOWN;
//       } else {
//         return Direct.UP;
//       }
//     } else {
//       if (fromPos.x < toPos.x) {
//         return Direct.RIGHT;
//       } else {
//         return Direct.LEFT;
//       }
//     }
//   }
// }

// class CustomGrid extends Grid {
//   // eslint-disable-next-line @typescript-eslint/no-useless-constructor
//   constructor(width, height, matrix) {
//     super(width, height, matrix);
//   }

//   public _buildNodes = function(width, height, matrix) {
//     let nodes = new Array(height);
  
//     for (let i = 0; i < height; ++i) {
//       nodes[i] = new Array(width);
//       for (let j = 0; j < width; ++j) {
//         nodes[i][j] = new Node(j, i);
//       }
//     }

//     if (matrix === undefined) {
//       return nodes;
//     }

//     if (matrix.length !== height || matrix[0].length !== width) {
//       throw new Error('Matrix size does not fit');
//     }

//     for (let i = 0; i < height; ++i) {
//       for (let j = 0; j < width; ++j) {
//         const value = matrix[i][j];
  
//         nodes[i][j].value = value;
  
//         if (value) {
//           // 0, false, null will be walkable
//           // while others will be un-walkable
//           nodes[i][j].walkable = false;
//         }
//       }
//     }

//     return nodes;
//   }

//   public isWalkableAt = function(x, y, playerNumber) {
//     return this.isInside(x, y) && (this.nodes[y][x].walkable || this.nodes[y][x].value == playerNumber);
//   }

//   /**
//    * Get the neighbors of the given node.
//    * in current game rule, ignore diagonalMovement
//    *
//    *     offsets      diagonalOffsets:
//    *  +---+---+---+    +---+---+---+
//    *  |   | 0 |   |    | 0 |   | 1 |
//    *  +---+---+---+    +---+---+---+
//    *  | 3 |   | 1 |    |   |   |   |
//    *  +---+---+---+    +---+---+---+
//    *  |   | 2 |   |    | 3 |   | 2 |
//    *  +---+---+---+    +---+---+---+
//    *
//    *  When allowDiagonal is true, if offsets[i] is valid, then
//    *  diagonalOffsets[i] and
//    *  diagonalOffsets[(i + 1) % 4] is valid.
//    * @param {Node} node
//    * @param {DiagonalMovement} diagonalMovement
//    */
//   public getNeighbors = function(node, diagonalMovement, playerNumber) {
//     const { x, y } = node;
//     const neighbors = [];
//     const nodes = this.nodes;

//     // ↑
//     if (this.isWalkableAt(x, y - 1, playerNumber)) {
//       neighbors.push(nodes[y - 1][x]);
//     }
//     // →
//     if (this.isWalkableAt(x + 1, y, playerNumber)) {
//       neighbors.push(nodes[y][x + 1]);
//     }
//     // ↓
//     if (this.isWalkableAt(x, y + 1, playerNumber)) {
//       neighbors.push(nodes[y + 1][x]);
//     }
//     // ←
//     if (this.isWalkableAt(x - 1, y, playerNumber)) {
//       neighbors.push(nodes[y][x - 1]);
//     }

//     return neighbors;
//   };

//   public getAllNeighbors = function(node) {
//     const { x, y } = node;
//     const neighbors = [];
//     const nodes = this.nodes;

//     // ↑
//     if (this.isInside(x, y - 1,)) {
//       neighbors.push(nodes[y - 1][x]);
//     }
//     // →
//     if (this.isInside(x + 1, y)) {
//       neighbors.push(nodes[y][x + 1]);
//     }
//     // ↓
//     if (this.isInside(x, y + 1)) {
//       neighbors.push(nodes[y + 1][x]);
//     }
//     // ←
//     if (this.isInside(x - 1, y)) {
//       neighbors.push(nodes[y][x - 1]);
//     }

//     // ↖
//     if (this.isInside(x - 1, y - 1)) {
//         neighbors.push(nodes[y - 1][x - 1]);
//     }
//     // ↗
//     if (this.isInside(x + 1, y - 1)) {
//         neighbors.push(nodes[y - 1][x + 1]);
//     }
//     // ↘
//     if (this.isInside(x + 1, y + 1)) {
//         neighbors.push(nodes[y + 1][x + 1]);
//     }
//     // ↙
//     if (this.isInside(x - 1, y + 1)) {
//         neighbors.push(nodes[y + 1][x - 1]);
//     }

//     return neighbors;
//   }

//   public wouldStopFlameAt = function(x, y, remainTime) {
//     if (this.isInside(x, y)) {
//       if (this.nodes[y][x].value == 1 || this.nodes[y][x].value == 5) {
//         return true;
//       } else if (this.nodes[y][x].value == 2) {
//         const { flameRemain = [] } = this.nodes[y][x];
//         for (const remain of flameRemain) {
//           if (remain < remainTime) {
//             // exist flame of other bomb with smaller remainTime
//             return false;
//           }
//         }

//         return true;
//       } else {
//         return false;
//       }
//     } else {
//       return true;
//     }
//   };

//   public wouldStopHumanAt = function(x, y) {
//     return this.isInside(x, y) && ([1, 2].includes(this.nodes[y][x].value));
//   };

//   public wouldStopVirusAt = function(x, y) {
//     return this.isInside(x, y) && ([1, 2].includes(this.nodes[y][x].value));
//   };

//   public dropBombAt = function(x, y){
//     if (this.isInside(x, y)) {
//       this.nodes[y][x].value = 3;
//       this.nodes[y][x].walkable = false;
//     }
//   };

//   public removeBombAt = function(x, y){
//     if (this.isInside(x, y)) {
//       this.nodes[y][x].value = 0;
//       this.nodes[y][x].walkable = true;
//     }
//   };
// }

// class Queue {
//   private _elements;
//   private _offset;

//   constructor(elements) {
//     this._elements = elements;
//     this._offset = 0;
//   }

//   public enqueue = function(element) {
//     this._elements.push(element);
  
//     return this;
//   };
  
//   public dequeue = function() {
//     if (this.size() === 0) return null;
  
//     const first = this.front();
//     this._offset += 1;
  
//     // if (this._offset * 2 < this._elements.length) return first;
  
//     // // only remove dequeued elements when reaching half size
//     // // to decrease latency of shifting elements.
//     // this._elements = this._elements.slice(this._offset);
//     // this._offset = 0;
  
//     return first;
//   };
  
//   public front = function() {
//     return this.size() > 0 ? this._elements[this._offset] : null;
//   };
  
//   public back = function() {
//     return this.size() > 0 ? this._elements[this._elements.length - 1] : null;
//   };
  
//   public size = function() {
//     return this._elements.length - this._offset;
//   };
  
//   public isEmpty = function() {
//     return this.size() === 0;
//   };
  
//   public toArray = function() {
//     return this._elements.slice(this._offset);
//   };
  
//   public elements = function() {
//     return this._elements;
//   };
  
//   public clear = function() {
//     this._elements = [];
//     this._offset = 0;
//   }
  
//   public clone = function() {
//     return new Queue(this._elements.slice(this._offset));
//   };
// }



// class AI {
//   private map: any;
//   private config: any;
//   private tree: any;
//   private blackboard: Blackboard;

//   private lastResult: any;

//   constructor(state:any, config: any, lastResult: any) {
//     const tree = new BehaviorTree(null, {
//       title: 'BTs of iVengers'
//     });
//     tree.root = this.buildTree();
    
//     this.map  = state;
//     this.tree       = tree;
//     this.config     = config;
//     this.blackboard = new Blackboard();
//     this.lastResult = lastResult;
//   }

//   private scoreForSpoils = function(spoils) {
//     return _(spoils)
//       .map(spoil => {
//         switch (spoil) {
//           case 5:
//             // pill
//             return 2.5;
//           case 3:
//             // increase power 1
//             return 1.0;
//           case 4:
//             // decrease delay 400
//             return 1.0;
//           default:
//             return 0.5;
//         }
//       })
//       .sum();
//   };

//   private scoreFor = function(which) {
//     switch (which) {
//       case 'box':
//         return 0.75;
//       case 'enemy':
//         return 1.0;
//       case 'virus':
//         return 0.4;
//       case 'gifts':
//         return 1.5;
//       default:
//         return 0.5;
//     }
//   }

//   private scoreForWalk = function(playerId, node, neighbor, grid, travelCost, offset = 700, scoreProfit = {}) {
//     const { map_info: { gifts, spoils } } = this.map;
  
//     const { x, y, virusTravel = [], humanTravel = [] } = neighbor;
//     const score = {};
  
//     for (const spoil of spoils) {
//       const { col, row, spoil_type } = spoil;
//       if (x === col && y === row) {
//         score['spoils'] = [ spoil_type ];
//       }
//     }
//     for (const gift of gifts) {
//       const { col, row, gift_type } = gift;
//       if (x === col && y === row) {
//         score['gifts'] = [ gift_type ];
//       }
//     }
  
//     const tpc = this.timeToCrossACell(playerId);
//     const travelTime = tpc * travelCost;
//     const left = travelTime - tpc/2;
//     const right = travelTime + tpc/2;
  
//     const vtpc = this.timeToCrossACell('virus');
//     for (const v of virusTravel) {
//       const { index, step, main = false } = v;
  
//       const vTravelTime = step * vtpc;
//       const vLeft       = vTravelTime - vtpc/2 - offset;
//       const vRight      = vTravelTime + vtpc/2 + offset
  
//       if ((vLeft < left && left < vRight) || (vLeft < right && right < vRight)) {
//         score['virus'] = [ ...score['virus'] || [], v ];
//       }
//     }
  
//     const htpc = this.timeToCrossACell('human');
  
//     let human = 0;
//     for (const h of humanTravel) {
//       const { step, curedRemainTime = 0, main = false } = h;
  
//       const hTravelTime = curedRemainTime + step * htpc;
//       const hLeft       = hTravelTime - htpc/2 - offset;
//       const hRight      = hTravelTime + htpc/2 + offset;
  
//       if ((hLeft < left && left < hRight) || (hLeft < right && right < hRight)) {
//         score['human'] = [ ...score['human'] || [], h ];
//       }
//     }
  
//     // const { scoreProfit = {} } = node;
//     return {
//       score,
//       merged: this.mergeProfit(scoreProfit, score)
//     };
//   }

//   private safeScoreForWalk = function(playerId, node, neighbor, travelCost) {
//     const tpc = this.timeToCrossACell(playerId);
  
//     const { flameRemain: f1 = [] } = node;
//     const m1 = _(f1)
//       .map(f => f - tpc * (travelCost - 1))
//       .filter(f => f >= 0)
//       .minBy() || 0;
  
//     const { flameRemain: f2 = [] } = neighbor;
//     const m2 = _(f2)
//       .map(f => f - tpc * travelCost)
//       .filter(f => f >= 0)
//       .minBy() || 0;
  
//     if (m1 > 0) {
//       if (m2 > 0 && m2 <= m1) {
//         return -1;
//       } else {
//         return 1;
//       }
//     } else {
//       if (m2 > 0) {
//         return -1;
//       }
//     }
  
//     return 0;
//   }

//   private countingScore = function(obj) {
//     const { box = 0, enemy = 0, gifts = [], spoils = [], virus = [], human = [], scare = 0 } = obj;
  
//     let score = 0;
  
//     score = score + box * this.scoreFor('box');
//     score = score + enemy * this.scoreFor('enemy');

//     // score = score + this.scoreFor('virus') * _(virus).filter(v => v.main === true).sumBy(v => 1);
//     // score = score + _(human).filter(h => h.main == true).sumBy(h => this.scoreForHuman(h));
//     // score = score + this.scoreFor('gifts') * gifts.length; // can be score by type of gift or spoil...

//     score = score + this.scoreForSpoils(spoils);

//     score = score - 0.3 * scare;
  
//     return score;
//   }

//   private scoreFn = function(node, scare = 0) {
//     const {
//       travelCost,
//       scoreProfit = {},
//       bombProfit = {}
//     } = node;
  
//     const { box = 0, enemy = 0, safe } = bombProfit;
//     const { gifts = [], spoils = [], virus = [], human = [] } = scoreProfit;
  
//     return this.countingScore({
//       gifts,
//       spoils,
//       box: safe ? box : 0,
//       enemy: safe ? enemy : 0,
//       virus,
//       human,
//       scare
//     });
//   }

//   private roundScore = function(score, offset = 0.00005) {
//     return +(Math.round((Math.round(score /offset) * offset) + 'e+5') + 'e-5');
//   }

//   private extremeFn = function(score, cost) {
//     if (cost <= 0) {
//       cost = 0.85;
//     } else if (cost === 1) {
//       cost = 1.1;
//     } else {
//       // cost = cost - 0.5;
//       cost = cost * 0.85;
//       cost = Math.pow(cost, 6/10);
//       // cost = cost * 0.9;
//     }
  
//     score = 1.0 * score / cost;
//     // round by 0.1
//     score = this.roundScore(score);
  
//     // why ??
//     // if (score == 0) {
//     //   score = 0.1;
//     // }
  
//     return score;
//   }

//   public getPlayerSortId = function(id) {
//     const split = id.split('-');
  
//     return `${split[0]}-${split[1]}`;
//   };
  
//   public getPlayerNumber = function(id) {
//     const { playerNumber: { [id]: number } } = this.map;
  
//     return number;
//   };
  
//   public getPlayerPower = function(id) {
//     const { map_info: { players: { [id]: player } } } = this.map;
//     const { power } = player;
  
//     return power;
//   };
  
//   public playerPassiveNumber = function(id) {
//     const { map_info: { players: { [id]: player } } } = this.map;
//     const { pill = 0, pillUsed = 0 } = player;
  
//     // return 0; // mock
//     return pill;
//   };
  
//   public getPlayer = function(id) {
//     const { map_info: { players: { [id]: player } } } = this.map;
  
//     return player;
//   };
  
//   public getMyPlayer = function() {
//     const { myId }= this.map;
  
//     return this.getPlayer(myId);
//   };
  
//   public getEnemyPlayer = function() {
//     const { enemyId } = this.map;
  
//     return this.getPlayer(enemyId);
//   };
  
//   public getDirectOf = function(direction) {
//     return DirectOf[direction];
//   };
  
//   public mergeProfit = function(left, right) {
//     return _.mergeWith.apply(_, [{...left}].concat([{...right}], (obj, src, key) => {
//       if (Array.isArray(src)) {
//         const merged =  [ ...(obj || []), ...src ];
//         return merged;
//       }
//       return (obj || 0) + src;
//     }));
//   };
  
//   public fasterEnemy = function(node, travelCost, preCost = 0) {
//     const { enemyTravelCost } = node;
  
//     if (enemyTravelCost >= 0 && enemyTravelCost <= travelCost + preCost) {
//       return false;
//     }
  
//     return true;
//   };
  
//   public timeToCrossACell = function(id) {
//     const { timestamp, myId, map_info: { virusSpeed, humanSpeed, players } } = this.map;
  
//     if (id == 'human') {
//       var speed = humanSpeed;
//     } else if (id == 'virus') {
//       speed = virusSpeed;
//     } else {
//       speed = players[id].speed;
//     }
  
//     // need Q&A and confirm from BTC
//     // current by hack of source code
//     // I found that the value is 35 in traning mode and 55 in fighting mode
//     const SIZE = myId.includes('player') ? 55 : 55;
//     return 1000 * SIZE / speed;
//   };

//   public drawBombFlames = function(bomb, grid, fn, which) {
//     const { col, row, remainTime, power, index, playerId } = bomb;
  
//     const pos = new Pos(col, row);
  
//     let directs = {};
//     directs[Direct.LEFT] = pos;
//     directs[Direct.RIGHT] = pos;
//     directs[Direct.UP] = pos;
//     directs[Direct.DOWN] = pos;
  
//     let flameSize = power;//boot bomb power
//     // let score = 0;
  
//     let profit = fn.apply(this, [playerId, pos, grid, remainTime, index, {}, which]);
  
//     while (flameSize > 0 && _.keys(directs).length > 0) {
//       for (const direct in directs) {
//         const p = directs[direct];
//         const near = p.adj(direct);
  
//         // update grid at near
//         profit = fn.apply(this, [playerId, near, grid, remainTime, index, profit, which]);
//         directs[direct] = near;
  
//         const stop = grid.wouldStopFlameAt(near.x, near.y, remainTime);
//         if (stop) {
//           directs = _.omit(directs, direct);
//         }
//       }
  
//       flameSize--;
//     }
  
//     return profit;
//   };
  
//   public updateFlameFunction = function(playerId, pos, grid, remainTime, index, profit = {}, which = 'flameRemain') {
//     const { x, y } = pos;
  
//     const node = grid.getNodeAt(x, y);
//     node[which] = [ ...(node[which] || []), remainTime];
  
//     const score = this.scoreForBombing(playerId, pos, grid, remainTime);
  
//     return this.mergeProfit(profit, score);
//   };
  
//   public reverseFlameFunction = function(playerId, pos, grid, remainTime, index, profit = {}, which = 'tempFlameRemain') {
//     const { x, y } = pos;
  
//     const node = grid.getNodeAt(x, y);
//     delete node[which];
  
//     return 0;
//   };
  
//   public scoreForBombing = function(playerId, pos, grid, remainTime) {
//     const playerNumber = this.getPlayerNumber(playerId);
//     const score = {};
  
//     const { x, y } = pos;
//     const node = grid.getNodeAt(x, y);
  
//     // kill enemy
//     const { myId, enemyId, map_info: { players } } = this.map;
//     const id = myId == playerId ? enemyId : myId;
//     const { [id]: { currentPosition: { col, row } } } = players;
//     if (x == col && y == row) {
//       score.enemy = 1; // just for counting
//     }
  
//     if (node.value == 2 && grid.wouldStopFlameAt(x, y, remainTime)) {
//       score.box = 1; // just for counting
//     }
  
//     return score;
//   };
  
//   public acceptFlame = function(remain, cost, preCost, tpc, offset) {
//     const travelTime = tpc * (cost + preCost);
  
//     // need so much more thinking about that formula about range time of flame effect
//     // currenly, I approve that with:
//     // flame time = 400ms
//     // offset = 200
  
//     if ((travelTime - tpc/2 > remain + 400 + offset * 1.5) || (travelTime + tpc/2 < remain - offset)) {
//       return true;
//     } else {
//       return false;
//     }
//   };
  
//   public canPlayerWalkByFlame = function(playerId, node, neighbor, grid, cost, preCost = 0, offset = 300, includeTemp = true) {
//     const tpc = this.timeToCrossACell(playerId);
//     const travelTime = tpc * cost;
  
//     let safe = true;
  
//     /* check travel time with flame */
//     const { flameRemain = [], tempFlameRemain = [] } = neighbor;
//     const remainTime = [
//       ..._.map(flameRemain, remain => ({ remain, preCost })),
//     ];
//     if (includeTemp) {
//       remainTime.push(..._.map(tempFlameRemain, remain => ({ remain, preCost: 0 })));
//     }
  
//     for (const flame of remainTime) {
//       const { remain, preCost } = flame;
  
//       const accept = this.acceptFlame(remain, cost, preCost, tpc, offset);
  
//       if (!accept) {
//         safe = false;
//         break;
//       }
//     }
  
//     return safe;
//   };

//   public checkPathCanWalk = function(positions) {
//     const { map: { myId }, grid }= this;
  
//     const index = _.findLastIndex(positions, p => p.visited == true);
  
//     let wakable = true;
//     let travelCost = 1;
//     let profit = {};
//     for (let i = index; i < positions.length - 1; i++) {
//       const node = positions[i];
//       const neighbor = positions[i+1];
  
//       const { score, merged } = this.scoreForWalk(myId, node, neighbor, grid, travelCost, 100, profit);
//       wakable = this.canPlayerWalkByFlame(
//         myId,
//         grid.getNodeAt(node.x, node.y),
//         grid.getNodeAt(neighbor.x, neighbor.y),
//         grid,
//         travelCost,
//         0,
//         300,
//         false
//       ) && this.canPlayerWalkBySarsCov(
//         myId,
//         grid.getNodeAt(node.x, node.y),
//         grid.getNodeAt(neighbor.x, neighbor.y),
//         grid,
//         travelCost,
//         0,
//         700,
//         false,
//         profit
//       )
//       profit = merged;
//       travelCost++;
  
//       if (!wakable) {
//         break;
//       }
//     }
  
//     return wakable;
//   };
  
//   public checkPathInDanger = function(positions) {
//     const { map: { myId }, grid }= this;
  
//     const index = _.findLastIndex(positions, p => p.visited == true);
//     const left = index >= 2 ? index - 2 : 0;
  
//     let profit = {};
//     let accept = true;
//     for (let i = left; i <= index; i++) {
//       const node = grid.getNodeAt(positions[i].x, positions[i].y);
  
//       const { flameRemain = [], humanTravel = [], virusTravel = [] } = node;
//       profit = this.mergeProfit(profit, { humanTravel, virusTravel });
//       if (flameRemain.length > 0) {
//         accept = false;
//         break;
//       }
//     }
  
//     if (accept) {
//       const passive = this.playerPassiveNumber(myId);
//       const { humanTravel = [], virusTravel = []} = profit;
//       if (passive < humanTravel.length + virusTravel) {
//         accept = false;
//       }
//     }
  
//     return accept;
//   };
  
//   public tracePath = function(pos, grid) {
//     let node = grid.getNodeAt(pos.x, pos.y);
//     let directs = '';
//     const positions = [{
//       x: pos.x,
//       y: pos.y
//     }];
  
//     while (node.parent) {
//       const { parent } = node;
//       const direct = getDirect({ x: parent.x, y: parent.y }, { x: node.x, y: node.y });
//       directs = direct + directs;
//       positions.splice(0, 0, {
//         x: parent.x,
//         y: parent.y
//       });
  
//       node = parent;
//     }
  
//     const { timestamp } = this.map;
//     positions[0].visited = true;
//     positions[0].timestamp = timestamp;
  
//     return {
//       directs,
//       positions
//     };
//   };

//   public conditionSafeFn = function(node, grid, passive, scare, faster = true) {
//     const {
//       travelCost,
//       flameRemain = []
//     } = node;
  
//     if (travelCost > 0) {
//       const acceptFlame = flameRemain.length <= 0;
  
//       if (faster) {
//         var acceptFaster = this.fasterEnemy(node, travelCost, 0);
//       } else {
//         acceptFaster = true;
//       }
  
//       return {
//         acceptFlame,
//         acceptFaster
//       }
//     } else {
//       return {
//         acceptFlame: false,
//         acceptFaster: false
//       }
//     }
//   };
  
//   public interviewSafe = function(candidates, passive) {
//     let interview = true;
  
//     if (interview && candidates.length > 0) {
//       const temp = _.filter(candidates, candidate => {
//         const { scare } = candidate;
//         return this.filterSafeScareLevel0(passive, scare);
//       });
  
//       if (temp.length > 0) {
//         candidates = temp;
//       } else {
//         interview = false;
//       }
//     }
  
//     if (interview && candidates.length > 0) {
//       const temp = _.filter(candidates, candidate => {
//         const { scare } = candidate;
//         return this.filterSafeScareLevel1(passive, scare);
//       });
  
//       if (temp.length > 0) {
//         candidates = temp;
//       } else {
//         interview = false;
//       }
//     }
  
//     if (interview && candidates.length > 0) {
//       const temp = _.filter(candidates, candidate => {
//         const { scare } = candidate;
//         return this.filterSafeScareLevel2(passive, scare);
//       });
  
//       if (temp.length > 0) {
//         candidates = temp;
//       } else {
//         interview = false;
//       }
//     }
  
//     if (interview && candidates.length > 0) {
//       const temp = _.filter(candidates, candidate => {
//         const { scare } = candidate;
//         return this.filterSafeScareLevel3(passive, scare);
//       });
  
//       if (temp.length > 0) {
//         candidates = temp;
//       } else {
//         interview = false;
//       }
//     }
  
//     return candidates;
//   };
  
//   public filterSafeScareLevel0 = function(scare, passive) {
//     const filtered = _(scare)
//       .uniqBy(o => `${o.type}-${o.index}`)
//       .filter(o => o.main && (o.dx == 0 || o.dy == 0) && o.distance <= 1 && o.step >= 0 && o.step <= 3)
//       .value();
  
//     return passive >= filtered.length
//   };
  
//   public filterSafeScareLevel1 = function(scare, passive) {
//     const filtered = _(scare)
//       .uniqBy(o => `${o.type}-${o.index}`)
//       .filter(o => o.main && (o.dx == 0 || o.dy == 0) && o.step >= 0 && o.step <= 3)
//       .value();
  
//     return passive >= filtered.length
//   };
  
//   public filterSafeScareLevel2 = function(scare, passive) {
//     const filtered = _(scare)
//       .uniqBy(o => `${o.type}-${o.index}`)
//       .filter(o => o.main && o.step >= 0)
//       .value();
  
//     return passive >= filtered.length;
//   };
  
//   public filterSafeScareLevel3 = function(scare, passive) {
//     const filtered = _(scare)
//       .uniqBy(o => `${o.type}-${o.index}`)
//       .filter(o => (o.main && o.step >= 0) || o.step <= 3)
//       .value();
  
//     return passive >= filtered.length;
//   };
  
//   public conditionBombFn = function(node, tpc, remain) {
//     const {
//       travelCost,
//       value,
//       bombProfit,
//       flameRemain = []
//     } = node;
  
//     if (travelCost == undefined || travelCost == null || travelCost < 0) {
//       return false;
//     }
//     if (!bombProfit) {
//       return false;
//     }
  
//     const { box, enemy, safe } = bombProfit;
  
//     const hasBenefit = travelCost >= 0 && safe == true && (this.countingScore({ box, enemy }) > 0);
  
//     if (!hasBenefit) {
//       return false;
//     }
  
//     const travelTime = tpc * travelCost;
  
//     const ff = _(flameRemain)
//       .map(f => f + 400 + tpc/2 + 300 - travelTime)
//       .filter(f => f > 0)
//       .value();
  
//     if (ff.length > 0/* && travelTime < remain + 50*/) {
//       // that pos not safe and move to that pos can not drop bomb immediately
//       return false;
//     }
  
//     return true;
//   };
  
//   public interviewBomb = function(candidates) {
//     return candidates;
//   };
  
//   public conditionBonusFn = function(node) {
//     const {
//       travelCost,
//       value,
//       scoreProfit = {}
//     } = node;
  
//     const { gifts, spoils, virus, human } = scoreProfit;
  
//     return travelCost >= 0 && (this.countingScore({ gifts, spoils, virus, human }) > 0);
//   };
  
//   public interviewBonus = function(candidates) {
//     return candidates;
//   };

//   public buildTree() {
//     return new Priority({
//       children:[]
//     });
//   }

//   public tick() {
//     this.tree.tick({}, this.blackboard);

//     return this.blackboard.get('result', true);
//   }
// }

// export default AI;
