import { createClient } from '@/lib/supabase/client';
import { Reservation, VisitCategory } from '@/types/reservation';

const getSupabase = () => createClient();

export const reservationService = {
    /**
     * 모든 심방 종류(카테고리)를 가져옵니다.
     */
    async getCategories(): Promise<VisitCategory[]> {
        const { data, error } = await getSupabase()
            .from('visit_categories')
            .select('*')
            .order('id', { ascending: true });

        if (error) throw error;
        return data || [];
    },

    /**
     * 특정 날짜의 모든 예약을 가져옵니다.
     */
    async getReservationsByDate(date: string): Promise<Reservation[]> {
        const { data, error } = await getSupabase()
            .from('reservations')
            .select('*')
            .eq('visit_date', date);

        if (error) throw error;
        return data || [];
    },

    /**
     * 예약을 생성합니다.
     * DB의 Unique 제약조건(category_id, visit_date, visit_time)에 의해 중복 예약은 차단됩니다.
     */
    async createReservation(reservation: Omit<Reservation, 'id' | 'created_at'>) {
        const { data, error } = await getSupabase()
            .from('reservations')
            .insert([reservation])
            .select()
            .single();

        if (error) {
            if (error.code === '23505') {
                throw new Error('이미 예약된 시간대입니다. 다른 시간을 선택해주세요.');
            }
            throw error;
        }
        return data;
    },

    /**
     * 휴대폰 번호와 비밀번호로 예약 내역을 조회합니다.
     */
    async searchReservations(phone: string, password: string): Promise<(Reservation & { visit_categories: VisitCategory })[]> {
        const { data, error } = await getSupabase()
            .from('reservations')
            .select('*, visit_categories(*)')
            .eq('guest_phone', phone)
            .eq('guest_password', password)
            .order('visit_date', { ascending: false })
            .order('visit_time', { ascending: true });

        if (error) throw error;
        return data || [];
    }
};
