import './env';

import exitHook from 'async-exit-hook';

import { App } from './app';

async function start() {
  const app = new App();

  app.start();

  exitHook(async (cb: () => void) => {
    await app.stop();
    cb();
  });
}

start();