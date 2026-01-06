-- First, migrate data from pengajuan_tera_kantor to pengajuan_tera if the table exists
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'pengajuan_tera_kantor') THEN
        INSERT INTO pengajuan_tera (nama_pemilik, alamat, nomor_hp, status_pemohon, tanggal_pengajuan, jenis_pengajuan, status, created_at)
        SELECT nama_pemilik, alamat, nomor_hp, status_pemohon, tanggal_pengajuan, 'Di Kantor', status, created_at
        FROM pengajuan_tera_kantor;
    END IF;
END $$;

-- First, check if columns exist and rename them if needed
DO $$ 
BEGIN
    -- Rename nama_perusahaan to nama_pemilik if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pengajuan_tera' AND column_name = 'nama_perusahaan') THEN
        ALTER TABLE pengajuan_tera RENAME COLUMN nama_perusahaan TO nama_pemilik;
    END IF;
    
    -- Rename alamat_perusahaan to alamat if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pengajuan_tera' AND column_name = 'alamat_perusahaan') THEN
        ALTER TABLE pengajuan_tera RENAME COLUMN alamat_perusahaan TO alamat;
    END IF;
END $$;

-- Add new columns if they don't exist
ALTER TABLE pengajuan_tera 
ADD COLUMN IF NOT EXISTS tanggal_pengajuan DATE,
ADD COLUMN IF NOT EXISTS jenis_pengajuan VARCHAR(50) DEFAULT 'Luar Kantor',
ADD COLUMN IF NOT EXISTS status_pemohon VARCHAR(100),
ADD COLUMN IF NOT EXISTS nomor_hp VARCHAR(20);

-- Remove unused columns
ALTER TABLE pengajuan_tera 
DROP COLUMN IF EXISTS alamat_uttp,
DROP COLUMN IF EXISTS kecamatan,
DROP COLUMN IF EXISTS jenis_uttp,
DROP COLUMN IF EXISTS nomor_spbu,
DROP COLUMN IF EXISTS jumlah_pompa,
DROP COLUMN IF EXISTS jumlah_nozzle,
DROP COLUMN IF EXISTS nomor_surat,
DROP COLUMN IF EXISTS tanggal_surat,
DROP COLUMN IF EXISTS file_surat_url;

-- Update existing records
UPDATE pengajuan_tera 
SET tanggal_pengajuan = CURRENT_DATE 
WHERE tanggal_pengajuan IS NULL;

UPDATE pengajuan_tera 
SET jenis_pengajuan = 'Luar Kantor' 
WHERE jenis_pengajuan IS NULL;

-- Drop the separate office table if it exists
DROP TABLE IF EXISTS pengajuan_tera_kantor;