-- Add tera tracking columns to all three UTTP tables
ALTER TABLE data_tera_pasar 
ADD COLUMN IF NOT EXISTS tanggal_tera DATE,
ADD COLUMN IF NOT EXISTS tanggal_expired DATE,
ADD COLUMN IF NOT EXISTS status_tera VARCHAR(20) DEFAULT 'Belum Tera';

ALTER TABLE data_tera_spbu 
ADD COLUMN IF NOT EXISTS tanggal_tera DATE,
ADD COLUMN IF NOT EXISTS tanggal_expired DATE,
ADD COLUMN IF NOT EXISTS status_tera VARCHAR(20) DEFAULT 'Belum Tera';

ALTER TABLE data_tera_umum 
ADD COLUMN IF NOT EXISTS tanggal_tera DATE,
ADD COLUMN IF NOT EXISTS tanggal_expired DATE,
ADD COLUMN IF NOT EXISTS status_tera VARCHAR(20) DEFAULT 'Belum Tera';

-- Update existing records with sample tera dates (adjust as needed)
UPDATE data_tera_pasar 
SET tanggal_tera = CURRENT_DATE - INTERVAL '6 months',
    tanggal_expired = CURRENT_DATE + INTERVAL '6 months',
    status_tera = 'Aktif'
WHERE tanggal_tera IS NULL;

UPDATE data_tera_spbu 
SET tanggal_tera = CURRENT_DATE - INTERVAL '6 months',
    tanggal_expired = CURRENT_DATE + INTERVAL '6 months',
    status_tera = 'Aktif'
WHERE tanggal_tera IS NULL;

UPDATE data_tera_umum 
SET tanggal_tera = CURRENT_DATE - INTERVAL '6 months',
    tanggal_expired = CURRENT_DATE + INTERVAL '6 months',
    status_tera = 'Aktif'
WHERE tanggal_tera IS NULL;

-- Create unified view for tera ulang monitoring from all three tables
CREATE OR REPLACE VIEW v_tera_ulang AS
-- Data from PASAR
SELECT 
    'PASAR' as jenis_data,
    id,
    nama_pemilik,
    alamat,
    kecamatan,
    'Pasar' as kategori,
    tanggal_tera,
    tanggal_expired,
    status_tera,
    CASE 
        WHEN tanggal_expired < CURRENT_DATE THEN 'Expired'
        WHEN tanggal_expired <= CURRENT_DATE + INTERVAL '7 days' THEN 'Segera Expired'
        ELSE 'Aktif'
    END as status_monitoring,
    tanggal_expired - CURRENT_DATE as hari_tersisa
FROM data_tera_pasar
WHERE status_tera = 'Aktif'

UNION ALL

-- Data from SPBU
SELECT 
    'SPBU' as jenis_data,
    id,
    nama_pemilik,
    alamat,
    kecamatan,
    'SPBU' as kategori,
    tanggal_tera,
    tanggal_expired,
    status_tera,
    CASE 
        WHEN tanggal_expired < CURRENT_DATE THEN 'Expired'
        WHEN tanggal_expired <= CURRENT_DATE + INTERVAL '7 days' THEN 'Segera Expired'
        ELSE 'Aktif'
    END as status_monitoring,
    tanggal_expired - CURRENT_DATE as hari_tersisa
FROM data_tera_spbu
WHERE status_tera = 'Aktif'

UNION ALL

-- Data from UMUM
SELECT 
    'UMUM' as jenis_data,
    id,
    nama_pemilik,
    alamat,
    kecamatan,
    'Umum' as kategori,
    tanggal_tera,
    tanggal_expired,
    status_tera,
    CASE 
        WHEN tanggal_expired < CURRENT_DATE THEN 'Expired'
        WHEN tanggal_expired <= CURRENT_DATE + INTERVAL '7 days' THEN 'Segera Expired'
        ELSE 'Aktif'
    END as status_monitoring,
    tanggal_expired - CURRENT_DATE as hari_tersisa
FROM data_tera_umum
WHERE status_tera = 'Aktif'

ORDER BY tanggal_expired ASC;

-- Create functions to extend tera date for each table
CREATE OR REPLACE FUNCTION extend_tera_pasar(data_id INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE data_tera_pasar 
    SET tanggal_tera = CURRENT_DATE,
        tanggal_expired = CURRENT_DATE + INTERVAL '1 year',
        status_tera = 'Aktif'
    WHERE id = data_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION extend_tera_spbu(data_id INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE data_tera_spbu 
    SET tanggal_tera = CURRENT_DATE,
        tanggal_expired = CURRENT_DATE + INTERVAL '1 year',
        status_tera = 'Aktif'
    WHERE id = data_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION extend_tera_umum(data_id INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE data_tera_umum 
    SET tanggal_tera = CURRENT_DATE,
        tanggal_expired = CURRENT_DATE + INTERVAL '1 year',
        status_tera = 'Aktif'
    WHERE id = data_id;
END;
$$ LANGUAGE plpgsql;