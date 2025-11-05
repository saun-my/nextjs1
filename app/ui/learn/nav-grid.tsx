import Link from 'next/link';
import {
  BookOpenIcon,
  AcademicCapIcon,
  ChartBarIcon,
  BoltIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

const cards = [
  {
    title: 'Browse Courses',
    desc: 'Explore curated English courses by level and topic.',
    href: '/learn/courses',
    icon: BookOpenIcon,
    color: 'bg-blue-50',
  },
  {
    title: 'Beginner Path',
    desc: 'Start with A1 foundations to build basics.',
    href: '/learn/courses?query=Beginner',
    icon: AcademicCapIcon,
    color: 'bg-green-50',
  },
  {
    title: 'Practice',
    desc: 'Quick exercises to reinforce what you learned.',
    href: '/learn/practice',
    icon: BoltIcon,
    color: 'bg-yellow-50',
  },
  {
    title: 'My Progress',
    desc: 'Track completed lessons and scores.',
    href: '/learn/progress',
    icon: ChartBarIcon,
    color: 'bg-purple-50',
  },
  {
    title: 'Search Courses',
    desc: 'Find courses by keyword or level.',
    href: '/learn/courses?query=English',
    icon: MagnifyingGlassIcon,
    color: 'bg-gray-50',
  },
];

export default function LearnNavGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map(({ title, desc, href, icon: Icon, color }) => (
        <Link
          key={title}
          href={href}
          className="rounded-xl border bg-white p-4 shadow-sm transition hover:bg-gray-50"
        >
          <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${color}`}>
            <Icon className="h-6 w-6 text-gray-700" />
          </div>
          <h3 className="mt-3 text-lg font-semibold">{title}</h3>
          <p className="mt-1 text-sm text-gray-600">{desc}</p>
        </Link>
      ))}
    </div>
  );
}