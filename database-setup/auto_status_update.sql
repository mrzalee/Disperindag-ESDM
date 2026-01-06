-- Script untuk mengatur status otomatis berdasarkan tanggal berlaku
-- Jalankan di Supabase SQL Editor

-- 1. Buat fungsi untuk update status otomatis
CREATE OR REPLACE FUNCTION update_status_based_on_expiry()
RETURNS void AS $$
BEGIN
  -- Update status data_tera_pasar berdasarkan tanggal berlaku UTTP
  UPDATE data_tera_pasar 
  SET status = CASE 
    WHEN EXISTS (
      SELECT 1 FROM uttp 
      WHERE uttp.data_tera_pasar_id = data_tera_pasar.id 
      AND uttp.tanggal_berlaku < CURRENT_DATE
    ) THEN 'Tidak Aktif'
    ELSE 'Aktif'
  END,
  updated_at = NOW()
  WHERE id IN (
    SELECT DISTINCT data_tera_pasar.id 
    FROM data_tera_pasar 
    LEFT JOIN uttp ON uttp.data_tera_pasar_id = data_tera_pasar.id
  );
  
  -- Update status data_tera_spbu berdasarkan tanggal berlaku
  UPDATE data_tera_spbu 
  SET status = CASE 
    WHEN tanggal_berlaku < CURRENT_DATE THEN 'Tidak Aktif'
    ELSE 'Aktif'
  END,
  updated_at = NOW()
  WHERE tanggal_berlaku IS NOT NULL;
  
  -- Update status data_tera_umum berdasarkan tanggal berlaku UTTP
  UPDATE data_tera_umum 
  SET status = CASE 
    WHEN EXISTS (
      SELECT 1 FROM uttp 
      WHERE uttp.data_tera_umum_id = data_tera_umum.id 
      AND uttp.tanggal_berlaku < CURRENT_DATE
    ) THEN 'Tidak Aktif'
    ELSE 'Aktif'
  END,
  updated_at = NOW()
  WHERE id IN (
    SELECT DISTINCT data_tera_umum.id 
    FROM data_tera_umum 
    LEFT JOIN uttp ON uttp.data_tera_umum_id = data_tera_umum.id
  );
END;
$$ LANGUAGE plpgsql;

-- 2. Buat trigger untuk otomatis update status saat insert/update UTTP
CREATE OR REPLACE FUNCTION trigger_update_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Update status data_tera_pasar terkait
  IF TG_TABLE_NAME = 'uttp' THEN
    -- Update untuk data_tera_pasar
    IF NEW.data_tera_pasar_id IS NOT NULL OR OLD.data_tera_pasar_id IS NOT NULL THEN
      UPDATE data_tera_pasar 
      SET status = CASE 
        WHEN EXISTS (
          SELECT 1 FROM uttp 
          WHERE uttp.data_tera_pasar_id = data_tera_pasar.id 
          AND uttp.tanggal_berlaku < CURRENT_DATE
        ) THEN 'Tidak Aktif'
        ELSE 'Aktif'
      END,
      updated_at = NOW()
      WHERE id = COALESCE(NEW.data_tera_pasar_id, OLD.data_tera_pasar_id);
    END IF;
    
    -- Update untuk data_tera_umum
    IF NEW.data_tera_umum_id IS NOT NULL OR OLD.data_tera_umum_id IS NOT NULL THEN
      UPDATE data_tera_umum 
      SET status = CASE 
        WHEN EXISTS (
          SELECT 1 FROM uttp 
          WHERE uttp.data_tera_umum_id = data_tera_umum.id 
          AND uttp.tanggal_berlaku < CURRENT_DATE
        ) THEN 'Tidak Aktif'
        ELSE 'Aktif'
      END,
      updated_at = NOW()
      WHERE id = COALESCE(NEW.data_tera_umum_id, OLD.data_tera_umum_id);
    END IF;
  END IF;
  
  -- Update untuk data_tera_spbu (langsung dari tabel)
  IF TG_TABLE_NAME = 'data_tera_spbu' THEN
    NEW.status = CASE 
      WHEN NEW.tanggal_berlaku < CURRENT_DATE THEN 'Tidak Aktif'
      ELSE 'Aktif'
    END;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- 3. Buat trigger pada tabel uttp dan data_tera_spbu
DROP TRIGGER IF EXISTS uttp_status_update ON uttp;
CREATE TRIGGER uttp_status_update
  AFTER INSERT OR UPDATE OR DELETE ON uttp
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_status();

DROP TRIGGER IF EXISTS spbu_status_update ON data_tera_spbu;
CREATE TRIGGER spbu_status_update
  BEFORE INSERT OR UPDATE ON data_tera_spbu
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_status();

-- 4. Jalankan update status untuk data yang sudah ada
SELECT update_status_based_on_expiry();

-- 5. Buat scheduled job untuk update status harian (opsional - perlu extension pg_cron)
-- SELECT cron.schedule('daily-status-update', '0 1 * * *', 'SELECT update_status_based_on_expiry();');

-- Verifikasi hasil
SELECT 
  'data_tera_pasar' as tabel,
  status,
  COUNT(*) as jumlah
FROM data_tera_pasar 
GROUP BY status
UNION ALL
SELECT 
  'data_tera_spbu' as tabel,
  status,
  COUNT(*) as jumlah
FROM data_tera_spbu 
GROUP BY status
UNION ALL
SELECT 
  'data_tera_umum' as tabel,
  status,
  COUNT(*) as jumlah
FROM data_tera_umum 
GROUP BY status;