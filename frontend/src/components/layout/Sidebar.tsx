import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '../task/ui/Button';

interface SidebarProps {
  isCollapsed?: boolean;
}

export function Sidebar({ isCollapsed = false }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Tasks', href: '/dashboard/tasks' },
    { name: 'Completed', href: '/dashboard/completed' },
    { name: 'Settings', href: '/dashboard/settings' },
  ];

  if (isCollapsed) {
    return (
      <div className="hidden md:flex md:w-16 md:flex-col md:items-center md:py-4">
        <nav className="flex flex-col items-center gap-4">
          {navItems.map((item) => (
            <Button
              key={item.name}
              variant={pathname === item.href ? 'secondary' : 'ghost'}
              size="icon"
              className="rounded-lg"
              asChild
            >
              <Link href={item.href}>
                <span className="sr-only">{item.name}</span>
              </Link>
            </Button>
          ))}
        </nav>
      </div>
    );
  }

  return (
    <div className="hidden w-64 flex-col border-r p-4 md:flex">
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Button
            key={item.name}
            variant={pathname === item.href ? 'secondary' : 'ghost'}
            className={`w-full justify-start ${pathname === item.href ? 'font-semibold' : ''}`}
            asChild
          >
            <Link href={item.href}>{item.name}</Link>
          </Button>
        ))}
      </nav>
    </div>
  );
}