import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { History, Search, RefreshCw, Calendar, Download } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface RiwayatTera {
  id: number;
  jenis_data: string;
  data_id: number;
  nama_pemilik: string;
  alamat: string;
  tanggal_tera_lama: string;
  tanggal_berlaku_lama: string;
  tanggal_tera_baru: string;
  tanggal_berlaku_baru: string;
  petugas: string;
  keterangan: string;
  created_at: string;
}

const RiwayatTeraUlang: React.FC = () => {
  const [data, setData] = useState<RiwayatTera[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterJenis, setFilterJenis] = useState<string>("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const { data: riwayatData, error } = await supabase
        .from('riwayat_tera_ulang')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setData(riwayatData || []);
    } catch (error) {
      console.error("Error loading riwayat:", error);
      toast.error("Gagal memuat riwayat tera ulang");
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter((item) => {
    const matchesSearch = 
      item.nama_pemilik.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.alamat?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.petugas.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesJenis = filterJenis === "all" || item.jenis_data === filterJenis;
    
    return matchesSearch && matchesJenis;
  });

  const getJenisBadge = (jenis: string) => {
    const colors = {
      "PASAR": "bg-green-100 text-green-800",
      "SPBU": "bg-blue-100 text-blue-800", 
      "UMUM": "bg-purple-100 text-purple-800"
    };
    return <Badge className={colors[jenis as keyof typeof colors] || ""}>{jenis}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID");
  };

  const handleExport = () => {
    const exportData = filteredData.map((item, index) => ({
      No: index + 1,
      Jenis: item.jenis_data,
      NamaPemilik: item.nama_pemilik,
      Alamat: item.alamat || "-",
      TanggalTeraLama: item.tanggal_tera_lama ? formatDate(item.tanggal_tera_lama) : "-",
      TanggalBerlakuLama: item.tanggal_berlaku_lama ? formatDate(item.tanggal_berlaku_lama) : "-",
      TanggalTeraBaru: formatDate(item.tanggal_tera_baru),
      TanggalBerlakuBaru: formatDate(item.tanggal_berlaku_baru),
      Petugas: item.petugas,
      TanggalProses: formatDate(item.created_at)
    }));

    const doc = new jsPDF("landscape");
    doc.text("Riwayat Tera Ulang", 14, 15);
    autoTable(doc, {
      head: [[
        "No", "Jenis", "Nama Pemilik", "Alamat", "Tgl Tera Lama", "Tgl Berlaku Lama",
        "Tgl Tera Baru", "Tgl Berlaku Baru", "Petugas", "Tgl Proses"
      ]],
      body: exportData.map(d => Object.values(d)),
      foot: [[`Total: ${filteredData.length} riwayat`, "", "", "", "", "", "", "", "", ""]],
      styles: { fontSize: 7 },
      headStyles: { fillColor: [33, 150, 243] },
      footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: "bold" },
      startY: 20
    });
    
    doc.save("riwayat-tera-ulang.pdf");
    toast.success(`PDF berhasil diexport (${filteredData.length} riwayat)`);
  };

  const totalRiwayat = data.length;
  const riwayatPasar = data.filter(d => d.jenis_data === 'PASAR').length;
  const riwayatSpbu = data.filter(d => d.jenis_data === 'SPBU').length;
  const riwayatUmum = data.filter(d => d.jenis_data === 'UMUM').length;

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
              <History className="w-8 h-8 text-blue-600" />
              Riwayat Tera Ulang
            </h1>
            <p className="text-gray-600 mt-1">Riwayat perpanjangan masa berlaku tera</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleExport} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button onClick={loadData} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <History className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{totalRiwayat}</div>
                  <p className="text-sm text-gray-600">Total Riwayat</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{riwayatPasar}</div>
                  <p className="text-sm text-gray-600">Pasar</p>
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
                  <div className="text-2xl font-bold text-blue-600">{riwayatSpbu}</div>
                  <p className="text-sm text-gray-600">SPBU</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">{riwayatUmum}</div>
                  <p className="text-sm text-gray-600">Umum</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Riwayat ({filteredData.length})</CardTitle>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cari nama pemilik, alamat, atau petugas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={filterJenis}
                onChange={(e) => setFilterJenis(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">Semua Jenis</option>
                <option value="PASAR">Pasar</option>
                <option value="SPBU">SPBU</option>
                <option value="UMUM">Umum</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            {filteredData.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Belum ada riwayat tera ulang</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Jenis</TableHead>
                    <TableHead>Nama Pemilik</TableHead>
                    <TableHead>Alamat</TableHead>
                    <TableHead>Berlaku Lama</TableHead>
                    <TableHead>Berlaku Baru</TableHead>
                    <TableHead>Petugas</TableHead>
                    <TableHead>Tanggal Proses</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{getJenisBadge(item.jenis_data)}</TableCell>
                      <TableCell className="font-medium">{item.nama_pemilik}</TableCell>
                      <TableCell className="max-w-xs truncate">{item.alamat || '-'}</TableCell>
                      <TableCell>
                        {item.tanggal_berlaku_lama ? formatDate(item.tanggal_berlaku_lama) : '-'}
                      </TableCell>
                      <TableCell className="font-medium text-green-600">
                        {formatDate(item.tanggal_berlaku_baru)}
                      </TableCell>
                      <TableCell>{item.petugas}</TableCell>
                      <TableCell>{formatDate(item.created_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default RiwayatTeraUlang;