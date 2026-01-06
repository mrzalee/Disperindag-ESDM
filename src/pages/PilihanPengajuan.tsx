import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Building2, ArrowRight } from "lucide-react";

const PilihanPengajuan: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Pilih Jenis Pengajuan Tera
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Silakan pilih jenis layanan tera yang Anda butuhkan
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Card Pengajuan Tera di Luar Kantor */}
          <Card className="group hover:shadow-2xl transition-all duration-500 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-2xl overflow-hidden transform hover:-translate-y-2 hover:scale-105">
            <CardHeader className="p-8 pb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-xl">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Pengajuan Tera di Luar Kantor
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
                Layanan tera yang dilakukan di lokasi usaha Anda. Petugas akan datang langsung ke tempat untuk melakukan pemeriksaan dan tera UTTP.
              </p>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400 mb-6">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Petugas datang ke lokasi
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Untuk UTTP yang sulit dipindahkan
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Jadwal fleksibel
                </li>
              </ul>
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 rounded-full py-3 group/btn"
                asChild
              >
                <a href="/pengajuan-tera">
                  Ajukan Sekarang
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Card Pengajuan Tera di Kantor */}
          <Card className="group hover:shadow-2xl transition-all duration-500 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-2xl overflow-hidden transform hover:-translate-y-2 hover:scale-105">
            <CardHeader className="p-8 pb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-xl">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                Pengajuan Tera di Kantor
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
                Layanan tera yang dilakukan di kantor Disperindag ESDM. Anda membawa UTTP ke kantor untuk dilakukan pemeriksaan dan tera.
              </p>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400 mb-6">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Proses lebih cepat
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Biaya lebih ekonomis
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Untuk UTTP portable
                </li>
              </ul>
              <Button 
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 rounded-full py-3 group/btn"
                asChild
              >
                <a href="/pengajuan-tera-kantor">
                  Ajukan Sekarang
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" asChild>
            <a href="/">
              Kembali ke Beranda
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PilihanPengajuan;