import { exec } from 'child_process';
import winston from 'winston';

import { Light } from './light';
import { configureLogger } from './logger';
import { Slack } from './slack';

export class App {
  private light: Light;
  private slackClient: Slack;

  constructor() {
    configureLogger();

    this.light = new Light(process.env.LIGHT_IP!, process.env.LIGHT_PORT!);
    this.slackClient = new Slack(process.env.SLACK_TOKEN!);
  }

  async start() {
    winston.info('[App]: starting...');
    await this.slackClient.connect();
    await this.light.connect();

    this.slackClient.messages.subscribe(this.onMessage.bind(this));
  }

  async stop() {
    winston.info('[App]: stopping...');
    await this.slackClient.disconnect();
    await this.light.disconnect();
  }

  async onMessage(message: string) {
    winston.info(`[App]: message: ${message}`);

    if (/unhandled error/gim.test(message)) {
      exec(`${process.env.AUDIO_PLAYER} ${__dirname}/../assets/2plus2is4.mp3`);
      await this.light.alert();
    } else if (
      /handled error/gim.test(message) ||
      /snoozed error re-occurred/gim.test(message) ||
      /\d+th event/gim.test(message)
    ) {
      exec(`${process.env.AUDIO_PLAYER} ${__dirname}/../assets/2plus2is4.mp3`);
      await this.light.warning();
    } else if (/deployment started/gim.test(message)) {
      exec(`${process.env.AUDIO_PLAYER} ${__dirname}/../assets/skia.mp3`);
      await this.light.partyTime('start');
    } else if (/deployment success/gim.test(message)) {
      exec(`${process.env.AUDIO_PLAYER} ${__dirname}/../assets/ratata.mp3`);
      await this.light.partyTime('end');
    }
  }
}
