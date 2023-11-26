import { Manager, Socket } from 'socket.io-client';
import {
  Subscription,
  fromEvent,
} from 'rxjs';

import BotManager from './new';

const EV_JOIN_GAME = 'join game';
const EV_TICKTACK = 'ticktack player';

class Match {
  private host: string;
  private game: string;
  private player: string;

  private manager: Manager;
  private socket: Socket;

  private unregister?: any;

  private bot?: any;

  private busStation?: any;
  private resultSubscription?: Subscription;

  constructor(host: string, game: string, player: string) {
    this.host = host;
    this.game = game;
    this.player = player;

    this.manager = new Manager(this.host, {
      autoConnect: true,
    });

    this.socket = this.manager.socket("/");
  }

  private onCalculated(result: any) {
    // console.log("match receive result", result);
    // console.log(this.socket);
    if (!result) {
      return;
    }

    const { watch, directs } = result;

    if (this.socket && !watch && directs) {
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

    this.bot?.dispose();
    this.bot = null;
  }

  private registerAi() {
    const ticktackObservable = fromEvent(this.socket, EV_TICKTACK);

    this.busStation = new BotManager({
      playerId: this.player,
      other: {
        rejectByStop: false // some other config. currenly, hardcode here
      }
    }, ticktackObservable);

    this.resultSubscription = this.busStation?.registerResultListener(this.onCalculated.bind(this));
  }

  public registerWatchAiResult(callback: any) {
    return this.busStation?.registerResultListener(callback);
  }

  public registerPingResult(callback: any) {
    return this.busStation?.registerPingResult(callback);
  }

  public registerDisconnect(callback: (...args: any[]) => void) {
    this.socket.on("disconnect", callback);
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

    this.socket.emit(EV_JOIN_GAME, {
      game_id: this.game,
      player_id: this.player,
    });

    this.registerAi();
  }

  public dispose() {
    this.unregister?.();
    this.unregister = null;

    this.busStation?.dispose();
    this.resultSubscription?.unsubscribe();

    this.socket.off();
    this.socket.disconnect();
  }
};

export default Match;
