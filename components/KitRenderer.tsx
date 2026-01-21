
import React from 'react';
import { FullLessonKit, LessonModule } from '../types';

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <h2 className="text-xl font-black border-l-[10px] border-slate-900 pl-4 py-2 mb-6 bg-slate-100 uppercase tracking-tight text-slate-900 print:border-black">
    {title}
  </h2>
);

const InstrumentTable: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-8 overflow-hidden rounded-xl border border-slate-300 print:border-black print:rounded-none">
    <div className="bg-slate-800 text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest print:bg-slate-100 print:text-black print:border-b print:border-black">
      {title}
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm border-collapse">
        {children}
      </table>
    </div>
  </div>
);

export const KitRenderer: React.FC<{ kit: FullLessonKit }> = ({ kit }) => {
  const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const modulArr = Array.isArray(kit.modulAjar) ? kit.modulAjar : [];

  return (
    <div id="printable-content" className="max-w-4xl mx-auto bg-white p-8 md:p-16 shadow-2xl print:shadow-none print:p-0 rounded-3xl">
      
      {/* KOP SURAT / IDENTITAS MODUL */}
      <div className="text-center border-b-4 border-slate-900 pb-6 mb-10">
        <h1 className="text-3xl font-black uppercase tracking-tighter">PERANGKAT AJAR KURIKULUM MERDEKA</h1>
        <p className="text-indigo-600 font-bold uppercase text-xs tracking-widest print:text-black">Pendekatan Deep Learning Pedagogy</p>
        
        <div className="mt-8 grid grid-cols-2 text-left text-[10px] font-bold uppercase gap-x-12 gap-y-2 border-t pt-6 border-slate-100 print:border-black print:pt-4">
          <div className="flex justify-between border-b border-slate-50 pb-1"><span>Satuan Pendidikan:</span> <span className="font-black">{kit.identity.satuanPendidikan}</span></div>
          <div className="flex justify-between border-b border-slate-50 pb-1"><span>Mata Pelajaran:</span> <span className="font-black">{kit.identity.mataPelajaran}</span></div>
          <div className="flex justify-between border-b border-slate-50 pb-1"><span>Fase:</span> <span className="font-black">Fase {kit.identity.fase}</span></div>
          <div className="flex justify-between border-b border-slate-50 pb-1"><span>Kelas:</span> <span className="font-black">{kit.identity.kelas}</span></div>
          <div className="flex justify-between border-b border-slate-50 pb-1"><span>Semester:</span> <span className="font-black">{kit.identity.semester}</span></div>
          <div className="flex justify-between border-b border-slate-50 pb-1"><span>Tahun Ajaran:</span> <span className="font-black">{kit.identity.tahunAjaran}</span></div>
          <div className="flex justify-between border-b border-slate-50 pb-1"><span>Alokasi Waktu:</span> <span className="font-black">{kit.identity.alokasiWaktu}</span></div>
          <div className="flex justify-between border-b border-slate-50 pb-1"><span>Topik Utama:</span> <span className="font-black">{kit.identity.topik}</span></div>
        </div>
      </div>

      {/* CAPAIAN PEMBELAJARAN */}
      <section className="mb-12">
        <SectionHeader title="I. Capaian Pembelajaran" />
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl italic text-sm print:bg-white print:border-black print:p-4">
          "{kit.capaianPembelajaran}"
        </div>
      </section>

      {/* ATP TABLE */}
      <section className="mb-12 page-break">
        <SectionHeader title="II. Alur Tujuan Pembelajaran (ATP)" />
        <InstrumentTable title="Tabel Alur Tujuan Pembelajaran">
          <thead className="bg-slate-50 font-bold print:bg-slate-100">
            <tr>
              <th className="p-3 border-b border-slate-300 print:border-black w-16">Pert.</th>
              <th className="p-3 border-b border-slate-300 print:border-black">Tujuan Pembelajaran</th>
              <th className="p-3 border-b border-slate-300 print:border-black">Aktivitas Utama (Deep Learning)</th>
            </tr>
          </thead>
          <tbody>
            {kit.atp.map((item, i) => (
              <tr key={i} className="border-b border-slate-200 print:border-black">
                <td className="p-3 align-top text-center font-bold">{item.pertemuan}</td>
                <td className="p-3 align-top">{item.tujuan}</td>
                <td className="p-3 align-top text-xs italic">{item.aktivitas}</td>
              </tr>
            ))}
          </tbody>
        </InstrumentTable>
      </section>

      {/* MODUL & INSTRUMEN PER SESI */}
      {modulArr.map((modul, idx) => (
        <div key={idx} className="page-break pt-6">
          <SectionHeader title={`III. MODUL AJAR PERTEMUAN ${modul.pertemuan}`} />
          
          <div className="mb-10 space-y-4">
            <div className="p-5 bg-indigo-50 border-l-8 border-indigo-500 rounded-r-xl print:bg-white print:border-black print:p-3">
              <h4 className="text-[10px] font-black uppercase text-indigo-700 mb-1 print:text-black">A. Kegiatan Pendahuluan</h4>
              <p className="text-sm">{modul.kegiatanAwal}</p>
            </div>
            
            <div className="p-5 bg-slate-50 border-l-8 border-slate-800 rounded-r-xl print:bg-white print:border-black print:p-3">
              <h4 className="text-[10px] font-black uppercase text-slate-800 mb-2 print:text-black">B. Kegiatan Inti (Deep Learning Pedagogy)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-white p-3 rounded-lg border border-slate-200 print:border-black">
                  <strong className="block text-indigo-600 mb-1 print:text-black">1. Eksplorasi Konsep:</strong> 
                  {modul.kegiatanInti.eksplorasi}
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200 print:border-black">
                  <strong className="block text-indigo-600 mb-1 print:text-black">2. Diskusi Sokratik:</strong> 
                  {modul.kegiatanInti.diskusi}
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200 print:border-black">
                  <strong className="block text-indigo-600 mb-1 print:text-black">3. Kolaborasi Proyek:</strong> 
                  {modul.kegiatanInti.kolaborasi}
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200 print:border-black">
                  <strong className="block text-indigo-600 mb-1 print:text-black">4. Refleksi Metakognitif:</strong> 
                  {modul.kegiatanInti.refleksi}
                </div>
              </div>
            </div>

            <div className="p-5 bg-indigo-50 border-l-8 border-indigo-500 rounded-r-xl print:bg-white print:border-black print:p-3">
              <h4 className="text-[10px] font-black uppercase text-indigo-700 mb-1 print:text-black">C. Kegiatan Penutup</h4>
              <p className="text-sm">{modul.kegiatanPenutup}</p>
            </div>
          </div>

          {/* LAMPIRAN INSTRUMEN TABEL */}
          <div className="page-break pt-6">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] mb-6 border-b pb-2 print:text-black">Lampiran Instrumen Penilaian Sesi {modul.pertemuan}</h3>

            {/* Kuesioner Awal */}
            <InstrumentTable title={`Tabel 1.${modul.pertemuan}: Kuesioner Pengetahuan Awal & Minat`}>
              <thead className="bg-slate-50 print:bg-slate-100">
                <tr>
                  <th className="p-2 border-b border-slate-300 print:border-black w-10 text-center">No</th>
                  <th className="p-2 border-b border-slate-300 print:border-black">Pertanyaan Refleksi Diri</th>
                  <th className="p-2 border-b border-slate-300 print:border-black">Indikator Kesiapan Belajar</th>
                </tr>
              </thead>
              <tbody>
                {modul.kuisionerAwal?.map((q, i) => (
                  <tr key={i} className="border-b border-slate-200 print:border-black">
                    <td className="p-2 text-center">{i+1}</td>
                    <td className="p-2 font-medium">{q.pertanyaan}</td>
                    <td className="p-2 text-xs italic">{q.indikator}</td>
                  </tr>
                ))}
              </tbody>
            </InstrumentTable>

            {/* Ceklis Observasi */}
            <InstrumentTable title={`Tabel 2.${modul.pertemuan}: Lembar Ceklis Observasi Diskusi Sokratik`}>
              <thead className="bg-slate-50 print:bg-slate-100">
                <tr>
                  <th className="p-2 border-b border-slate-300 print:border-black w-10 text-center">No</th>
                  <th className="p-2 border-b border-slate-300 print:border-black">Aspek Perilaku yang Diamati</th>
                  <th className="p-2 border-b border-slate-300 print:border-black">Kriteria Keberhasilan</th>
                </tr>
              </thead>
              <tbody>
                {modul.ceklisObservasi?.map((c, i) => (
                  <tr key={i} className="border-b border-slate-200 print:border-black">
                    <td className="p-2 text-center">{i+1}</td>
                    <td className="p-2 font-bold">{c.aspek}</td>
                    <td className="p-2">{c.kriteria}</td>
                  </tr>
                ))}
              </tbody>
            </InstrumentTable>

            {/* Rubrik Penilaian */}
            <InstrumentTable title={`Tabel 3.${modul.pertemuan}: Rubrik Penilaian Produk/Karya (Poster/Maket/Laporan)`}>
              <thead className="bg-slate-100 text-[9px] uppercase print:border-black">
                <tr>
                  <th className="p-2 border-b border-slate-300 print:border-black">Aspek Penilaian</th>
                  <th className="p-2 border-b border-slate-300 print:border-black bg-green-50 print:bg-transparent">4 (Sangat Baik)</th>
                  <th className="p-2 border-b border-slate-300 print:border-black bg-blue-50 print:bg-transparent">3 (Baik)</th>
                  <th className="p-2 border-b border-slate-300 print:border-black bg-yellow-50 print:bg-transparent">2 (Cukup)</th>
                  <th className="p-2 border-b border-slate-300 print:border-black bg-red-50 print:bg-transparent">1 (Kurang)</th>
                </tr>
              </thead>
              <tbody className="text-[10px]">
                {modul.rubrikKarya?.map((r, i) => (
                  <tr key={i} className="border-b border-slate-200 print:border-black">
                    <td className="p-2 font-black bg-slate-50 print:bg-transparent">{r.aspek}</td>
                    <td className="p-2">{r.skor4}</td>
                    <td className="p-2">{r.skor3}</td>
                    <td className="p-2">{r.skor2}</td>
                    <td className="p-2">{r.skor1}</td>
                  </tr>
                ))}
              </tbody>
            </InstrumentTable>

            {/* SOAL FORMATIF SESI */}
            <div className="mt-10 p-8 bg-slate-900 text-white rounded-[2.5rem] print:bg-white print:text-black print:border-2 print:border-black print:rounded-none">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-xl font-black uppercase">4. Lembar Soal Formatif (10 PG)</h4>
                <div className="text-[10px] bg-indigo-500 px-4 py-1 rounded-full font-bold print:hidden">SESI {modul.pertemuan}</div>
              </div>
              <div className="space-y-6">
                {modul.soalFormatif?.map((soal, sidx) => (
                  <div key={sidx} className="border-b border-white/10 pb-4 last:border-0 print:border-black">
                    <p className="font-bold text-sm mb-4 leading-snug">{sidx + 1}. {soal.pertanyaan}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-6">
                      {soal.opsi.map((opt, oidx) => (
                        <div key={oidx} className="text-xs bg-white/5 p-2 rounded-lg print:bg-transparent print:border print:border-slate-200 mb-1">
                          <span className="font-black mr-2 text-indigo-400 print:text-black">{String.fromCharCode(65 + oidx)}.</span> {opt}
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 text-[10px] font-black text-indigo-300 italic uppercase flex items-center gap-2 print:text-black print:mt-1">
                      Kunci Jawaban: <span className="underline">{soal.jawaban}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* TANDA TANGAN */}
      <div className="mt-20 grid grid-cols-2 gap-20 text-center text-slate-900 print:mt-16 print:gap-10">
        <div className="space-y-24 print:space-y-20">
          <p className="text-sm font-bold">Mengetahui,<br/>Kepala Sekolah</p>
          <div>
            <p className="font-black border-b-2 border-slate-900 inline-block px-12 pb-1 uppercase">{kit.identity.kepalaSekolah || '................................'}</p>
            <p className="text-[10px] font-bold uppercase mt-1 italic">NIP. {kit.identity.nipKepalaSekolah || '-'}</p>
          </div>
        </div>
        <div className="space-y-24 print:space-y-20">
          <p className="text-sm font-bold">{kit.identity.satuanPendidikan}, {today}<br/>Guru Pengampu</p>
          <div>
            <p className="font-black border-b-2 border-slate-900 inline-block px-12 pb-1 uppercase">{kit.identity.guruPengampu || '................................'}</p>
            <p className="text-[10px] font-bold uppercase mt-1 italic">NIP. {kit.identity.nipGuru || '-'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
