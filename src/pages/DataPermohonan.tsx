import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Search, Eye, RefreshCw, Download, ExternalLink, Edit, CheckCircle, XCircle, Clock, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../lib/supabase";
import { sendWhatsAppNotification } from "@/lib/whatsappService";

interface PengajuanTera {
  id: number;
  nama_pemilik?: string;
  nama_perusahaan?: string; // fallback for old data
  alamat?: string;
  alamat_perusahaan?: string; // fallback for old data
  no_contact?: string;
  nomor_hp?: string;
  status_pemohon?: string;
  tanggal_pengajuan?: string;
  jenis_pengajuan?: string;
  status: string;
  created_at: string;
}

const DataPermohonan: React.FC = () => {
  const [permohonan, setPermohonan] = useState<PengajuanTera[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPermohonan, setSelectedPermohonan] = useState<PengajuanTera | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadPermohonan();
  }, []);

  const loadPermohonan = async () => {
    try {
      setLoading(true);
      
      // Load from pengajuan_tera table (both types)
      const { data: teraData, error: teraError } = await supabase
        .from("pengajuan_tera")
        .select("*")
        .order("created_at", { ascending: false });

      if (teraError) throw teraError;
      
      setPermohonan(teraData || []);
    } catch (error) {
      console.error("Error loading applications:", error);
      toast.error("Gagal memuat data permohonan");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async () => {
    if (!selectedPermohonan || !newStatus) return;

    setUpdating(true);
    try {
      const { error } = await supabase
        .from("pengajuan_tera")
        .update({ status: newStatus })
        .eq("id", selectedPermohonan.id);

      if (error) throw error;

      // Kirim notifikasi WhatsApp jika nomor HP tersedia
      const phoneNumber = selectedPermohonan.no_contact || selectedPermohonan.nomor_hp;
      if (phoneNumber) {
        try {
          await sendWhatsAppNotification({
            phone: phoneNumber,
            name: selectedPermohonan.nama_pemilik || selectedPermohonan.nama_perusahaan || 'Pemohon',
            status: newStatus as 'Menunggu' | 'Diproses' | 'Disetujui' | 'Ditolak',
            applicationId: selectedPermohonan.id.toString(),
            applicationDate: selectedPermohonan.tanggal_pengajuan 
              ? formatDate(selectedPermohonan.tanggal_pengajuan)
              : formatDate(selectedPermohonan.created_at)
          });
          toast.success(`Status berhasil diubah ke ${newStatus} dan notifikasi WhatsApp terkirim`);
        } catch (notifError) {
          console.error('WhatsApp notification failed:', notifError);
          toast.success(`Status berhasil diubah ke ${newStatus} (notifikasi WhatsApp gagal)`);
        }
      } else {
        toast.success(`Status berhasil diubah ke ${newStatus}`);
      }

      setShowUpdateDialog(false);
      setNewStatus("");
      loadPermohonan();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Gagal mengubah status");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Menunggu</Badge>;
      case "Processing":
        return <Badge variant="outline"><RefreshCw className="w-3 h-3 mr-1" />Diproses</Badge>;
      case "Approved":
        return <Badge variant="default"><CheckCircle className="w-3 h-3 mr-1" />Disetujui</Badge>;
      case "Rejected":
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Ditolak</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getFileUrl = (filePath: string) => {
    if (!filePath) return null;
    try {
      const { data } = supabase.storage.from('uploads').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error) {
      console.error('Error getting file URL:', error);
      return null;
    }
  };

  const filteredPermohonan = permohonan.filter((item) =>
    (item.nama_pemilik || item.nama_perusahaan)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.jenis_pengajuan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID");
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-600" />
              Data Permohonan Tera
            </h1>
            <p className="text-gray-600 mt-1">Kelola permohonan tera dari masyarakat</p>
          </div>
          <Button onClick={loadPermohonan} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">
                    {permohonan.filter(p => p.status === 'Pending').length}
                  </div>
                  <p className="text-sm text-gray-600">Menunggu</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {permohonan.filter(p => p.status === 'Processing').length}
                  </div>
                  <p className="text-sm text-gray-600">Diproses</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {permohonan.filter(p => p.status === 'Approved').length}
                  </div>
                  <p className="text-sm text-gray-600">Disetujui</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    {permohonan.filter(p => p.status === 'Rejected').length}
                  </div>
                  <p className="text-sm text-gray-600">Ditolak</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Permohonan ({filteredPermohonan.length})</CardTitle>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cari nama pemilik atau jenis pengajuan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredPermohonan.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Tidak ada data permohonan</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Nama Pemilik</TableHead>
                    <TableHead>Alamat</TableHead>
                    <TableHead>Kontak</TableHead>
                    <TableHead>Jenis Pengajuan</TableHead>
                    <TableHead>Tanggal Pengajuan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPermohonan.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">{item.nama_pemilik || item.nama_perusahaan}</TableCell>
                      <TableCell className="max-w-xs truncate">{item.alamat || item.alamat_perusahaan || '-'}</TableCell>
                      <TableCell>{item.no_contact || item.nomor_hp || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={item.jenis_pengajuan === 'Di Kantor' ? 'default' : 'secondary'}>
                          {item.jenis_pengajuan || 'Luar Kantor'}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.tanggal_pengajuan ? formatDate(item.tanggal_pengajuan) : '-'}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedPermohonan(item);
                              setShowDetailDialog(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedPermohonan(item);
                              setNewStatus(item.status);
                              setShowUpdateDialog(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          {(item.no_contact || item.nomor_hp) && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={async () => {
                                try {
                                  await sendWhatsAppNotification({
                                    phone: item.no_contact || item.nomor_hp || '',
                                    name: item.nama_pemilik || item.nama_perusahaan || 'Pemohon',
                                    status: item.status as 'Menunggu' | 'Diproses' | 'Disetujui' | 'Ditolak',
                                    applicationId: item.id.toString(),
                                    applicationDate: item.tanggal_pengajuan 
                                      ? formatDate(item.tanggal_pengajuan)
                                      : formatDate(item.created_at)
                                  });
                                  toast.success('Notifikasi WhatsApp berhasil dikirim');
                                } catch (error) {
                                  toast.error('Gagal mengirim notifikasi WhatsApp');
                                }
                              }}
                              title="Kirim Notifikasi WhatsApp"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Detail Dialog */}
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detail Permohonan Tera</DialogTitle>
            </DialogHeader>
            {selectedPermohonan && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold">Nama Pemilik</Label>
                    <p className="text-sm text-gray-600">{selectedPermohonan.nama_pemilik || selectedPermohonan.nama_perusahaan}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Jenis Pengajuan</Label>
                    <p className="text-sm text-gray-600">{selectedPermohonan.jenis_pengajuan || 'Luar Kantor'}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Alamat</Label>
                    <p className="text-sm text-gray-600">{selectedPermohonan.alamat || selectedPermohonan.alamat_perusahaan || '-'}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Kontak</Label>
                    <p className="text-sm text-gray-600">{selectedPermohonan.no_contact || selectedPermohonan.nomor_hp || '-'}</p>
                  </div>
                  {selectedPermohonan.status_pemohon && (
                    <div>
                      <Label className="font-semibold">Status Pemohon</Label>
                      <p className="text-sm text-gray-600">{selectedPermohonan.status_pemohon}</p>
                    </div>
                  )}
                  <div>
                    <Label className="font-semibold">Tanggal Pengajuan</Label>
                    <p className="text-sm text-gray-600">{selectedPermohonan.tanggal_pengajuan ? formatDate(selectedPermohonan.tanggal_pengajuan) : '-'}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedPermohonan.status)}</div>
                  </div>
                  <div>
                    <Label className="font-semibold">Tanggal Dibuat</Label>
                    <p className="text-sm text-gray-600">{formatDate(selectedPermohonan.created_at)}</p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Update Status Dialog */}
        <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ubah Status Permohonan</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="status">Status Baru</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Menunggu</SelectItem>
                    <SelectItem value="Processing">Diproses</SelectItem>
                    <SelectItem value="Approved">Disetujui</SelectItem>
                    <SelectItem value="Rejected">Ditolak</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowUpdateDialog(false)}>
                Batal
              </Button>
              <Button onClick={updateStatus} disabled={updating}>
                {updating ? "Menyimpan..." : "Simpan"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default DataPermohonan;