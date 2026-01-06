// WhatsApp notification service menggunakan Fonnte
// Tambahkan ke .env.local: VITE_FONNTE_TOKEN=your_fonnte_token

export interface NotificationData {
  phone: string;
  name: string;
  status: 'Menunggu' | 'Diproses' | 'Disetujui' | 'Ditolak';
  applicationId: string;
  applicationDate: string;
}

export const sendWhatsAppNotification = async (data: NotificationData) => {
  const token = import.meta.env.VITE_FONNTE_TOKEN;
  
  if (!token) {
    console.warn('Fonnte token not configured');
    return false;
  }

  // Format nomor HP (hapus 0 di depan, tambah 62)
  const formattedPhone = data.phone.startsWith('0') 
    ? '62' + data.phone.substring(1)
    : data.phone.startsWith('62') 
    ? data.phone 
    : '62' + data.phone;

  // Template pesan berdasarkan status
  const getMessageTemplate = (status: string) => {
    const baseInfo = `
*DINAS PERINDUSTRIAN DAN PERDAGANGAN*
Kemetrologian - Update Status Permohonan

Yth. ${data.name}

ID Permohonan: ${data.applicationId}
Tanggal Pengajuan: ${data.applicationDate}
`;

    switch (status) {
      case 'Menunggu':
        return baseInfo + `
Status: *MENUNGGU VERIFIKASI* ⏳

Permohonan Anda telah diterima dan sedang dalam antrian verifikasi. Mohon menunggu konfirmasi selanjutnya.

Terima kasih atas kesabaran Anda.`;

      case 'Diproses':
        return baseInfo + `
Status: *SEDANG DIPROSES* 🔄

Permohonan Anda sedang dalam tahap pemrosesan. Tim kami akan segera menyelesaikan verifikasi dokumen dan persyaratan.

Estimasi: 3-5 hari kerja`;

      case 'Disetujui':
        return baseInfo + `
Status: *DISETUJUI* ✅

Selamat! Permohonan Anda telah disetujui. 

Silakan datang ke kantor Dinas Perindustrian dan Perdagangan untuk pengambilan sertifikat dengan membawa:
- KTP asli
- Surat permohonan asli
- Bukti pembayaran

Jam operasional: Senin-Jumat 08:00-15:00`;

      case 'Ditolak':
        return baseInfo + `
Status: *DITOLAK* ❌

Mohon maaf, permohonan Anda tidak dapat diproses karena:
- Dokumen tidak lengkap atau tidak sesuai
- Persyaratan belum terpenuhi

Anda dapat mengajukan permohonan baru dengan melengkapi persyaratan yang diperlukan.

Untuk informasi lebih lanjut, hubungi: (0251) 8324567`;

      default:
        return baseInfo + `Status: ${status}`;
    }
  };

  const message = getMessageTemplate(data.status);

  try {
    const response = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        target: formattedPhone,
        message: message,
        countryCode: '62',
      }),
    });

    const result = await response.json();
    
    console.log('WhatsApp API Response:', result); // Debug log
    
    if (result.status) {
      console.log('WhatsApp notification sent successfully:', result);
      return true;
    } else {
      console.error('Failed to send WhatsApp notification:', result);
      console.error('Error details:', result.reason || result.message || 'Unknown error');
      return false;
    }
  } catch (error) {
    console.error('Error sending WhatsApp notification:', error);
    console.error('Phone:', formattedPhone, 'Token:', token ? 'Present' : 'Missing');
    return false;
  }
};

// Fungsi untuk mengirim notifikasi reminder tera ulang
export const sendTeraReminderNotification = async (data: {
  phone: string;
  name: string;
  businessName: string;
  expiryDate: string;
  daysLeft: number;
}) => {
  const token = import.meta.env.VITE_FONNTE_TOKEN;
  
  if (!token) return false;

  const formattedPhone = data.phone.startsWith('0') 
    ? '62' + data.phone.substring(1)
    : data.phone;

  const message = `
*DINAS PERINDUSTRIAN DAN PERDAGANGAN*
Reminder Tera Ulang ⚠️

Yth. ${data.name}
Usaha: ${data.businessName}

Sertifikat tera Anda akan berakhir dalam *${data.daysLeft} hari* pada tanggal ${data.expiryDate}.

Segera lakukan tera ulang untuk menghindari sanksi dan memastikan kepatuhan terhadap regulasi kemetrologian.

Untuk informasi lebih lanjut:
📞 (0251) 8324567
🏢 Dinas Perindustrian dan Perdagangan

*Abaikan pesan ini jika sudah melakukan tera ulang*`;

  try {
    const response = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        target: formattedPhone,
        message: message,
      }),
    });

    return await response.json();
  } catch (error) {
    console.error('Error sending reminder:', error);
    return false;
  }
};