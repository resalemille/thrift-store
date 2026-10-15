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
  access: string;
  features: string[];
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
  description: string;
};

export const site = {
  name: '買取のResale Mille（リセールミル）',
  shortName: 'Resale Mille',
  tel: '0120-000-000',
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
    slug: 'kanda',
    name: '神田駅前店',
    area: '東京都千代田区',
    address: '東京都千代田区神田○○ 1-2-3 つなぐビル 1F',
    phone: '03-0000-0001',
    hours: '10:00〜19:00（年中無休）',
    access: 'JR「神田駅」東口より徒歩3分',
    features: ['駅から徒歩3分', '査定無料', '予約不要'],
  },
  {
    slug: 'kichijoji',
    name: '吉祥寺店',
    area: '東京都武蔵野市',
    address: '東京都武蔵野市吉祥寺○○ 4-5-6',
    phone: '0422-00-0002',
    hours: '10:00〜19:00（火曜定休）',
    access: 'JR「吉祥寺駅」北口より徒歩5分',
    features: ['商店街すぐ', '女性査定員在籍', '出張相談可'],
  },
  {
    slug: 'yokohama',
    name: '横浜関内店',
    area: '神奈川県横浜市',
    address: '神奈川県横浜市中区関内○○ 7-8-9',
    phone: '045-000-0003',
    hours: '10:00〜18:30（水曜定休）',
    access: 'JR「関内駅」北口より徒歩4分',
    features: ['近隣駐車場あり', '査定無料', '遺品整理相談'],
  },
];

export const cases: Case[] = [
  {
    slug: 'hermes-birkin',
    title: 'エルメス バーキン30をお買取りしました',
    item: 'ブランド品',
    brand: 'エルメス',
    store: '神田駅前店',
    price: 1280000,
    date: '2026.09.02',
    image: '👜',
    description:
      'ご愛用のバッグを丁寧に査定し、状態や付属品を踏まえた参考価格をご案内しました。',
  },
  {
    slug: 'rolex-datejust',
    title: 'ロレックス デイトジャストをお買取りしました',
    item: '腕時計',
    brand: 'ロレックス',
    store: '吉祥寺店',
    price: 650000,
    date: '2026.08.28',
    image: '⌚',
    description:
      '動作や外装の状態を確認し、相場をもとに一点ずつ誠実に査定いたしました。',
  },
  {
    slug: 'diamond-ring',
    title: 'ダイヤモンドリングをお買取りしました',
    item: '宝石・ジュエリー',
    brand: 'ノーブランド',
    store: '横浜関内店',
    price: 180000,
    date: '2026.08.16',
    image: '💎',
    description:
      '鑑定書がないお品物も、専門スタッフが細部まで確認してお見積もりします。',
  },
  {
    slug: 'gold-necklace',
    title: 'K18 ネックレスをお買取りしました',
    item: '金・貴金属',
    brand: 'ノーブランド',
    store: '神田駅前店',
    price: 98000,
    date: '2026.08.10',
    image: '✨',
    description:
      '切れたネックレスや片方だけのピアスも、お気軽にお持ちください。',
  },
  {
    slug: 'leica-camera',
    title: 'フィルムカメラをお買取りしました',
    item: 'カメラ',
    brand: 'ライカ',
    store: '吉祥寺店',
    price: 220000,
    date: '2026.07.30',
    image: '📷',
    description: '年代のあるカメラも、レンズや付属品を含めて査定いたします。',
  },
  {
    slug: 'tea-bowl',
    title: '茶道具一式をお買取りしました',
    item: '骨董品・古美術',
    brand: '作家物',
    store: '横浜関内店',
    price: 75000,
    date: '2026.07.18',
    image: '🏺',
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
    'はい、ご予約なしでご利用いただけます。混雑状況によってお待ちいただく場合があるため、事前のご連絡も歓迎しております。',
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
