export type Item = {
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
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
