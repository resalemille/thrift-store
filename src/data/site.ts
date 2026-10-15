export type Item = {
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
};

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

export type Case = {
  slug: string;
  title: string;
  item: string;
  brand: string;
  store: string;
  price: number;
  date: string;
  image: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  description: string;
};

export const site = {
  name: '買取のResale Mille（リセールミル）',
  shortName: 'Resale Mille',
  tel: '0463-64-2885',
  hours: '10:00〜22:00（年中無休）',
  catch: 'あなたの「想い」を、次の世代へ繋ぐ。',
};

export const items: Item[] = [
  {
    slug: 'brand',
    name: 'ブランド品',
    description: 'バッグ・財布・小物など',
    icon: '👜',
    color: 'bg-gold-50',
  },
  {
    slug: 'watch',
    name: '腕時計',
    description: '高級時計から国産時計まで',
    icon: '⌚',
    color: 'bg-gold-50',
  },
  {
    slug: 'jewelry',
    name: '宝石・ジュエリー',
    description: 'ダイヤ・指輪・ネックレスなど',
    icon: '💎',
    color: 'bg-gold-50',
  },
  {
    slug: 'gold',
    name: '金・貴金属',
    description: '金・プラチナ・コインなど',
    icon: '✨',
    color: 'bg-gold-50',
  },
  {
    slug: 'camera',
    name: 'カメラ',
    description: 'フィルム・デジタル問わず',
    icon: '📷',
    color: 'bg-ink-50',
  },
  {
    slug: 'antique',
    name: '骨董品・古美術',
    description: '絵画・茶道具・陶磁器など',
    icon: '🏺',
    color: 'bg-gold-50',
  },
];

export const brands = [
  'エルメス',
  'ルイ・ヴィトン',
  'シャネル',
  'カルティエ',
  'ロレックス',
  'オメガ',
  'グッチ',
  'ティファニー',
];

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

export const cases: Case[] = [
  {
    slug: 'hermes-birkin',
    title: 'エルメス バーキン30をお買取りしました',
    item: 'ブランド品',
    brand: 'エルメス',
    store: '銀座店',
    price: 3000000,
    date: '2026.09.02',
    image: '/images/case-hermes-birkin.webp',
    imageAlt: 'エルメス バーキン30の黒いバッグ',
    imageWidth: 1200,
    imageHeight: 1200,
    description:
      'ご愛用のバッグを丁寧に査定し、状態や付属品を踏まえた参考価格をご案内しました。',
  },
  {
    slug: 'rolex-datejust',
    title: 'ロレックス デイトジャストをお買取りしました',
    item: '腕時計',
    brand: 'ロレックス',
    store: '平塚店',
    price: 650000,
    date: '2026.08.28',
    image: '/images/case-rolex-datejust.webp',
    imageAlt: 'ロレックス デイトジャストの腕時計',
    imageWidth: 1200,
    imageHeight: 1200,
    description:
      '動作や外装の状態を確認し、相場をもとに一点ずつ誠実に査定いたしました。',
  },
  {
    slug: 'diamond-ring',
    title: 'ダイヤモンドリングをお買取りしました',
    item: '宝石・ジュエリー',
    brand: 'ノーブランド',
    store: '銀座店',
    price: 180000,
    date: '2026.08.16',
    image: '/images/case-diamond-ring.webp',
    imageAlt: 'ダイヤモンドリング',
    imageWidth: 1200,
    imageHeight: 1200,
    description:
      '鑑定書がないお品物も、専門スタッフが細部まで確認してお見積もりします。',
  },
  {
    slug: 'gold-necklace',
    title: 'K18 ネックレスをお買取りしました',
    item: '金・貴金属',
    brand: 'ノーブランド',
    store: '横浜店',
    price: 98000,
    date: '2026.08.10',
    image: '/images/case-gold-necklace.webp',
    imageAlt: 'K18 ネックレス',
    imageWidth: 1200,
    imageHeight: 1200,
    description:
      '切れたネックレスや片方だけのピアスも、お気軽にお持ちください。',
  },
  {
    slug: 'leica-camera',
    title: 'デジタル一眼レフカメラをお買取りしました',
    item: 'カメラ',
    brand: 'ニコン',
    store: '横浜店',
    price: 220000,
    date: '2026.07.30',
    image: '/images/case-leica-camera.jpg',
    imageAlt: 'ニコンのカメラボディ',
    imageWidth: 1200,
    imageHeight: 900,
    description: '年代のあるカメラも、レンズや付属品を含めて査定いたします。',
  },
  {
    slug: 'tea-bowl',
    title: '茶道具一式をお買取りしました',
    item: '骨董品・古美術',
    brand: '作家物',
    store: '平塚店',
    price: 75000,
    date: '2026.07.18',
    image: '/images/case-tea-bowl.png',
    imageAlt: '茶箱や茶碗などの茶道具一式',
    imageWidth: 944,
    imageHeight: 1037,
    description:
      'お品物の由来がわかる箱書きや資料も、ぜひ一緒にお持ちください。',
  },
];

export const faqs = [
  [
    '査定や出張に費用はかかりますか？',
    '査定料・出張費・キャンセル料はすべて無料です。金額にご納得いただけない場合も、お気兼ねなくお断りください。',
  ],
  [
    '査定には何を持っていけばよいですか？',
    '売却をご希望の場合は、運転免許証などの本人確認書類をご持参ください。付属品や保証書がある場合は、あわせてお持ちいただくと査定の参考になります。',
  ],
  [
    '予約なしでも利用できますか？',
    '店舗での査定・買取、出張買取ともに完全予約制です。事前にお電話またはお問い合わせ窓口からご予約ください。',
  ],
  [
    '壊れている品物でも査定できますか？',
    'お品物によっては査定可能です。破損や付属品の欠品がある場合も、まずはお気軽にご相談ください。',
  ],
  [
    '出張買取はどの地域まで対応していますか？',
    '現在は東京都・神奈川県を中心に対応しています。詳細な地域については、お問い合わせ時にご案内いたします。',
  ],
];

export const news = [
  {
    date: '2026.09.05',
    category: 'お知らせ',
    title: '神田駅前店オープンのお知らせ',
  },
  {
    date: '2026.08.20',
    category: 'キャンペーン',
    title: '秋のブランドバッグ査定キャンペーンを開始しました',
  },
  {
    date: '2026.08.01',
    category: 'お知らせ',
    title: '夏季期間中の営業時間について',
  },
];
