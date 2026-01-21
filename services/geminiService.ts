
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { FullLessonKit, LessonIdentity } from "../types";

export async function getTopicSuggestions(params: { subject: string, fase: string, grade: string, semester: string }): Promise<string[]> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Berikan 5 daftar topik utama untuk mata pelajaran ${params.subject}, fase ${params.fase}, ${params.grade}, semester ${params.semester} sesuai Kurikulum Merdeka. Kembalikan hanya array JSON string berisi nama topik saja.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Error fetching topics:", error);
    return [];
  }
}

export async function generateLessonKit(params: LessonIdentity): Promise<FullLessonKit> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    BUAT PERANGKAT PEMBELAJARAN LENGKAP KURIKULUM MERDEKA:
    - Topik: ${params.topik}
    - Mapel: ${params.mataPelajaran}
    - Jenjang/Fase: ${params.jenjang} / Fase ${params.fase}
    - Kelas: ${params.kelas}
    - Semester: ${params.semester}
    - Tahun Ajaran: ${params.tahunAjaran}
    - JUMLAH PERTEMUAN: ${params.jumlahPertemuan} PERTEMUAN (WAJIB ADA ${params.jumlahPertemuan} ELEMEN DI MODUL AJAR)

    INSTRUKSI KHUSUS:
    1. Hasilkan tepat ${params.jumlahPertemuan} sesi pertemuan.
    2. Nomor pertemuan harus berurutan: 1, 2, dst. Jangan melompat!
    3. Untuk setiap sesi, buatlah tabel Kuesioner, Ceklis Observasi, dan Rubrik yang mendalam.
    4. Pastikan setiap sesi memiliki 10 soal Pilihan Ganda yang berbeda-beda.
    5. Gunakan bahasa Indonesia yang baku dan profesional.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        temperature: 0.7,
        thinkingConfig: { thinkingBudget: 32000 }
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    
    // Sort modulAjar by pertemuan number just in case AI returns them out of order
    let sortedModules = Array.isArray(parsed.modulAjar) ? parsed.modulAjar : [];
    sortedModules.sort((a: any, b: any) => a.pertemuan - b.pertemuan);

    // Limit to requested number if AI generates too many
    const requestedCount = parseInt(params.jumlahPertemuan);
    if (sortedModules.length > requestedCount) {
      sortedModules = sortedModules.slice(0, requestedCount);
    }

    const safeKit: FullLessonKit = {
      identity: params,
      capaianPembelajaran: parsed.capaianPembelajaran || "Capaian Pembelajaran tersedia di buku panduan guru.",
      atp: Array.isArray(parsed.atp) ? parsed.atp : [],
      modulAjar: sortedModules,
      asesmen: parsed.asesmen || {
        diagnostik: { teknik: "Tes Lisan", instrumen: "Daftar Pertanyaan", rubrik: "Kualitatif" },
        formatif: { teknik: "Observasi", instrumen: "Lembar Amata", rubrik: "Checklist" },
        sumatif: { teknik: "Tes Tertulis", instrumen: "Pilihan Ganda", rubrik: "Skor Kuantitatif" }
      }
    };
    
    return safeKit;
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw new Error("Gagal memproses permintaan AI. Pastikan koneksi stabil dan topik sudah spesifik.");
  }
}
