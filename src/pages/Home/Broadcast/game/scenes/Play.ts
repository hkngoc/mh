/* eslint-disable @typescript-eslint/no-useless-constructor */
import {
  Scene,
  Cameras,
  Tilemaps,
} from 'phaser';

import {
  Player,
  Spoil,
} from '../entities';

import { TILE_SIZE } from '../config';

export class Play extends Scene {
  private camera?: Cameras.Scene2D.Camera;
  private tilemap?: Tilemaps.Tilemap;
  private players: any = {};
  private unregister?: any;

  private spoils: Spoil[] = [];

  constructor(config: any) {
    super(config);
  };

  init() {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor('#24252A');
  };

  preload() {
    this.load.image("grounds", "images/training_map_2023.png");

    this.load.spritesheet("spoils", "images/spoils_tile_2023.png", { frameWidth: TILE_SIZE, frameHeight: TILE_SIZE });
    this.load.spritesheet("player1", "images/player1_2023.png", { frameWidth: TILE_SIZE, frameHeight: TILE_SIZE });
    this.load.spritesheet("player2", "images/player2_2023.png", { frameWidth: TILE_SIZE, frameHeight: TILE_SIZE });
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

      this.camera?.setBounds(
        viewport.x,
        viewport.y - (0.5 * diff / zoomlevel),
        viewport.width,
        viewport.height,
      );
      this.camera?.setZoom(zoomlevel);
    } else {
      const zoomlevel = viewport.height / h;
      const diff = viewport.width - w * zoomlevel;

      this.camera?.setBounds(
        viewport.x - (0.5 * diff / zoomlevel),
        viewport.y,
        viewport.width,
        viewport.height,
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
        // bombs,
        spoils,
        size: { rows, cols },
      }
    } = json;

    this.updateMap(map, { rows, cols });
    this.updateSpoils(spoils, { size });
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
    for (let i = this.spoils.length - 1; i >= 0; i--) {
      const { col, row } = this.spoils[i];

      const index = spoils.findIndex((s: any) => s.row === row && s.col === col);

      if (index < 0) {
        this.spoils[i]?.destroy(true);

        // this.spoils.splice(i, 1);
      }
    }

    for (const spoil of spoils) {
      const { col, row, spoil_type } = spoil;

      const index = this.spoils.findIndex(s => s.row === row && s.col === col);

      if (index < 0) {
        const s = new Spoil(
          this,
          col,
          row,
          "spoils",
          Spoil.mapTypeToFrame(spoil_type),
          { size }
        );

        this.spoils.push(s);
      }
    }
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
