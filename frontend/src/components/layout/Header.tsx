import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import { Button } from '../task/ui/Button';
import { DarkModeToggle } from '../task/ui/DarkModeToggle';

export function Header() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">Modern Todo</span>
        </Link>

        <div className="flex items-center space-x-4">
          <DarkModeToggle />
          {isAuthenticated ? (
            <>
              <span className="text-sm">Welcome, {user?.name}</span>
              <Button onClick={logout} variant="outline" size="sm">
                Logout
              </Button>
            </>
          ) : (
            <div className="flex space-x-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}