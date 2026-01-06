// Utility functions untuk status management
export const checkStatusByExpiry = (expiryDate: string | Date): 'Aktif' | 'Tidak Aktif' => {
  if (!expiryDate) return 'Aktif';
  
  const today = new Date();
  const expiry = new Date(expiryDate);
  
  return expiry >= today ? 'Aktif' : 'Tidak Aktif';
};

export const calculateExpiryDate = (teraDate: string | Date): string => {
  const tera = new Date(teraDate);
  const expiry = new Date(tera);
  expiry.setFullYear(expiry.getFullYear() + 1); // Tambah 1 tahun
  
  return expiry.toISOString().split('T')[0];
};

export const getStatusColor = (status: 'Aktif' | 'Tidak Aktif'): string => {
  return status === 'Aktif' 
    ? 'bg-green-100 text-green-800' 
    : 'bg-red-100 text-red-800';
};

export const getDaysUntilExpiry = (expiryDate: string | Date): number => {
  if (!expiryDate) return 0;
  
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

export const isExpiringSoon = (expiryDate: string | Date, daysThreshold: number = 30): boolean => {
  const daysLeft = getDaysUntilExpiry(expiryDate);
  return daysLeft > 0 && daysLeft <= daysThreshold;
};