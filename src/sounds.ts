export enum SoundTypeEnum {
  ERROR,
  DEPLOY_START,
  DEPLOY_END,
  SHUSH_SHORT,
  SHUSH_LONG,
}

export type SoundType = {
  path: string;
  start: number;
  end: number;
};

type SoundTypes = { [K in SoundTypeEnum]: Array<SoundType> };

export const SOUNDS: SoundTypes = {
  [SoundTypeEnum.ERROR]: [
    {
      path:
        "http://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q=Et%20là%2C%20c'est%20le%20bug&tl=fr",
      start: 0,
      end: 5,
    }, // Google home
    { path: 'ytdl://8j23aB4wNDk', start: 0, end: 2.5 }, // nananana
    { path: 'ytdl://KxrctD7Kb-Y', start: 2, end: 7 }, // beaucoup de sang a du couler cette nuit
    { path: 'ytdl://KxrctD7Kb-Y', start: 6.5, end: 8 }, // who
    {
      path: 'ytdl://zHHcnjEJYQg',
      start: 27.2,
      end: 30.2,
    }, // 🍊 je bois heuuuu
    { path: 'ytdl://z4ClKbs9ueg', start: 3, end: 4.7 }, // pas un homme
    {
      path: 'ytdl://z4ClKbs9ueg',
      start: 78.2,
      end: 83,
    }, // 50% libanais 50% 🍊
    {
      path: 'ytdl://4w-D-9xn9VA',
      start: 14.5,
      end: 21.5,
    }, // never forget
  ],
  [SoundTypeEnum.DEPLOY_START]: [
    {
      path: 'ytdl://e_nrI9crkGg',
      start: 108,
      end: 109,
    }, // skia
    {
      path: 'ytdl://zHHcnjEJYQg',
      start: 19,
      end: 22.5,
    }, // 🍊 plaisir
  ],
  [SoundTypeEnum.DEPLOY_END]: [
    {
      path: 'ytdl://e_nrI9crkGg',
      start: 101,
      end: 104,
    }, // ratata
    { path: 'ytdl://zHHcnjEJYQg', start: 13, end: 17 }, // 🍊 agréablement
  ],
  [SoundTypeEnum.SHUSH_SHORT]: [
    {
      path:
        'https://drive.google.com/uc?export=download&id=1zbvL8yTPoE73xzZjmdu08EbXmiQZVWcN',
      start: 0,
      end: 10,
    },
  ],
  [SoundTypeEnum.SHUSH_LONG]: [
    {
      path:
        'https://drive.google.com/uc?export=download&id=1Ra4s6zKXef2UBltb-gDMalrkYlX_uWpu',
      start: 0,
      end: 10,
    },
  ],
};
