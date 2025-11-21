import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Поиск контрагентов | Бизнес-анализ',
  description: 'Найдите информацию о компаниях и индивидуальных предпринимателях. Проверьте реквизиты, финансы и рейтинг надежности.',
  keywords: 'поиск контрагентов, проверка компаний, ИНН, ОГРН, рейтинг надежности',
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
