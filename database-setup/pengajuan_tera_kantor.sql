-- Create table for office-based tera applications
CREATE TABLE IF NOT EXISTS pengajuan_tera_kantor (
    id SERIAL PRIMARY KEY,
    status_pemohon VARCHAR(100) NOT NULL,
    nama_pemilik VARCHAR(255) NOT NULL,
    nomor_hp VARCHAR(20),
    alamat TEXT,
    tanggal_pengajuan DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE pengajuan_tera_kantor ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON pengajuan_tera_kantor
    FOR SELECT USING (true);

-- Create policy to allow public insert
CREATE POLICY "Allow public insert" ON pengajuan_tera_kantor
    FOR INSERT WITH CHECK (true);

-- Create policy to allow authenticated users to update
CREATE POLICY "Allow authenticated update" ON pengajuan_tera_kantor
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to delete
CREATE POLICY "Allow authenticated delete" ON pengajuan_tera_kantor
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_pengajuan_tera_kantor_status ON pengajuan_tera_kantor(status);
CREATE INDEX IF NOT EXISTS idx_pengajuan_tera_kantor_created_at ON pengajuan_tera_kantor(created_at);