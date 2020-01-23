import { RTMCallResult, RTMClient } from '@slack/rtm-api';
import { WebClient } from '@slack/web-api';
import { FastRateLimit } from 'fast-ratelimit';
import _ from 'lodash';
import { Subject } from 'rxjs';
import winston from 'winston';

export interface IMessage {
  userId: string;
  channel: string;
  text: string;
}

export class Slack {
  private rtm: RTMClient;
  private web: WebClient;
  private limiter: FastRateLimit;

  messages = new Subject<IMessage>();

  constructor(token: string) {
    this.limiter = new FastRateLimit({ threshold: 3, ttl: 30 });

    this.web = new WebClient(token);
    this.rtm = new RTMClient(token);

    this.rtm.on('message', this.onMessage.bind(this));
    this.rtm.on('connecting', this.onConnecting.bind(this));
    this.rtm.on('connected', this.onConnected.bind(this));
    this.rtm.on('ready', this.onReady.bind(this));
    this.rtm.on('disconnecting', this.onDisconnecting.bind(this));
    this.rtm.on('disconnected', this.onDisconnect.bind(this));
    this.rtm.on('reconnecting', this.onReconnecting.bind(this));
    this.rtm.on('unable_to_rtm_start', this.onErrorStart.bind(this));
    this.rtm.on('error', this.onError.bind(this));
  }

  onConnecting() {
    winston.info('[Slack]: connecting to slack API...');
  }

  onConnected() {
    winston.info('[Slack]: connected to slack!');
  }

  onReady() {
    winston.info('[Slack]: slack is ready!');
  }

  onDisconnecting() {
    winston.info('[Slack]: disconnecting from slack API...');
  }

  onDisconnect() {
    winston.info('[Slack]: disconnected from slack!');
  }

  onReconnecting() {
    winston.info('[Slack]: reconnecting to slack API...');
  }

  onErrorStart(error: Error) {
    winston.error(JSON.stringify(error, null, 2));
  }

  onError(error: Error) {
    winston.error(JSON.stringify(error, null, 2));
  }

  async onMessage(message: any) {
    // console.dir(message, { depth: null });

    const { user: userId, text, attachments, channel } = message;
    let userName = '';

    if (!this.limiter.consumeSync(userId)) {
      return this.sendMessage(
        "Hey, don't be so greedy, naughty boy !",
        channel,
      );
    }

    try {
      const { user } = (await this.web.users.info({ user: userId })) as any;
      userName = user.real_name;
    } catch {
      winston.info(`[Slack]: can't get user_name`);
    }

    if (text) {
      winston.info(`[Slack]: ${userName} (${userId}) send message: "${text}"`);
      this.messages.next(_.pick(message, ['userId', 'channel', 'text']));
    } else if (attachments && attachments.length && attachments[0].title) {
      winston.info(
        `[Slack]: (${userId}) send message: "${attachments[0].title}"`,
      );
      this.messages.next({
        text: message.attachments[0].title,
        ..._.pick(message, ['userId', 'channel']),
      });
    }
  }

  async sendMessage(
    text: string,
    conversationId: string,
  ): Promise<RTMCallResult> {
    winston.info(`[Slack]: send message to ${conversationId}: "${text}"`);
    return this.rtm.sendMessage(text, conversationId);
  }

  async connect() {
    try {
      await this.rtm.start();
    } catch (err) {
      winston.error(`[Slack]: err = ${err}`);
    }
  }

  disconnect() {
    return this.rtm.disconnect();
  }
}
