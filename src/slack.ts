import { RTMClient } from '@slack/client';
import { Subject } from 'rxjs';

export class Slack {
  private client: RTMClient;

  messages = new Subject<string>();

  constructor(token: string) {
    this.client = new RTMClient(token);

    this.client.on('message', this.onMessage.bind(this));
    this.client.on('connecting', this.onConnecting.bind(this));
    this.client.on('disconnecting', this.onDisconnecting.bind(this));
    this.client.on('disconnected', this.onDisconnect.bind(this));
    this.client.on('reconnecting', this.onReconnecting.bind(this));
    this.client.on('unable_to_rtm_start', this.onErrorStart.bind(this));
    this.client.on('error', this.onError.bind(this));
  }

  onConnecting() {
    console.log('[Slack]: connecting to slack API...');
  }

  onDisconnecting() {
    console.log('[Slack]: disconnecting from slack API...');
  }

  onDisconnect() {
    console.error('[Slack]: disconnected from slack!');
  }

  onReconnecting() {
    console.log('[Slack]: reconnecting to slack API...');
  }

  onErrorStart(error: Error) {
    console.error(JSON.stringify(error, null, 2));
  }

  onError(error: Error) {
    console.error(JSON.stringify(error, null, 2));
  }

  onMessage(message: any) {
    // console.dir(message, { depth: null });
    if (message.text) {
      this.messages.next(message.text);
    } else if (message.attachments && message.attachments.length && message.attachments[0].title) {
      this.messages.next(message.attachments[0].title);
    }
  }

  async connect() {
    try {
      await this.client.start();
    } catch (err) {
      console.error(`[Slack]: err = ${err}`);
    }
    console.log(`[Slack]: connected to slack!`);
  }

  disconnect() {
    return this.client.disconnect();
  }
}
