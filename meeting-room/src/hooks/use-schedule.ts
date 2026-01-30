import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, addDays, subDays, startOfToday } from 'date-fns';
import { reservationService } from '@/lib/services/reservation';
import { CategorySchedule } from '@/types/reservation';

export const useSchedule = () => {
    const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
    const dateString = format(selectedDate, 'yyyy-MM-dd');

    const { data: categories = [], isLoading: isLoadingCategories, isError: isErrorCategories } = useQuery({
        queryKey: ['categories'],
        queryFn: () => reservationService.getCategories(),
    });

    const { data: reservations = [], isLoading: isLoadingReservations, isError: isErrorReservations, refetch } = useQuery({
        queryKey: ['reservations', dateString],
        queryFn: () => reservationService.getReservationsByDate(dateString),
    });

    const goToNextDay = () => setSelectedDate((prev) => addDays(prev, 1));
    const goToPrevDay = () => setSelectedDate((prev) => subDays(prev, 1));
    const goToToday = () => setSelectedDate(startOfToday());

    // 전일정 슬롯 계산 (09:00 ~ 21:00)
    const schedules: CategorySchedule[] = categories.map((category) => {
        const slots = Array.from({ length: 13 }, (_, i) => {
            const time = i + 9;

            // 핵심 수정: 카테고리와 상관없이 해당 시간에 예약이 하나라도 있는지 확인
            const reservationAtThisTime = reservations.find((r) => r.visit_time === time);

            return {
                time,
                isReserved: !!reservationAtThisTime,
                reservation: reservationAtThisTime ? {
                    guest_name: reservationAtThisTime.guest_name,
                    guest_phone: reservationAtThisTime.guest_phone,
                } : undefined,
            };
        });

        return { category, slots };
    });

    return {
        selectedDate,
        dateString,
        schedules,
        isLoading: isLoadingCategories || isLoadingReservations,
        isError: isErrorCategories || isErrorReservations,
        goToNextDay,
        goToPrevDay,
        goToToday,
        refetch,
    };
};
