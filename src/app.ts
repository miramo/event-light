import { Light } from './light';
import { Slack } from './slack';

export class App {
  private light: Light;
  private slackClient: Slack;

  constructor() {
    this.light = new Light(process.env.LIGHT_IP!, process.env.LIGHT_PORT!);
    this.slackClient = new Slack(process.env.SLACK_TOKEN!);
  }

  async start() {
    console.log('[App]: starting...');
    await this.slackClient.connect();
    await this.light.connect();

    this.slackClient.messages.subscribe(this.onMessage.bind(this));
  }

  async stop() {
    console.log('[App]: stopping...');
    await this.slackClient.disconnect();
    await this.light.disconnect();
  }

  async onMessage(message: string) {
    console.log(`[App]: message: ${message}`);

    if (/unhandled error/gim.test(message)) {
      await this.light.alert();
    } else if (/handled error/gim.test(message)) {
      await this.light.warning();
    } else if (/10th event/gim.test(message)) {
      await this.light.alert();
    } else if (/production deployment/gim.test(message)) {
      await this.light.partyTime();
    }
  }
}
