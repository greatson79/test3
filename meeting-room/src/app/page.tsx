'use client';

import { useSchedule } from '@/hooks/use-schedule';
import { Header } from '@/components/reservation/header';
import { DateSelector } from '@/components/reservation/date-selector';
import { ScheduleList } from '@/components/reservation/schedule-list';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const {
    selectedDate,
    dateString,
    schedules,
    isLoading,
    isError,
    error,
    goToNextDay,
    goToPrevDay,
    goToToday
  } = useSchedule();

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50">
      <Header />
      <main className="container max-w-6xl mx-auto px-4">
        <DateSelector
          selectedDate={selectedDate}
          onPrev={goToPrevDay}
          onNext={goToNextDay}
          onToday={goToToday}
        />

        {isLoading ? (
          <div className="space-y-8 pb-10">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-64 w-full rounded-xl border" />
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-xl font-medium text-destructive">데이터를 불러오는 중 오류가 발생했습니다.</p>
            {error && (
              <p className="text-sm border bg-destructive/10 text-destructive p-2 rounded mt-2 max-w-lg overflow-auto text-left whitespace-pre-wrap">
                Error Detail: {error instanceof Error ? error.message : JSON.stringify(error)}
              </p>
            )}
            <p className="text-sm text-muted-foreground mt-4">Supabase 설정(환경 변수) 및 인터넷 연결을 확인해 주세요.</p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>다시 시도</Button>
          </div>
        ) : schedules.length > 0 ? (
          <ScheduleList schedules={schedules} dateString={dateString} />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-xl font-medium text-muted-foreground">표시할 심방 종류가 없습니다.</p>
            <p className="text-sm text-muted-foreground mt-1">DB에 카테고리를 추가해 주세요.</p>
          </div>
        )}
      </main>
    </div>
  );
}
