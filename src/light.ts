import { Yeelight, Color, FlowState, StartFlowAction } from 'yeelight-awesome';

export class Light {
  private light: Yeelight;

  private timer: NodeJS.Timeout;
  private sleep = (delay: number) =>
    new Promise(resolve => {
      this.timer = setTimeout(resolve, delay);
    });

  constructor(private ip: string, private port: string) {
    this.light = new Yeelight({ lightIp: ip, lightPort: Number(port) });

    this.light.on('connected', this.onConnected.bind(this));
    this.light.on('disconnecting', this.onDisconnecting.bind(this));
  }

  async connect() {
    console.log(`[Yeelight]: connecting to the light ${this.ip}:${this.port}...`);
    try {
      this.light.connect();
    } catch (err) {
      console.error(`[Yeelight]: err = ${err}`);
    }
  }

  async disconnect() {
    console.log(`[Yeelight]: disconnecting to the light ${this.ip}:${this.port}...`);
    if (this.timer) {
      clearTimeout(this.timer);
    }
    await this.light.setPower(false, 'smooth', 2000);
    return this.light.disconnect();
  }

  async idle() {
    console.log(`[Yeelight]: idle the light ${this.ip}:${this.port}`);
    await this.light.setPower(true, 'smooth', 2000);
    await this.light.setBright(1);
    await this.light.setRGB(new Color(0, 255, 0), 'smooth');
  }

  async alert() {
    console.log(`[Yeelight]: alert the light ${this.ip}:${this.port}`);
    if (this.timer) {
      clearTimeout(this.timer);
    }
    await this.light.startColorFlow(
      [new FlowState(800, 1, new Color(255, 0, 0).getValue(), 100), new FlowState(500, 1, new Color(255, 0, 0).getValue(), 1)],
      StartFlowAction.LED_STAY,
    );
    await this.sleep(3 * 60 * 1000);
    await this.idle();
  }

  async warning() {
    console.log(`[Yeelight]: warning the light ${this.ip}:${this.port}`);
    if (this.timer) {
      clearTimeout(this.timer);
    }
    await this.light.startColorFlow(
      [new FlowState(800, 1, new Color(241, 90, 34).getValue(), 100), new FlowState(500, 1, new Color(241, 90, 34).getValue(), 1)],
      StartFlowAction.LED_STAY,
    );
    await this.sleep(3 * 60 * 1000);
    await this.idle();
  }

  async onConnected() {
    console.log(`[Yeelight]: connected to the light ${this.ip}:${this.port}`);
    await this.idle();
  }

  onDisconnecting() {
    console.log(`[Yeelight]: disconnecting to the light ${this.ip}:${this.port}`);
  }
}
