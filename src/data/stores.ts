import { site } from './site.ts';

export type Store = {
  slug: string;
  name: string;
  area: string;
  address: string;
  phone: string;
  hours: string;
  access: string[];
  image: string;
  imageWidth: number;
  imageHeight: number;
  imageContentWidth?: number;
  imagePosition?: string;
};

export const stores: Store[] = [
  {
    slug: 'ginza',
    name: '銀座店',
    area: '東京都中央区',
    address: '〒104-0061 東京都中央区銀座3-4-1 大倉別館5Ｆ',
    phone: site.tel,
    hours: site.hours,
    access: [
      '東京メトロ銀座線/丸の内線/日比谷線「銀座駅」 徒歩4分',
      'JR/東京メトロ有楽町線「有楽町駅」 徒歩5分',
    ],
    imageContentWidth: 478,
    imagePosition: '48.27% center',
    image: '/images/store-ginza.jpg',
    imageWidth: 1056,
    imageHeight: 528,
  },
  {
    slug: 'hiratsuka',
    name: '平塚店',
    area: '神奈川県平塚市',
    address: '〒254-0034 神奈川県平塚市宝町３番１号 平塚ＭＮビル（商業棟）2F',
    phone: site.tel,
    hours: site.hours,
    access: ['JR平塚駅 徒歩1分'],
    image: '/images/store-hiratsuka.png',
    imageWidth: 1206,
    imageHeight: 958,
  },
  {
    slug: 'yokohama',
    name: '横浜店',
    area: '神奈川県横浜市',
    address: '〒220-0011 神奈川県横浜市西区高島2-19-12 横浜スカイビル20F',
    phone: site.tel,
    hours: site.hours,
    access: [
      'JR、京浜急行電鉄、東急電鉄東横線、相模鉄道、横浜市営地下鉄ブルーライン、みなとみらい線「横浜」駅東口 直結',
      'みなとみらい線「新高島」駅2番出口 徒歩6分',
    ],
    imageContentWidth: 364,
    image: '/images/store-yokohama.jpg',
    imageWidth: 1056,
    imageHeight: 528,
  },
];
