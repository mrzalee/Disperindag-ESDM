# Implementasi Status Otomatis - Data Wajib Tera (Pasar, SPBU, Umum)

## 📋 Overview

Sistem status otomatis telah diimplementasikan untuk mengelola status data wajib tera berdasarkan tanggal berlaku UTTP. Status akan otomatis berubah dari "Aktif" menjadi "Tidak Aktif" ketika tanggal berlaku sudah terlewati.

**Berlaku untuk:**
- ✅ Data Wajib Tera Pasar
- ✅ Data Wajib Tera SPBU  
- ✅ Data Wajib Tera Umum

## ✨ Fitur yang Diimplementasikan

### 1. **Status Otomatis Saat Input Data**
- ✅ Dropdown status dihapus dari form
- ✅ Status otomatis diset "Aktif" saat menambah data baru
- ✅ Tanggal berlaku otomatis 1 tahun dari tanggal tera

### 2. **Pengecekan Status Real-time**
- ✅ Status dicek setiap kali data dimuat
- ✅ Status berubah otomatis berdasarkan tanggal berlaku UTTP
- ✅ Jika ada 1 UTTP expired, seluruh data menjadi "Tidak Aktif"

### 3. **Utility Functions**
- ✅ `checkStatusByExpiry()` - Cek status berdasarkan tanggal
- ✅ `calculateExpiryDate()` - Hitung tanggal berlaku (1 tahun)
- ✅ `getStatusColor()` - Styling warna status
- ✅ `getDaysUntilExpiry()` - Hitung hari tersisa
- ✅ `isExpiringSoon()` - Cek apakah akan expired

### 4. **Database Automation**
- ✅ Function `update_status_based_on_expiry()` untuk update batch
- ✅ Trigger otomatis saat insert/update UTTP
- ✅ Script untuk update status data existing

## 🚀 Cara Penggunaan

### 1. **Setup Database**
Jalankan script SQL berikut di Supabase SQL Editor:

```sql
-- Jalankan file: database-setup/auto_status_update.sql
```

### 2. **Menambah Data Baru**
1. Buka form "Tambah Data Pasar"
2. Isi data wajib tera dan UTTP
3. Pilih tanggal tera untuk setiap UTTP
4. Status otomatis akan diset "Aktif"
5. Tanggal berlaku otomatis 1 tahun dari tanggal tera

### 3. **Monitoring Status**
- Status akan otomatis berubah saat data dimuat
- Data dengan UTTP expired akan berstatus "Tidak Aktif"
- Warna status: 🟢 Hijau (Aktif), 🔴 Merah (Tidak Aktif)

## 🔧 Technical Details

### Frontend Changes
```typescript
// File: src/pages/DataWajibTeraPasar.tsx
// File: src/pages/DataWajibTeraSPBU.tsx  
// File: src/pages/DataWajibTeraUmum.tsx
- Removed status dropdown from forms
- Added checkAndUpdateStatus() function
- Integrated utility functions
- Auto-set status to "Aktif" on new data
- Auto-calculate expiry date (1 year from tera date)

// File: src/lib/statusUtils.ts
- Utility functions for status management
- Date calculations and validations
```

### Database Changes
```sql
-- File: database-setup/auto_status_update.sql
- Function: update_status_based_on_expiry() (supports all tables)
- Trigger: uttp_status_update (for pasar & umum)
- Trigger: spbu_status_update (for spbu)
- Auto status update on UTTP/SPBU changes
```

### Logic Flow
1. **Input Data**: Status = "Aktif", Tanggal Berlaku = Tanggal Tera + 1 tahun
2. **Load Data**: 
   - **Pasar & Umum**: Cek semua UTTP, jika ada yang expired → Status = "Tidak Aktif"
   - **SPBU**: Cek tanggal berlaku langsung, jika expired → Status = "Tidak Aktif"
3. **Database Trigger**: Auto update status saat UTTP/SPBU berubah
4. **Daily Check**: Optional scheduled job untuk update harian

## 📊 Status Rules

### Data Pasar & Umum (dengan UTTP)
| Kondisi | Status | Keterangan |
|---------|--------|------------|
| Semua UTTP masih berlaku | **Aktif** | Tanggal berlaku > hari ini |
| Ada 1+ UTTP expired | **Tidak Aktif** | Tanggal berlaku ≤ hari ini |
| Data baru ditambahkan | **Aktif** | Default status |
| Tidak ada UTTP | **Aktif** | Default jika kosong |

### Data SPBU (tanpa UTTP terpisah)
| Kondisi | Status | Keterangan |
|---------|--------|------------|
| Tanggal berlaku masih valid | **Aktif** | Tanggal berlaku > hari ini |
| Tanggal berlaku expired | **Tidak Aktif** | Tanggal berlaku ≤ hari ini |
| Data baru ditambahkan | **Aktif** | Default status |

## 🎯 Benefits

### ✅ **Otomatisasi Penuh**
- Tidak perlu manual update status
- Mengurangi human error
- Konsistensi data terjamin

### ✅ **Real-time Updates**
- Status selalu up-to-date
- Trigger database otomatis
- Frontend validation

### ✅ **User Experience**
- Form lebih sederhana (tanpa dropdown status)
- Visual indicator yang jelas
- Informasi tanggal berlaku transparan

### ✅ **Data Integrity**
- Validasi di frontend dan backend
- Trigger database untuk konsistensi
- Utility functions reusable

## 🔄 Maintenance

### Manual Status Update
Jika perlu update manual semua status:
```sql
SELECT update_status_based_on_expiry();
```

### Check Status Distribution
```sql
-- Untuk semua tabel
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
```

### Find Expiring Soon (30 days)
```sql
SELECT dtp.*, u.tanggal_berlaku
FROM data_tera_pasar dtp
JOIN uttp u ON u.data_tera_pasar_id = dtp.id
WHERE u.tanggal_berlaku BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days';
```

## 🚨 Troubleshooting

### Status Tidak Update
1. Cek apakah trigger aktif: `\d+ uttp`
2. Jalankan manual update: `SELECT update_status_based_on_expiry();`
3. Periksa data UTTP: pastikan `tanggal_berlaku` terisi

### Form Error
1. Pastikan utility functions ter-import
2. Cek console untuk error JavaScript
3. Verifikasi struktur data UTTP

### Database Issues
1. Pastikan tabel `uttp` dan `data_tera_pasar` ada
2. Cek foreign key relationship
3. Verifikasi permissions RLS

---

**Status**: ✅ **Implemented & Ready**  
**Last Updated**: January 2025  
**Version**: 1.0.0