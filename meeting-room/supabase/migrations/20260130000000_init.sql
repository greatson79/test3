-- 1. 테이블 삭제 (초기화용)
DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS visit_categories;

-- 2. 심방 종류 테이블 생성
CREATE TABLE visit_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- 3. 예약 정보 테이블 생성
CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL REFERENCES visit_categories(id) ON DELETE CASCADE,
    visit_date DATE NOT NULL,
    visit_time SMALLINT NOT NULL CHECK (visit_time >= 9 AND visit_time <= 21),
    guest_name VARCHAR(50) NOT NULL,
    guest_phone VARCHAR(20) NOT NULL,
    guest_password CHAR(4) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- 중복 예약 방지 제약조건
    CONSTRAINT uq_reservation_slot UNIQUE (category_id, visit_date, visit_time)
);

-- 4. RLS 비활성화 (요구사항)
ALTER TABLE visit_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE reservations DISABLE ROW LEVEL SECURITY;

-- 5. 인덱스 설정
CREATE INDEX idx_reservations_date ON reservations (visit_date);
CREATE INDEX idx_reservations_auth ON reservations (guest_phone, guest_password);

-- 6. 더미 데이터 삽입
INSERT INTO visit_categories (name) VALUES 
('개인심방'), 
('셀심방'), 
('긴급심방');

-- 테스트용 예약 데이터 (오늘 날짜 기준으로 몇 개 삽입)
-- 주의: 아래 insert 문은 테스트를 위해 작성되었으며, 실제 날짜에 맞춰 조정될 수 있습니다.
INSERT INTO reservations (category_id, visit_date, visit_time, guest_name, guest_phone, guest_password)
VALUES 
(1, CURRENT_DATE, 10, '홍길동', '01012345678', '1234'),
(1, CURRENT_DATE, 14, '김철수', '01011112222', '1111'),
(2, CURRENT_DATE, 11, '이영희', '01099998888', '9999');
