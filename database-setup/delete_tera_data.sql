-- Script untuk menghapus semua data dari tabel tera
-- Jalankan di Supabase SQL Editor

-- Hapus semua data dari tabel data_tera_pasar
DELETE FROM data_tera_pasar;

-- Hapus semua data dari tabel data_tera_spbu  
DELETE FROM data_tera_spbu;

-- Hapus semua data dari tabel data_tera_umum
DELETE FROM data_tera_umum;

-- Reset auto increment ID (opsional)
-- ALTER SEQUENCE data_tera_pasar_id_seq RESTART WITH 1;
-- ALTER SEQUENCE data_tera_spbu_id_seq RESTART WITH 1;
-- ALTER SEQUENCE data_tera_umum_id_seq RESTART WITH 1;

-- Verifikasi data sudah terhapus
SELECT 'data_tera_pasar' as tabel, COUNT(*) as jumlah_data FROM data_tera_pasar
UNION ALL
SELECT 'data_tera_spbu' as tabel, COUNT(*) as jumlah_data FROM data_tera_spbu  
UNION ALL
SELECT 'data_tera_umum' as tabel, COUNT(*) as jumlah_data FROM data_tera_umum;