-- Script untuk insert data dummy SPBU untuk testing fitur segera expired
-- Jalankan di Supabase SQL Editor

-- Data SPBU yang akan expired dalam 10 hari (segera expired)
INSERT INTO data_tera_spbu (
  nama_spbu,
  alamat,
  nomor_izin,
  jenis_alat,
  merk_alat,
  nomor_seri,
  kapasitas,
  laju_alir_min,
  laju_alir_max,
  tanggal_tera,
  tanggal_berlaku,
  status
) VALUES 
(
  'SPBU Shell 34.401.01',
  'Jl. Raya Garut-Tasikmalaya KM 15',
  'SPBU/001/2024',
  'Pompa BBM',
  'Tokico',
  'TK001234',
  '50 L/min',
  '5 L/min',
  '50 L/min',
  CURRENT_DATE - INTERVAL '355 days',
  CURRENT_DATE + INTERVAL '10 days',
  'Aktif'
),
(
  'SPBU Pertamina 34.401.02',
  'Jl. Ahmad Yani No. 45, Garut',
  'SPBU/002/2024',
  'Pompa BBM',
  'Wayne',
  'WN005678',
  '40 L/min',
  '4 L/min',
  '40 L/min',
  CURRENT_DATE - INTERVAL '350 days',
  CURRENT_DATE + INTERVAL '15 days',
  'Aktif'
),
(
  'SPBU Total 34.401.03',
  'Jl. Cimanuk No. 123, Garut',
  'SPBU/003/2024',
  'Pompa BBM',
  'Gilbarco',
  'GB009876',
  '60 L/min',
  '6 L/min',
  '60 L/min',
  CURRENT_DATE - INTERVAL '352 days',
  CURRENT_DATE + INTERVAL '13 days',
  'Aktif'
);

-- Data SPBU yang sudah expired (untuk testing juga)
INSERT INTO data_tera_spbu (
  nama_spbu,
  alamat,
  nomor_izin,
  jenis_alat,
  merk_alat,
  nomor_seri,
  kapasitas,
  laju_alir_min,
  laju_alir_max,
  tanggal_tera,
  tanggal_berlaku,
  status
) VALUES 
(
  'SPBU Vivo 34.401.04',
  'Jl. Veteran No. 78, Garut',
  'SPBU/004/2024',
  'Pompa BBM',
  'Tokico',
  'TK004321',
  '45 L/min',
  '4.5 L/min',
  '45 L/min',
  CURRENT_DATE - INTERVAL '370 days',
  CURRENT_DATE - INTERVAL '5 days',
  'Aktif'
);

-- Verifikasi data yang diinsert
SELECT 
  nama_spbu,
  alamat,
  tanggal_tera,
  tanggal_berlaku,
  status,
  CASE 
    WHEN tanggal_berlaku < CURRENT_DATE THEN 'Expired'
    WHEN tanggal_berlaku <= CURRENT_DATE + INTERVAL '14 days' THEN 'Segera Expired'
    ELSE 'Aktif'
  END as status_monitoring,
  (tanggal_berlaku - CURRENT_DATE) as hari_tersisa
FROM data_tera_spbu 
WHERE nama_spbu LIKE '%34.401%'
ORDER BY tanggal_berlaku;