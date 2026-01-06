import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RefreshCw, Search, Calendar, AlertTriangle, CheckCircle, Clock, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { checkStatusByExpiry, calculateExpiryDate, getStatusColor } from "@/lib/statusUtils";
import { supabase } from "../lib/supabase";

interface TeraUlangData {
  jenis_data: string;
  id: number;
  nama_pemilik: string;
  alamat: string;
  kecamatan: string;
  kategori: string;
  tanggal_tera: string;
  tanggal_expired: string;
  status_tera: string;
  status_monitoring: string;
  hari_tersisa: number;
}

const DataTeraUlang: React.FC = () => {
  const [data, setData] = useState<TeraUlangData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load data dari semua tabel dengan UTTP untuk pasar dan umum
      const [pasarResult, spbuResult, umumResult] = await Promise.all([
        supabase.from("data_tera_pasar").select(`
          *,
          uttp:uttp!data_tera_pasar_id(*)
        `),
        supabase.from("data_tera_spbu").select("*"),
        supabase.from("data_tera_umum").select(`
          *,
          uttp:uttp!data_tera_umum_id(*)
        `)
      ]);
      
      // Transform data dan filter yang status "Tidak Aktif" atau akan expired dalam 14 hari
      const transformPasarUmum = (data: any[], jenis: string, kategori: string) => {
        return (data || []).map(item => {
          // Cek status berdasarkan UTTP
          let finalStatus = "Aktif";
          let willExpireSoon = false;
          
          if (item.uttp && item.uttp.length > 0) {
            for (const uttp of item.uttp) {
              if (uttp.tanggal_berlaku) {
                const daysLeft = getHariTersisa(uttp.tanggal_berlaku);
                if (checkStatusByExpiry(uttp.tanggal_berlaku) === "Tidak Aktif") {
                  finalStatus = "Tidak Aktif";
                  break;
                } else if (daysLeft <= 14 && daysLeft > 0) {
                  willExpireSoon = true;
                }
              }
            }
          }
          
          // Ambil tanggal berlaku terlama dari UTTP
          const oldestUttp = item.uttp?.reduce((oldest: any, current: any) => {
            if (!oldest || (current.tanggal_berlaku && current.tanggal_berlaku < oldest.tanggal_berlaku)) {
              return current;
            }
            return oldest;
          }, null);
          
          return {
            jenis_data: jenis,
            id: item.id,
            nama_pemilik: item.nama_pemilik || item.nama_pedagang || item.nama_wajib_tera,
            alamat: item.alamat,
            kecamatan: item.kecamatan || '',
            kategori: kategori,
            tanggal_tera: oldestUttp?.tanggal_tera || item.tanggal_tera || '',
            tanggal_expired: oldestUttp?.tanggal_berlaku || item.tanggal_berlaku || '',
            status_tera: finalStatus,
            status_monitoring: finalStatus === "Tidak Aktif" ? "Expired" : (willExpireSoon ? "Segera Expired" : "Aktif"),
            hari_tersisa: oldestUttp?.tanggal_berlaku ? getHariTersisa(oldestUttp.tanggal_berlaku) : 0
          };
        }).filter(item => item.status_tera === "Tidak Aktif" || item.status_monitoring === "Segera Expired"); // Tampilkan yang tidak aktif atau akan expired
      };
      
      const transformSpbu = (data: any[], jenis: string, kategori: string) => {
        return (data || []).map(item => {
          const status = checkStatusByExpiry(item.tanggal_berlaku);
          const daysLeft = getHariTersisa(item.tanggal_berlaku);
          const willExpireSoon = daysLeft <= 14 && daysLeft > 0;
          
          return {
            jenis_data: jenis,
            id: item.id,
            nama_pemilik: item.nama_spbu,
            alamat: item.alamat,
            kecamatan: item.kecamatan || '',
            kategori: kategori,
            tanggal_tera: item.tanggal_tera || '',
            tanggal_expired: item.tanggal_berlaku || '',
            status_tera: status,
            status_monitoring: status === "Tidak Aktif" ? "Expired" : (willExpireSoon ? "Segera Expired" : "Aktif"),
            hari_tersisa: daysLeft
          };
        }).filter(item => item.status_tera === "Tidak Aktif" || item.status_monitoring === "Segera Expired"); // Tampilkan yang tidak aktif atau akan expired
      };
      
      const allData = [
        ...transformPasarUmum(pasarResult.data, "PASAR", "Pasar"),
        ...transformSpbu(spbuResult.data, "SPBU", "SPBU"),
        ...transformPasarUmum(umumResult.data, "UMUM", "Umum")
      ].sort((a, b) => new Date(a.tanggal_expired).getTime() - new Date(b.tanggal_expired).getTime());
      
      setData(allData);
    } catch (error) {
      console.error("Error loading tera ulang data:", error);
      toast.error("Gagal memuat data tera ulang");
    } finally {
      setLoading(false);
    }
  };
  
  const getStatusMonitoring = (expiredDate: string) => {
    const today = new Date();
    const expired = new Date(expiredDate);
    const diffTime = expired.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Expired';
    if (diffDays <= 7) return 'Segera Expired';
    return 'Aktif';
  };
  
  const getHariTersisa = (expiredDate: string) => {
    const today = new Date();
    const expired = new Date(expiredDate);
    const diffTime = expired.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleTeraUlang = async (item: TeraUlangData) => {
    const key = `${item.jenis_data}-${item.id}`;
    setProcessingIds(prev => new Set(prev).add(key));

    try {
      const today = new Date().toISOString().split('T')[0];
      const nextYear = calculateExpiryDate(today);
      
      console.log(`Tera Ulang - ${item.jenis_data}:`, {
        id: item.id,
        today,
        nextYear,
        nama: item.nama_pemilik
      });
      
      if (item.jenis_data === "PASAR" || item.jenis_data === "UMUM") {
        // Update tabel utama
        const tableName = item.jenis_data === "PASAR" ? "data_tera_pasar" : "data_tera_umum";
        const { error: mainError } = await supabase
          .from(tableName)
          .update({ 
            status: 'Aktif',
            updated_at: new Date().toISOString()
          })
          .eq("id", item.id);

        if (mainError) {
          console.error('Main table update error:', mainError);
          throw mainError;
        }

        // Update semua UTTP terkait
        const foreignKey = item.jenis_data === "PASAR" ? "data_tera_pasar_id" : "data_tera_umum_id";
        const { error: uttpError } = await supabase
          .from("uttp")
          .update({
            tanggal_tera: today,
            tanggal_berlaku: nextYear,
            updated_at: new Date().toISOString()
          })
          .eq(foreignKey, item.id);

        if (uttpError) {
          console.error('UTTP update error:', uttpError);
          throw uttpError;
        }
        
        console.log(`${tableName} dan UTTP berhasil diupdate`);
      } else if (item.jenis_data === "SPBU") {
        // Update SPBU langsung
        const { error } = await supabase
          .from("data_tera_spbu")
          .update({
            tanggal_tera: today,
            tanggal_berlaku: nextYear,
            status: 'Aktif',
            updated_at: new Date().toISOString()
          })
          .eq("id", item.id);

        if (error) {
          console.error('SPBU update error:', error);
          throw error;
        }
        
        console.log('SPBU berhasil diupdate');
      }

      // Simpan riwayat tera ulang
      const { error: riwayatError } = await supabase
        .from('riwayat_tera_ulang')
        .insert({
          jenis_data: item.jenis_data,
          data_id: item.id,
          nama_pemilik: item.nama_pemilik,
          alamat: item.alamat,
          tanggal_tera_lama: item.tanggal_tera || null,
          tanggal_berlaku_lama: item.tanggal_expired || null,
          tanggal_tera_baru: today,
          tanggal_berlaku_baru: nextYear,
          petugas: 'Admin',
          keterangan: `Tera ulang ${item.jenis_data.toLowerCase()} - perpanjangan masa berlaku`
        });

      if (riwayatError) {
        console.error('Riwayat insert error:', riwayatError);
        // Tidak throw error karena riwayat bukan critical
      }

      toast.success(`Tera ulang berhasil untuk ${item.nama_pemilik}. Status: Aktif, Berlaku sampai: ${new Date(nextYear).toLocaleDateString('id-ID')}`);
      
      // Refresh data untuk melihat perubahan
      await loadData();
    } catch (error) {
      console.error("Error extending tera:", error);
      toast.error(`Gagal melakukan tera ulang: ${error.message}`);
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
    }
  };

  const getStatusBadge = (status: string, hari: number) => {
    switch (status) {
      case "Expired":
        return <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1" />Expired</Badge>;
      case "Segera Expired":
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Segera ({hari} hari)</Badge>;
      default:
        return <Badge variant="default"><CheckCircle className="w-3 h-3 mr-1" />Aktif</Badge>;
    }
  };

  const getKategoriBadge = (kategori: string) => {
    const colors = {
      "Pasar": "bg-green-100 text-green-800",
      "SPBU": "bg-blue-100 text-blue-800", 
      "Umum": "bg-purple-100 text-purple-800"
    };
    return <Badge className={colors[kategori as keyof typeof colors] || ""}>{kategori}</Badge>;
  };

  const filteredData = data.filter((item) =>
    item.nama_pemilik?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.alamat?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.kategori?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID");
  };

  const expiredCount = data.filter(d => d.status_monitoring === 'Expired').length;
  const segeraExpiredCount = data.filter(d => d.status_monitoring === 'Segera Expired').length;
  const aktifCount = data.filter(d => d.status_monitoring === 'Aktif').length;

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
              <RotateCcw className="w-8 h-8 text-blue-600" />
              Data Tera Ulang
            </h1>
            <p className="text-gray-600 mt-1">Data yang sudah tidak aktif atau akan expired dalam 14 hari</p>
          </div>
          <Button onClick={loadData} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">{expiredCount}</div>
                  <p className="text-sm text-gray-600">Expired</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">{segeraExpiredCount}</div>
                  <p className="text-sm text-gray-600">Segera Expired</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{data.length}</div>
                  <p className="text-sm text-gray-600">Total Data</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Data Tera Ulang ({filteredData.length})</CardTitle>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cari nama pemilik, alamat, atau kategori..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredData.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Tidak ada data yang perlu tera ulang</p>
                <p className="text-sm text-gray-400 mt-1">Semua data masih aktif</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Nama Pemilik</TableHead>
                    <TableHead>Alamat</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Tanggal Tera</TableHead>
                    <TableHead>Tanggal Expired</TableHead>
                    <TableHead>Status Monitoring</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item, index) => {
                    const key = `${item.jenis_data}-${item.id}`;
                    const isProcessing = processingIds.has(key);
                    
                    return (
                      <TableRow key={key}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">{item.nama_pemilik}</TableCell>
                        <TableCell className="max-w-xs truncate">{item.alamat}</TableCell>
                        <TableCell>{getKategoriBadge(item.kategori)}</TableCell>
                        <TableCell>{formatDate(item.tanggal_tera)}</TableCell>
                        <TableCell>{formatDate(item.tanggal_expired)}</TableCell>
                        <TableCell>{getStatusBadge(item.status_monitoring, item.hari_tersisa)}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            onClick={() => handleTeraUlang(item)}
                            disabled={isProcessing}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            {isProcessing ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <RotateCcw className="w-4 h-4 mr-1" />
                                Tera Ulang
                              </>
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default DataTeraUlang;