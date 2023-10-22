/* eslint-disable @typescript-eslint/no-useless-constructor */
import {
  Scene,
  Cameras,
  Tilemaps,
  Types,
  GameObjects,
} from 'phaser';

import {
  Player,
  Spoil,
  Bomb,
} from '../entities';

import {
  TILE_SIZE,
  EXPLOSION_DIRECTIONS,
} from '../config';

export class Play extends Scene {
  private camera?: Cameras.Scene2D.Camera;
  private tilemap?: Tilemaps.Tilemap;
  private players: any = {};
  private unregister?: any;

  private spoils = new GameObjects.Group(this, []);
  private bombs = new GameObjects.Group(this, []);

  constructor(config: any) {
    super(config);
  };

  init() {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor('#24252A');
  };

  preload() {
    const frameConfig = { frameWidth: TILE_SIZE, frameHeight: TILE_SIZE } as Types.Loader.FileTypes.ImageFrameConfig;

    this.load.image("grounds", "images/training_map_2023.png");

    this.load.spritesheet("spoils", "images/spoils_tile_2023.png", frameConfig);
    this.load.spritesheet("player1", "images/player1_2023.png", frameConfig);
    this.load.spritesheet("player2", "images/player2_2023.png", frameConfig);

    this.load.spritesheet("bombs", "images/bombs.png", frameConfig);
    this.load.spritesheet("explosion_center", "/images/explosion_center.png", frameConfig);
    this.load.spritesheet("explosion_horizontal", "/images/explosion_horizontal.png", frameConfig);
    this.load.spritesheet("explosion_vertical", "/images/explosion_vertical.png", frameConfig);
    this.load.spritesheet("explosion_up", "/images/explosion_up.png", frameConfig);
    this.load.spritesheet("explosion_right", "/images/explosion_right.png", frameConfig);
    this.load.spritesheet("explosion_down", "/images/explosion_down.png", frameConfig);
    this.load.spritesheet("explosion_left", "/images/explosion_left.png", frameConfig);
  };
  
  create() {
    const mapConfig = this.registry.get("mapConfig");
    const mode = this.registry.get("mode");

    const {
      map_info: {
        map,
        size: { rows, cols },
        players,
      }
    } = mapConfig;

    const size =  mode === "training" ? 35 : 55;

    this.tilemap = this.make.tilemap({
      data: map,
      tileWidth: size,
      tileHeight: size,
    });

    const grounds = this.tilemap.addTilesetImage('grounds', 'grounds');
    this.tilemap.createLayer(0, grounds!);
    this.tilemap.setCollision([1, 2, 5]);

    this.addPlayers(players, { size });

    this.setupCamera({ cols, rows, size});

    // console.log("register event");
    const match = this.registry.get("match");
    this.unregister = match?.registerTicktack(this.onTicktack.bind(this));
  };

  addPlayers(players: [], { size }: any) {
    const mainPlayer = this.registry.get("player");

    for (const player of players) {
      const {
        id,
        currentPosition: { col, row }
      } = player;

      const p = new Player(
        this,
        col,
        row,
        id === mainPlayer ? "player1" : "player2",
        15,
        {
          id,
          size,
        }
      );

      this.players[id] = p;
    }
  }

  setupCamera({ cols, rows, size}: any) {
    const viewport = this.scale.getViewPort();

    const w = cols * size;
    const h = rows * size;

    if (w/h > viewport.width/viewport.height) {
      // zoom follow width
      const zoomlevel = viewport.width / w;
      const diff = viewport.height - h * zoomlevel;

      console.log(
        "setup camera",
        {
          width: viewport.width,
          height: viewport.height,
        },
        {
          width: w,
          height: h,
        },
        diff,
        zoomlevel,
      )

      this.camera?.setBounds(
        viewport.x,
        viewport.y - (0.5 * diff / zoomlevel),
        w,
        h,
        // viewport.width,
        // viewport.height,
      );
      this.camera?.setZoom(zoomlevel);
    } else {
      const zoomlevel = viewport.height / h;
      const diff = viewport.width - w * zoomlevel;

      this.camera?.setBounds(
        viewport.x - (0.5 * diff / zoomlevel),
        viewport.y,
        // viewport.width,
        // viewport.height,
        w,
        h,
      );
      this.camera?.setZoom(zoomlevel);
    }
  }

  // shoud be thrott
  onTicktack(json: any) {
    // console.log("on ticktack", json);
    // console.log("receive event");
    
    const mode = this.registry.get("mode");
    const size =  mode === "training" ? 35 : 55;

    const {
      map_info: {
        map,
        players,
        bombs,
        spoils,
        size: { rows, cols },
      }
    } = json;

    this.updateMap(map, { rows, cols });
    this.updateSpoils(spoils, { size });
    this.updateBombs(bombs, { players, map });
    this.updatePlayers(players);
  }

  updateMap(map: [][], { rows, cols }: any) {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const tile = this.tilemap?.getTileAt(j, i, undefined, 0);

        if (tile?.index !== map[i][j]) {
          this.tilemap?.fill?.(map[i][j], j, i, undefined, undefined, true, 0);
        }
      }
    }
  }

  updateSpoils(spoils: [], { size }: any) {
    for (let i = this.spoils.children.size - 1; i >= 0; i--) {
      const s = this.spoils.getChildren().at(i) as Spoil;
      const { col, row } = s;

      const index = spoils.findIndex((s: any) => s.row === row && s.col === col);

      if (index < 0) {
        s.destroy(true);

        this.spoils.killAndHide(s);
      }
    }

    for (const spoil of spoils) {
      const { col, row, spoil_type } = spoil;

      const index = (this.spoils.getChildren() as Bomb[]).findIndex(s => s.row === row && s.col === col);

      if (index < 0) {
        const s = new Spoil(
          this,
          col,
          row,
          "spoils",
          Spoil.mapTypeToFrame(spoil_type),
          { size }
        );

        this.spoils.add(s);
      }
    }
  }

  updateBombs(bombs: [], { players, map }: any) {
    for (let i = this.bombs.children.size - 1; i >= 0; i--) {
      const b = this.bombs.getChildren().at(i) as Bomb;
      const { col, row } = b;

      const index = bombs.findIndex((s: any) => s.row === row && s.col === col);

      if (index < 0) {
        b.destroy(true);

        this.bombs.killAndHide(b);
        // this.bombs.splice(i, 1);
      }
    }

    const playerPower = players.reduce((state: any, current: any) => {
      const { id, power } = current;

      return {
        ...state,
        [id]: power,
      }
    }, {});

    for (const bomb of bombs) {
      const { col, row, playerId } = bomb;

      const index = (this.bombs.getChildren() as Bomb[]).findIndex((b) => b.row === row && b.col === col);

      if (index < 0) {
        const power = playerPower[playerId] || 1;

        const blasted = this.calculateBlasted(bomb, power, map);
        const b = new Bomb(
          this,
          col,
          row,
          "bombs",
          undefined,
          { blasted }
        );

        this.bombs.add(b);
      }
    }
  }

  calculateBlasted(bomb: any, power: number, map: any) {
    const { col, row } = bomb;
    const blasted = [];

    blasted.push({
      row,
      col,
      type: 'explosion_center',
      destroyed: false,
      stopped: false,
    });

    for (const direction of EXPLOSION_DIRECTIONS) {
      for (let i = 1; i <= power; i++) {
        const currentRow = row + (direction.y * i);
        const currentCol = col + (direction.x * i);

        const cell = map[currentRow][currentCol];
        const stopped = [1, 2, 5].includes(cell);
        const destroyed = [2].includes(cell);
        const isLast = (i === power);

        if (stopped || destroyed || isLast) {
          blasted.push({
            row: currentRow,
            col: currentCol,
            type: 'explosion_' + direction.end,
            destroyed,
            stopped,
          });

          break;
        }

        blasted.push({
          row: currentRow,
          col: currentCol,
          type: 'explosion_' + direction.plumb,
          destroyed: destroyed,
          stopped,
        });
      }
    }

    return blasted;
  }

  updatePlayers(players: []) {
    for (const player of players) {
      const {
        id,
        currentPosition: { col, row },
        speed,
      } = player;

      this.players[id]?.goTo?.({ x: col, y: row }, speed);
    }
  }

  update() {
  };

  destroy() {
    console.log("scene destroy 1");
    this.unregister?.();
    this.tilemap = undefined;
  }
};
