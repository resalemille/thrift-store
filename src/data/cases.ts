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
