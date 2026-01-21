
export interface LessonIdentity {
  satuanPendidikan: string;
  jenjang: string;
  fase: string;
  kelas: string;
  mataPelajaran: string;
  semester: string;
  tahunAjaran: string;
  alokasiWaktu: string;
  guruPengampu: string;
  nipGuru: string;
  kepalaSekolah: string;
  nipKepalaSekolah: string;
  topik: string;
  jumlahPertemuan: string;
}

export interface Question {
  pertanyaan: string;
  opsi: string[];
  jawaban: string;
}

export interface KuesionerItem {
  pertanyaan: string;
  indikator: string;
}

export interface CeklisItem {
  aspek: string;
  kriteria: string;
}

export interface RubrikItem {
  aspek: string;
  skor4: string; // Sangat Baik
  skor3: string; // Baik
  skor2: string; // Cukup
  skor1: string; // Perlu Bimbingan
}

export interface LessonModule {
  pertemuan: number;
  tujuan: string;
  kegiatanAwal: string;
  kegiatanInti: {
    eksplorasi: string;
    diskusi: string;
    refleksi: string;
    kolaborasi: string;
  };
  kegiatanPenutup: string;
  // Instrumen Per Sesi (Struktur Tabel)
  kuisionerAwal: KuesionerItem[];
  ceklisObservasi: CeklisItem[];
  rubrikKarya: RubrikItem[];
  soalFormatif: Question[];
}

export interface Assessment {
  diagnostik: { teknik: string; instrumen: string; rubrik: string };
  formatif: { teknik: string; instrumen: string; rubrik: string };
  sumatif: { teknik: string; instrumen: string; rubrik: string };
}

export interface FullLessonKit {
  identity: LessonIdentity;
  capaianPembelajaran: string;
  atp: { pertemuan: number; tujuan: string; aktivitas: string }[];
  modulAjar: LessonModule[];
  asesmen: Assessment;
}

export type AppState = 'IDLE' | 'GENERATING' | 'VIEWING';
