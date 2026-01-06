# 🏛️ Sistem Kemetrologian - Dinas Perindustrian dan Perdagangan

Sistem pengelolaan data kemetrologian dengan dashboard interaktif, manajemen data UTTP, dan notifikasi WhatsApp otomatis.

## ✨ Fitur Utama

- 📊 **Dashboard Real-time** - Statistik dan charts interaktif
- 🗂️ **Data Management** - CRUD untuk data tera (Pasar, SPBU, Umum)
- 📱 **WhatsApp Notifications** - Notifikasi otomatis perubahan status
- 📋 **Riwayat Tera Ulang** - History tracking lengkap
- 🔄 **Status Automation** - Auto-check tanggal expired
- 📄 **Export PDF** - Laporan dan export data

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Charts**: Recharts
- **WhatsApp**: Fonnte API
- **Deployment**: Vercel

## 🚀 Quick Deploy

### Deploy ke Vercel (1-Click)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/disperindag-kemetrologian)

### Manual Setup

1. **Clone Repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/disperindag-kemetrologian.git
   cd disperindag-kemetrologian
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Setup Environment Variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_FONNTE_TOKEN=your_fonnte_token
   ```

4. **Setup Database**
   - Buat project di [Supabase](https://supabase.com)
   - Jalankan SQL scripts di folder `database-setup/`
   - Update environment variables

5. **Setup WhatsApp (Opsional)**
   - Daftar di [Fonnte.com](https://fonnte.com)
   - Dapatkan API token
   - Hubungkan device WhatsApp

6. **Run Development**
   ```bash
   npm run dev
   ```

## 📋 Database Setup

Jalankan SQL scripts berikut di Supabase SQL Editor:

1. `database-setup/pengajuan_tera.sql` - Tabel permohonan
2. `database-setup/create_riwayat_tera.sql` - Tabel riwayat
3. `database-setup/auto_status_update.sql` - Auto status update
4. `database-setup/insert_dummy_spbu_testing.sql` - Data testing (opsional)

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Supabase project URL | ✅ |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key | ✅ |
| `VITE_FONNTE_TOKEN` | Fonnte WhatsApp API token | ⚠️ |

## 📱 WhatsApp Setup

1. **Daftar Fonnte**
   - Buka https://fonnte.com
   - Daftar akun baru
   - Verifikasi email

2. **Setup Device**
   - Tambah device WhatsApp
   - Scan QR code
   - Pastikan status "Connected"

3. **Dapatkan Token**
   - Dashboard → API
   - Copy token ke environment variable

## 🌐 Deployment ke Vercel

### Via GitHub (Recommended)

1. **Push ke GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect Vercel**
   - Buka [vercel.com](https://vercel.com)
   - Import GitHub repository
   - Set environment variables
   - Deploy

### Environment Variables di Vercel

Di Vercel dashboard → Settings → Environment Variables:

```
VITE_SUPABASE_URL = https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY = your_supabase_anon_key
VITE_FONNTE_TOKEN = your_fonnte_token
```

## 📖 Usage

### Admin Dashboard
- Login: `/admin`
- Dashboard: Real-time statistics
- Data Management: CRUD operations
- Notifications: WhatsApp integration

### Public Forms
- Landing: `/`
- Form Permohonan: `/form-pengajuan-tera`
- Form Tera Ulang: `/form-tera-ulang`

## 🔒 Security

- Row Level Security (RLS) enabled
- Environment variables untuk credentials
- Input validation dan sanitization
- CORS protection

## 📊 Features Detail

### Dashboard Analytics
- Total pelaku usaha
- UTTP terdaftar dengan status
- Tera ulang bulanan
- Charts interaktif

### Data Management
- Data Wajib Tera (Pasar, SPBU, Umum)
- Status otomatis berdasarkan expiry
- Export PDF dengan filter tanggal
- Search dan pagination

### WhatsApp Notifications
- Otomatis saat ubah status
- Template berbeda per status
- Manual resend option
- Error handling

### Riwayat System
- Track semua tera ulang
- Filter dan search
- Export history
- Statistics

## 🐛 Troubleshooting

### Common Issues

1. **Supabase Connection Error**
   - Periksa URL dan API key
   - Pastikan RLS policies benar

2. **WhatsApp Not Sending**
   - Cek token Fonnte
   - Pastikan device connected
   - Verifikasi saldo

3. **Build Errors**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check TypeScript errors

## 📞 Support

- **Issues**: Create GitHub issue
- **Documentation**: Check README
- **Contact**: [Your Contact Info]

## 📄 License

MIT License - see [LICENSE](LICENSE) file

---

**Built with ❤️ for Dinas Perindustrian dan Perdagangan**