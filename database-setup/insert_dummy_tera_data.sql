-- Insert dummy data for DATA TERA PASAR
INSERT INTO data_tera_pasar (nama_pedagang, nama_toko, alamat, nomor_izin, jenis_alat, merk_alat, nomor_seri, kapasitas, nama_pemilik, tanggal_tera, tanggal_expired, status_tera) VALUES
-- MASIH AKTIF
('Dedi Harapan', 'Toko Harapan', 'Jl. Pasar Pon No. 7, Kadungora', 'IZ007/2024', 'Timbangan Digital', 'Acis', 'TD007', '150 kg', 'Dedi Harapan', CURRENT_DATE - INTERVAL '200 days', CURRENT_DATE + INTERVAL '165 days', 'Aktif'),
('Ani Suherni', 'Warung Ibu Ani', 'Jl. Pasar Manis No. 18, Limbangan', 'IZ008/2024', 'Timbangan Analog', 'Nagata', 'TA008', '100 kg', 'Ani Suherni', CURRENT_DATE - INTERVAL '150 days', CURRENT_DATE + INTERVAL '215 days', 'Aktif');

-- Insert dummy data for DATA TERA SPBU
INSERT INTO data_tera_spbu (nama_spbu, alamat, nomor_izin, jenis_alat, merk_alat, nomor_seri, kapasitas, laju_alir_min, laju_alir_max, tanggal_tera, tanggal_berlaku, tanggal_expired, status_tera) VALUES
-- MASIH AKTIF
('SPBU Solar 34.44107', 'Jl. Raya Limbangan KM 20, Limbangan', 'SPBU007/2024', 'Pompa BBM', 'Tokico', 'PBM007', '50 L/min', '5 L/min', '50 L/min', CURRENT_DATE - INTERVAL '180 days', CURRENT_DATE + INTERVAL '185 days', CURRENT_DATE + INTERVAL '185 days', 'Aktif'),
('SPBU Premium 34.44108', 'Jl. Raya Kersamanah KM 25, Kersamanah', 'SPBU008/2024', 'Pompa BBM', 'Wayne', 'PBM008', '40 L/min', '4 L/min', '40 L/min', CURRENT_DATE - INTERVAL '120 days', CURRENT_DATE + INTERVAL '245 days', CURRENT_DATE + INTERVAL '245 days', 'Aktif');

-- Insert dummy data for DATA TERA UMUM
INSERT INTO data_tera_umum (nama_wajib_tera, jenis_wajib_tera, nama_usaha, nama_pemilik, alamat, nomor_izin, kapasitas, daya_baca, tanggal_tera, tanggal_expired, status_tera) VALUES
-- MASIH AKTIF
('PT. Konstruksi Baru', 'Perusahaan', 'Perusahaan Konstruksi', 'Dedi Konstruksi', 'Jl. Pembangunan No. 30, Limbangan', 'IND007/2024', '5000 kg', '0.5 kg', CURRENT_DATE - INTERVAL '160 days', CURRENT_DATE + INTERVAL '205 days', 'Aktif'),
('CV. Bengkel Modern', 'Perusahaan', 'Bengkel Otomotif Modern', 'Ani Bengkel', 'Jl. Service No. 18, Kersamanah', 'IND008/2024', '1000 kg', '0.1 kg', CURRENT_DATE - INTERVAL '100 days', CURRENT_DATE + INTERVAL '265 days', 'Aktif');