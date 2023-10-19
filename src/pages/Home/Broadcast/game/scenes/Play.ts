import { Scene, GameObjects, Cameras } from 'phaser';

export class Play extends Scene {
  private helloLabel!: GameObjects.Text;
  private camera!: Cameras.Scene2D.Camera;

  init() {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor('#24252A');
  }

  create() {
    const { centerX, centerY } = this.camera;
    this.helloLabel = this.add
      .text(centerX, centerY, 'Hello World', {
        fontFamily: 'Rancho',
        fontSize: 80,
      })
      .setShadow(5, 5, '#5588EE', 0, true, true)
      .setOrigin(0.5, 0.5);
  }

  update() {
    this.helloLabel.angle += 1;
  }
};
