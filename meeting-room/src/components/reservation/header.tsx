'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-xl font-bold tracking-tight text-primary">
                            디딤교회 심방일정
                        </span>
                    </Link>
                </div>
                <div className="flex items-center space-x-4">
                    <Button variant="outline" asChild>
                        <Link href="/view" className="flex items-center gap-2">
                            <Search className="h-4 w-4" />
                            <span>예약조회</span>
                        </Link>
                    </Button>
                </div>
            </div>
        </header>
    );
}
