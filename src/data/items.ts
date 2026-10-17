export type Item = {
  slug: string;
  name: string;
  description: string;
  featured: boolean;
};

export const items: Item[] = [
  {
    slug: 'brand',
    name: 'ブランド品',
    description: 'バッグ・財布・小物など',
    featured: true,
  },
  {
    slug: 'watch',
    name: '腕時計',
    description: '高級時計から国産時計まで',
    featured: true,
  },
  {
    slug: 'jewelry',
    name: '宝石・ジュエリー',
    description: 'ダイヤ・指輪・ネックレスなど',
    featured: true,
  },
  {
    slug: 'gold',
    name: '金・貴金属',
    description: '金・プラチナ・コインなど',
    featured: true,
  },
  {
    slug: 'camera',
    name: 'カメラ',
    description: 'フィルム・デジタル問わず',
    featured: true,
  },
  {
    slug: 'antique',
    name: '骨董品・古美術',
    description: '絵画・茶道具・陶磁器など',
    featured: true,
  },
  {
    slug: 'alcohol',
    name: 'お酒',
    description: 'ウイスキー・ブランデー・ワインなど',
    featured: false,
  },
  {
    slug: 'coins',
    name: '古銭・記念硬貨・小判',
    description: '記念硬貨・古い硬貨・小判など',
    featured: false,
  },
  {
    slug: 'gift-cards',
    name: '金券・ギフト券',
    description: '商品券・ギフトカードなど',
    featured: false,
  },
  {
    slug: 'stamps',
    name: '切手',
    description: '普通切手・記念切手・切手シートなど',
    featured: false,
  },
  {
    slug: 'telephone-cards',
    name: 'テレホンカード',
    description: '未使用のテレホンカードなど',
    featured: false,
  },
  {
    slug: 'weapons',
    name: '武器・刀剣',
    description: '刀剣・鍔・刀装具など',
    featured: false,
  },
  {
    slug: 'kimono',
    name: '着物',
    description: '着物・帯・和装小物など',
    featured: false,
  },
  {
    slug: 'clothing',
    name: '衣類',
    description: '洋服・コート・ジャケットなど',
    featured: false,
  },
  {
    slug: 'shoes',
    name: '靴',
    description: 'スニーカー・革靴・ブーツなど',
    featured: false,
  },
  {
    slug: 'appliances',
    name: '家電',
    description: '生活家電・オーディオ機器など',
    featured: false,
  },
  {
    slug: 'mobile-phones',
    name: '携帯電話',
    description: 'スマートフォン・携帯電話など',
    featured: false,
  },
];
