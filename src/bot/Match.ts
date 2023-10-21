import { Manager, Socket } from 'socket.io-client';

const EV_JOIN_GAME = 'join game';
const EV_TICKTACK = 'ticktack player';

class Match {
  private host: string;
  private game: string;
  private player: string;

  private manager: Manager;
  private socket: Socket;

  private onJoinGame?: (...args: any[]) => void;

  constructor(host: string, game: string, player: string) {
    this.host = host;
    this.game = game;
    this.player = player;

    this.manager = new Manager(this.host, {
      autoConnect: true,
    });

    this.socket = this.manager.socket("/");
  }

  public connect() {
    this.socket.connect();
  }

  public disconnect() {
    this.socket.disconnect();
  }

  public registerJoinListener(callback: (...args: any[]) => void) {
    this.onJoinGame = callback;
    this.socket.on(EV_JOIN_GAME, this.onJoinGame);
  }

  public unRegisterJoinListener() {
    if (this.onJoinGame) {
      this.socket.off(EV_JOIN_GAME, this.onJoinGame);
    }
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
  }

  public dispose() {
    this.socket.off();
    this.socket.disconnect();
  }
};

export default Match;
