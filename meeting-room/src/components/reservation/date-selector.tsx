'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface DateSelectorProps {
    selectedDate: Date;
    onPrev: () => void;
    onNext: () => void;
    onToday: () => void;
}

export function DateSelector({ selectedDate, onPrev, onNext, onToday }: DateSelectorProps) {
    return (
        <div className="flex flex-col items-center gap-4 py-6 md:flex-row md:justify-between">
            <div className="flex flex-col items-center gap-2 md:items-start">
                <h1 className="text-3xl font-extrabold tracking-tight">심방 일정 예약</h1>
                <p className="text-muted-foreground">원하시는 심방 종류와 시간을 선택해 주세요.</p>
            </div>

            <div className="flex items-center gap-4 bg-muted/50 p-2 rounded-xl border">
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={onPrev}>
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex items-center gap-2 px-4 min-w-[180px] justify-center">
                        <CalendarDays className="h-4 w-4 text-primary" />
                        <span className="font-semibold text-lg">
                            {format(selectedDate, 'yyyy년 MM월 dd일 (eee)', { locale: ko })}
                        </span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onNext}>
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                </div>
                <div className="h-6 w-[1px] bg-border mx-1" />
                <Button variant="secondary" size="sm" onClick={onToday} className="font-medium">
                    오늘
                </Button>
            </div>
        </div>
    );
}
