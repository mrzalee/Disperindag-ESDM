import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, ArrowLeft, Send } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface FormData {
  statusPemohon: string;
  namaPemilik: string;
  nomorHp: string;
  alamat: string;
  tanggalPengajuan: string;
}

const FormPengajuanTeraKantor: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    statusPemohon: "",
    namaPemilik: "",
    nomorHp: "",
    alamat: "",
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
        nomor_hp: formData.nomorHp,
        status_pemohon: formData.statusPemohon,
        tanggal_pengajuan: formData.tanggalPengajuan,
        jenis_pengajuan: "Di Kantor",
        status: "Pending"
      });

      if (error) throw error;

      toast.success("Pengajuan tera di kantor berhasil dikirim!");
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
        {/* Header */}
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
              <div className="w-14 h-14 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center shadow-md">
                <Building2 className="w-7 h-7 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-4 leading-tight">
              Form Pengajuan Tera di Kantor
            </h1>
          </div>

          <div className="bg-green-50 dark:bg-green-900/50 rounded-lg p-4 text-sm max-w-3xl mx-auto shadow-inner">
            <p className="text-green-800 dark:text-green-300 font-medium">
              Layanan tera yang dilakukan di kantor Disperindag ESDM. Silakan isi form berikut untuk mengajukan permohonan tera di kantor.
            </p>
          </div>
        </div>

        {/* Form Card */}
        <Card className="shadow-2xl border-0 bg-white dark:bg-slate-800/95 max-w-4xl mx-auto rounded-2xl overflow-hidden backdrop-blur-sm">
          <CardHeader className="text-center py-8 bg-gradient-to-r from-green-600 to-green-700 text-white">
            <CardTitle className="text-2xl font-bold">
              Formulir Pengajuan Tera di Kantor
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 lg:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Status Pemohon */}
              <div className="space-y-4">
                <Label className="text-base font-semibold text-gray-800 dark:text-gray-200">
                  Status Pemohon *
                </Label>
                <RadioGroup
                  value={formData.statusPemohon}
                  onValueChange={(value) => handleInputChange("statusPemohon", value)}
                  className="space-y-3"
                  required
                >
                  <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <RadioGroupItem value="Pemilik UTTP" id="pemilik" />
                    <Label htmlFor="pemilik" className="cursor-pointer flex-1">
                      Pemilik UTTP
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <RadioGroupItem value="Kuasa Pemilik UTTP / Pihak Ketiga / Perantara" id="kuasa" />
                    <Label htmlFor="kuasa" className="cursor-pointer flex-1">
                      Kuasa Pemilik UTTP / Pihak Ketiga / Perantara
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Nama Pemilik/Kuasa Pemilik */}
              <div className="space-y-2">
                <Label htmlFor="namaPemilik" className="text-base font-semibold text-gray-800 dark:text-gray-200">
                  Nama Pemilik/Kuasa Pemilik UTTP *
                </Label>
                <Input
                  id="namaPemilik"
                  value={formData.namaPemilik}
                  onChange={(e) => handleInputChange("namaPemilik", e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  required
                  className="h-12 text-base"
                />
              </div>

              {/* Nomor HP */}
              <div className="space-y-2">
                <Label htmlFor="nomorHp" className="text-base font-semibold text-gray-800 dark:text-gray-200">
                  Nomor HP
                </Label>
                <Input
                  id="nomorHp"
                  value={formData.nomorHp}
                  onChange={(e) => handleInputChange("nomorHp", e.target.value)}
                  placeholder="Contoh: 0812xxxxxxxx"
                  className="h-12 text-base"
                />
              </div>

              {/* Alamat */}
              <div className="space-y-2">
                <Label htmlFor="alamat" className="text-base font-semibold text-gray-800 dark:text-gray-200">
                  Alamat
                </Label>
                <Textarea
                  id="alamat"
                  value={formData.alamat}
                  onChange={(e) => handleInputChange("alamat", e.target.value)}
                  placeholder="Masukkan alamat lengkap"
                  rows={4}
                  className="text-base"
                />
              </div>

              {/* Tanggal Pengajuan */}
              <div className="space-y-2">
                <Label htmlFor="tanggalPengajuan" className="text-base font-semibold text-gray-800 dark:text-gray-200">
                  Tanggal Pengajuan Permohonan *
                </Label>
                <Input
                  id="tanggalPengajuan"
                  type="date"
                  value={formData.tanggalPengajuan}
                  onChange={(e) => handleInputChange("tanggalPengajuan", e.target.value)}
                  required
                  className="h-12 text-base"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
                <div className="max-w-md mx-auto">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    {isSubmitting ? (
                      <>
                        <Send className="w-5 h-5 mr-2 animate-pulse" />
                        Mengirim Pengajuan...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
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

export default FormPengajuanTeraKantor;