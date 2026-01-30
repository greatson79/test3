'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CategorySchedule } from '@/types/reservation';
import { useRouter } from 'next/navigation';
import { Check, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScheduleListProps {
    schedules: CategorySchedule[];
    dateString: string;
}

export function ScheduleList({ schedules, dateString }: ScheduleListProps) {
    const router = useRouter();

    const handleSlotClick = (categoryId: number, time: number, categoryName: string) => {
        const params = new URLSearchParams({
            date: dateString,
            time: time.toString(),
            categoryId: categoryId.toString(),
            categoryName: categoryName
        });
        router.push(`/form?${params.toString()}`);
    };

    return (
        <div className="grid gap-8 pb-10">
            {schedules.map(({ category, slots }) => (
                <Card key={category.id} className="overflow-hidden border-none shadow-lg bg-card/50 backdrop-blur">
                    <CardHeader className="bg-primary/5 py-4 border-b">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl font-bold">{category.name}</CardTitle>
                            <Badge variant="outline" className="bg-background">
                                {slots.filter(s => !s.isReserved).length}/13 여유
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-3">
                            {slots.map((slot) => (
                                <Button
                                    key={slot.time}
                                    variant={slot.isReserved ? "secondary" : "outline"}
                                    disabled={slot.isReserved}
                                    onClick={() => handleSlotClick(category.id, slot.time, category.name)}
                                    className={cn(
                                        "relative h-16 flex flex-col items-center justify-center gap-1 transition-all hover:scale-105",
                                        slot.isReserved
                                            ? "opacity-50 cursor-not-allowed bg-muted"
                                            : "hover:border-primary hover:bg-primary/5 border-2"
                                    )}
                                >
                                    <span className="text-sm font-bold">{slot.time}:00</span>
                                    {slot.isReserved ? (
                                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                            <Check className="h-3 w-3" /> 마감
                                        </span>
                                    ) : (
                                        <span className="text-[10px] text-primary flex items-center gap-1">
                                            <Clock className="h-3 w-3" /> 가능
                                        </span>
                                    )}
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
