import { exec } from 'child_process';
import winston from 'winston';
import { random } from 'lodash';

import { Light } from './light';
import { configureLogger } from './logger';
import { IMessage, Slack } from './slack';
import { SOUNDS, SoundType, SoundTypeEnum } from './sounds';

const PLAYER = 'mpv --no-video';

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
    await this.light.disconnect();
    await this.slackClient.disconnect();
  }

  async onMessage(message: IMessage) {
    const { text } = message;
    winston.info(`[App]: message: "${text}"`);

    switch (true) {
      case /event\* in/gim.test(text):
      case /unhandled error/gim.test(text):
        this.playSoundType(SoundTypeEnum.ERROR);
        await this.light.alert();
        break;
      case /handled error/gim.test(text):
      case /snoozed error re-occurred/gim.test(text):
      case /\d+th event/gim.test(text):
        this.playSoundType(SoundTypeEnum.ERROR);
        await this.light.warning();
        break;
      case /deployment started/gim.test(text):
      case /There is a new deploy in process/gim.test(text):
        this.playSoundType(SoundTypeEnum.DEPLOY_START);
        await this.light.partyTime('slow');
        break;
      case /deployment success/gim.test(text):
      case /Successful deploy/gim.test(text):
        this.playSoundType(SoundTypeEnum.DEPLOY_END);
        await this.light.partyTime('fast');
        break;
      case /chut/gim.test(text):
        this.playSoundType(SoundTypeEnum.SHUSH_SHORT);
        await this.light.shush();
        break;
      case /shush/gim.test(text):
        this.playSoundType(SoundTypeEnum.SHUSH_LONG);
        await this.light.shush();
        break;
      case /nananana/gim.test(text):
        this.playSound(SOUNDS[SoundTypeEnum.ERROR][1]);
        await this.light.shush();
        break;
      case /giorgio/gim.test(text):
        this.playSound(SOUNDS[SoundTypeEnum.ERROR][11]);
        await this.light.shush();
        break;
      case /dudule/gim.test(text):
        await this.slackClient.sendMessage(
          'Be nice with dudule !',
          message.channel,
        );
      case /say: (.+)/gim.test(text):
        const matchTTS = /say: (.+)/gim.exec(text);
        if (matchTTS && matchTTS[1]) {
          this.speak(encodeURI(matchTTS[1]));
        }
        break;
    }
  }

  private playSound(sound: SoundType) {
    winston.info(`[App]: playSound: "${sound.path}"`);
    exec(
      `${PLAYER} --start=${sound.start} --end=${sound.end} --volume=${sound.volume} "${sound.path}"`,
    );
  }

  private playSoundType(type: SoundTypeEnum) {
    this.playSound(SOUNDS[type][random(SOUNDS[type].length - 1)]);
  }

  private speak(text: string) {
    winston.info(`[App]: speak: "${text}"`);
    exec(
      `${PLAYER} "http://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q=${text}&tl=fr"`,
    );
  }
}
