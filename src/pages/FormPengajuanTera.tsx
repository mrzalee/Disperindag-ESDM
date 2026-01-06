import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Upload, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";



interface FormData {
  namaPemilik: string;
  alamat: string;
  noContact: string;
  tanggalPengajuan: string;
}

const FormPengajuanTera: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    namaPemilik: "",
    alamat: "",
    noContact: "",
    tanggalPengajuan: new Date().toISOString().split('T')[0],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("pengajuan_tera").insert({
        nama_pemilik: formData.namaPemilik,
        alamat: formData.alamat,
        no_contact: formData.noContact,
        tanggal_pengajuan: formData.tanggalPengajuan,
        jenis_pengajuan: "Luar Kantor",
        status: "Pending"
      });

      if (error) throw error;

      toast.success("Pengajuan tera berhasil dikirim!");
      navigate("/");
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error("Gagal mengirim pengajuan: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gray-50 dark:bg-gray-950 m-0 p-0">
      <div className="w-full px-4 py-8">
        {/* Header dan Deskripsi */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              className="text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
          </div>

          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center shadow-md">
                <MapPin className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-4 leading-tight">
              Form Pengajuan Tera di Luar Kantor
            </h1>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/50 rounded-lg p-4 text-sm max-w-3xl mx-auto shadow-inner">
            <p className="text-blue-800 dark:text-blue-300 font-medium">
              Layanan tera yang dilakukan di lokasi usaha Anda. Petugas akan datang langsung ke tempat untuk melakukan pemeriksaan dan tera UTTP.
            </p>
          </div>
        </div>

        {/* Card Formulir - Centered */}
        <Card className="shadow-2xl border-0 bg-white dark:bg-slate-800/95 max-w-6xl mx-auto rounded-2xl overflow-hidden backdrop-blur-sm">
          <CardHeader className="text-center py-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <CardTitle className="text-2xl font-bold">
              Formulir Pengajuan Tera di Luar Kantor
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 lg:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Nama Perusahaan */}
              <div className="space-y-2">
                <Label htmlFor="namaPemilik" className="text-base font-semibold text-gray-800 dark:text-gray-200">
                  Nama Perusahaan (Pemilik/Pemakai UTTP) *
                </Label>
                <Input
                  id="namaPemilik"
                  value={formData.namaPemilik}
                  onChange={(e) => handleInputChange("namaPemilik", e.target.value)}
                  placeholder="Masukkan nama perusahaan"
                  required
                  className="h-12 text-base"
                />
              </div>

              {/* Alamat Lengkap Perusahaan */}
              <div className="space-y-2">
                <Label htmlFor="alamat" className="text-base font-semibold text-gray-800 dark:text-gray-200">
                  Alamat Lengkap Perusahaan
                </Label>
                <Textarea
                  id="alamat"
                  value={formData.alamat}
                  onChange={(e) => handleInputChange("alamat", e.target.value)}
                  placeholder="Masukkan alamat lengkap perusahaan"
                  rows={4}
                  className="text-base"
                />
              </div>

              {/* No. Contact Person */}
              <div className="space-y-2">
                <Label htmlFor="noContact" className="text-base font-semibold text-gray-800 dark:text-gray-200">
                  No. Contact Person *
                </Label>
                <Input
                  id="noContact"
                  value={formData.noContact}
                  onChange={(e) => handleInputChange("noContact", e.target.value)}
                  placeholder="Contoh: 0812xxxxxxxx"
                  required
                  className="h-12 text-base"
                />
              </div>

              {/* Tanggal Pengajuan Permohonan */}
              <div className="space-y-2">
                <Label htmlFor="tanggalPengajuan" className="text-base font-semibold text-gray-800 dark:text-gray-200">
                  Tanggal Pengajuan Permohonan
                </Label>
                <Input
                  id="tanggalPengajuan"
                  type="date"
                  value={formData.tanggalPengajuan}
                  onChange={(e) => handleInputChange("tanggalPengajuan", e.target.value)}
                  className="h-12 text-base"
                />
              </div>

              {/* Tombol Submit */}
              <div className="pt-12 border-t border-gray-200 dark:border-gray-700">
                <div className="max-w-md mx-auto">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    {isSubmitting ? (
                      <>
                        <Upload className="w-5 h-5 mr-2 animate-pulse" />
                        Mengirim Pengajuan...
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 mr-2" />
                        Kirim Pengajuan
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FormPengajuanTera;
