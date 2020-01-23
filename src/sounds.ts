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
  volume: number;
};

type SoundTypes = { [K in SoundTypeEnum]: Array<SoundType> };

export const SOUNDS: SoundTypes = {
  [SoundTypeEnum.ERROR]: [
    {
      path:
        "http://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q=Et%20là%2C%20c'est%20le%20bug&tl=fr",
      start: 0,
      end: 5,
      volume: 120,
    }, // Google home
    { path: 'ytdl://qPMWYS_y6GI', start: 7.9, end: 12.2, volume: 80 }, // maaarc
    { path: 'ytdl://8j23aB4wNDk', start: 0, end: 2.5, volume: 80 }, // nananana
    { path: 'ytdl://KxrctD7Kb-Y', start: 2, end: 7, volume: 200 }, // beaucoup de sang a du couler cette nuit
    {
      path: 'ytdl://zHHcnjEJYQg',
      start: 27.2,
      end: 30.2,
      volume: 100,
    }, // 🍊 je bois heuuuu
    { path: 'ytdl://z4ClKbs9ueg', start: 3, end: 4.7, volume: 100 }, // pas un homme
    {
      path: 'ytdl://z4ClKbs9ueg',
      start: 78.2,
      end: 83,
      volume: 80,
    }, // 50% libanais 50% 🍊
    {
      path: 'ytdl://4w-D-9xn9VA',
      start: 14.5,
      end: 21.5,
      volume: 40,
    }, // never forget
    {
      path: 'ytdl://u_7O5lNpKko',
      start: 44,
      end: 49.5,
      volume: 80,
    }, // nul exposant nul, t'es nul !
    {
      path: 'ytdl://u_7O5lNpKko',
      start: 66.5,
      end: 70,
      volume: 80,
    }, // nul Mandanda !
    {
      path: 'ytdl://s5-nUCSXKac',
      start: 6.8,
      end: 7.8,
      volume: 120,
    }, // Denis: Haaaa !
    {
      path: 'ytdl://XG-z7YumzZw',
      start: 3,
      end: 6,
      volume: 80,
    }, // je suis un lama !
    {
      path: 'ytdl://zhl-Cs1-sG4',
      start: 111,
      end: 118,
      volume: 120,
    }, // Giorgio
  ],
  [SoundTypeEnum.DEPLOY_START]: [
    {
      path: 'ytdl://q6VxDM8Wd-o',
      start: 0,
      end: 7,
      volume: 130,
    }, // tkt pas
    {
      path: 'ytdl://e_nrI9crkGg',
      start: 108,
      end: 109,
      volume: 100,
    }, // skia
    {
      path: 'ytdl://zHHcnjEJYQg',
      start: 19,
      end: 22.5,
      volume: 100,
    }, // 🍊 plaisir
  ],
  [SoundTypeEnum.DEPLOY_END]: [
    {
      path: 'ytdl://e_nrI9crkGg',
      start: 101,
      end: 104,
      volume: 100,
    }, // ratata
    { path: 'ytdl://zHHcnjEJYQg', start: 13, end: 17, volume: 100 }, // 🍊 agréablement
  ],
  [SoundTypeEnum.SHUSH_SHORT]: [
    {
      path:
        'https://drive.google.com/uc?export=download&id=1zbvL8yTPoE73xzZjmdu08EbXmiQZVWcN',
      start: 0,
      end: 10,
      volume: 180,
    },
  ],
  [SoundTypeEnum.SHUSH_LONG]: [
    {
      path:
        'https://drive.google.com/uc?export=download&id=1Ra4s6zKXef2UBltb-gDMalrkYlX_uWpu',
      start: 0,
      end: 10,
      volume: 180,
    },
  ],
};
