export interface VisitCategory {
  id: number;
  name: string;
}

export interface Reservation {
  id?: number;
  category_id: number;
  visit_date: string; // ISO format (YYYY-MM-DD)
  visit_time: number; // 9 to 21
  guest_name: string;
  guest_phone: string;
  guest_password: string; // 4 digits
  created_at?: string;
}

export interface ReservationSlot {
  time: number;
  isReserved: boolean;
  reservation?: Pick<Reservation, 'guest_name' | 'guest_phone'>;
}

export interface CategorySchedule {
  category: VisitCategory;
  slots: ReservationSlot[];
}

export type ReservationFormData = {
  guest_name: string;
  guest_phone: string;
  guest_password: string;
};
