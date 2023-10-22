import { Manager, Socket } from 'socket.io-client';

import { cloneDeep } from 'lodash';

import Bot from './old';

const EV_JOIN_GAME = 'join game';
const EV_TICKTACK = 'ticktack player';

class Match {
  private host: string;
  private game: string;
  private player: string;

  private manager: Manager;
  private socket: Socket;

  private unregister?: any;

  private bot?: any

  constructor(host: string, game: string, player: string) {
    this.host = host;
    this.game = game;
    this.player = player;

    this.manager = new Manager(this.host, {
      autoConnect: true,
    });

    this.socket = this.manager.socket("/");
  }

  private handleTicktackForAi(json: any) {
    // console.log("ai thinking here", json);
    this.bot.ticktack?.(cloneDeep({ ...json }));
  }

  private onCalculated({ directs } = {} as any) {
    if (this.socket && directs) {
      // socket emit drive result to server
      this.socket.emit('drive player', { direction: directs });
    }
  }

  public connect() {
    this.socket.connect();
  }

  public disconnect() {
    this.socket.disconnect();

    this.unregister?.();
    this.unregister = null;
    this.bot = null;
  }

  private registerAi() {
    this.bot = new Bot({
      playerId: this.player,
      other: {
        rejectByStop: false // some other config. currenly, hardcode here
      }
    }, this.onCalculated.bind(this));
    this.unregister = this.registerTicktack(this.handleTicktackForAi.bind(this));
  }

  public registerJoinGame(callback: (...args: any[]) => void) {
    this.socket.on(EV_JOIN_GAME, callback);

    return () => {
      if (this.socket) {
        this.socket.off(EV_JOIN_GAME, callback);
      }
    }
  }

  public registerTicktack(callback: (...args: any[]) => void, { once = false } = {}) {
    if (once) {
      this.socket.once(EV_TICKTACK, callback);
    } else {
      this.socket.on(EV_TICKTACK, callback);
    }

    return () => {
      if (this.socket) {
        this.socket.off(EV_TICKTACK, callback);
      }
    }
  }

  public joinGame() {
    this.connect();

    this.registerAi();

    this.socket.emit(EV_JOIN_GAME, {
      game_id: this.game,
      player_id: this.player,
    });
  }

  public dispose() {
    this.unregister?.();
    this.unregister = null;

    this.socket.off();
    this.socket.disconnect();
  }
};

export default Match;
