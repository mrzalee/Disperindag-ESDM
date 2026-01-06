-- Script untuk membuat tabel riwayat tera ulang
-- Jalankan di Supabase SQL Editor

-- Buat tabel riwayat_tera_ulang
CREATE TABLE IF NOT EXISTS riwayat_tera_ulang (
  id SERIAL PRIMARY KEY,
  jenis_data VARCHAR(20) NOT NULL, -- 'PASAR', 'SPBU', 'UMUM'
  data_id INTEGER NOT NULL, -- ID dari tabel asli
  nama_pemilik TEXT NOT NULL,
  alamat TEXT,
  tanggal_tera_lama DATE,
  tanggal_berlaku_lama DATE,
  tanggal_tera_baru DATE NOT NULL,
  tanggal_berlaku_baru DATE NOT NULL,
  petugas VARCHAR(100) DEFAULT 'Admin',
  keterangan TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Buat index untuk performa
CREATE INDEX IF NOT EXISTS idx_riwayat_jenis_data ON riwayat_tera_ulang(jenis_data);
CREATE INDEX IF NOT EXISTS idx_riwayat_data_id ON riwayat_tera_ulang(data_id);
CREATE INDEX IF NOT EXISTS idx_riwayat_created_at ON riwayat_tera_ulang(created_at);

-- Enable RLS
ALTER TABLE riwayat_tera_ulang ENABLE ROW LEVEL SECURITY;

-- Policy untuk admin access
CREATE POLICY "Allow admin access riwayat" ON riwayat_tera_ulang
  FOR ALL 
  USING (auth.role() = 'authenticated');

-- Policy untuk public read (jika diperlukan)
CREATE POLICY "Allow public read riwayat" ON riwayat_tera_ulang
  FOR SELECT 
  USING (true);

-- Verifikasi tabel berhasil dibuat
SELECT 
  table_name, 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'riwayat_tera_ulang'
ORDER BY ordinal_position;