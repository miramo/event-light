import { exec } from 'child_process';
import winston from 'winston';

import { Light } from './light';
import { configureLogger } from './logger';
import { IMessage, Slack } from './slack';

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

  async onMessage(message: IMessage) {
    const { text } = message;
    winston.info(`[App]: message: "${text}"`);

    switch (true) {
      case /unhandled error/gim.test(text):
        this.playSound('2plus2is4.mp3');
        await this.light.alert();
        break;
      case /handled error/gim.test(text):
      case /snoozed error re-occurred/gim.test(text):
      case /\d+th event/gim.test(text):
        this.playSound('2plus2is4.mp3');
        await this.light.warning();
        break;
      case /deployment started/gim.test(text):
        this.playSound('skia.mp3');
        await this.light.partyTime('slow');
        break;
      case /deployment success/gim.test(text):
        this.playSound('ratata.mp3');
        await this.light.partyTime('fast');
        break;
      case /chut/gim.test(text):
        this.playSound('shush-short.mp3');
        await this.light.shush();
        break;
      case /shush/gim.test(text):
        this.playSound('shush-long.mp3');
        await this.light.shush();
        break;
      case /tg dudule/gim.test(text):
        this.playSound('dudule.mp3');
        await this.slackClient.sendMessage(
          'Be nice with dudule !',
          message.channel,
        );
        await this.light.shush();
        break;
    }
  }

  private playSound(title: string) {
    const player = process.env.AUDIO_PLAYER;
    const assetsDir = `${__dirname}/../assets`;

    exec(`${player} ${assetsDir}/${title}`);
  }
}
