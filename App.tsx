
import React, { useState, useEffect } from 'react';
import { Header, Card, Footer } from './components/Layout';
import { generateLessonKit, getTopicSuggestions } from './services/geminiService';
import { FullLessonKit, AppState, LessonIdentity } from './types';
import { KitRenderer } from './components/KitRenderer';
import { FASE_OPTIONS, KELAS_MAP } from './constants';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>('IDLE');
  const [params, setParams] = useState<LessonIdentity>({
    satuanPendidikan: 'SD Negeri 2 Malaka',
    jenjang: 'SD',
    fase: 'B',
    kelas: 'Kelas 4',
    mataPelajaran: 'Bahasa Indonesia',
    semester: 'Ganjil',
    tahunAjaran: '2024/2025',
    alokasiWaktu: '4 JP',
    topik: '',
    jumlahPertemuan: '1',
    guruPengampu: 'Nama Guru, S.Pd.',
    nipGuru: '',
    kepalaSekolah: 'Nama Kepala Sekolah, M.Pd.',
    nipKepalaSekolah: ''
  });
  
  const [suggestedTopics, setSuggestedTopics] = useState<string[]>([]);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [kit, setKit] = useState<FullLessonKit | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const availableKelas = KELAS_MAP[params.jenjang];
    if (availableKelas && !availableKelas.includes(params.kelas)) {
      setParams(prev => ({ ...prev, kelas: availableKelas[0] }));
    }
  }, [params.jenjang]);

  useEffect(() => {
    const fetchTopics = async () => {
      if (params.mataPelajaran && params.fase && params.kelas) {
        setLoadingTopics(true);
        try {
          const topics = await getTopicSuggestions({
            subject: params.mataPelajaran,
            fase: params.fase,
            grade: params.kelas,
            semester: params.semester
          });
          setSuggestedTopics(topics);
          if (topics.length > 0 && !params.topik) {
            setParams(prev => ({ ...prev, topik: topics[0] }));
          }
        } catch (err) {
          console.error("Topics fetch error", err);
        } finally {
          setLoadingTopics(false);
        }
      }
    };
    const timer = setTimeout(fetchTopics, 800);
    return () => clearTimeout(timer);
  }, [params.mataPelajaran, params.fase, params.kelas, params.semester]);

  const handleInputChange = (field: keyof LessonIdentity, value: string) => {
    setParams(prev => ({ ...prev, [field]: value }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleGenerate = async () => {
    if (!params.topik || !params.mataPelajaran) {
      alert("Mohon isi Mata Pelajaran dan Topik.");
      return;
    }
    setError(null);
    setState('GENERATING');
    try {
      const result = await generateLessonKit(params);
      setKit(result);
      setState('VIEWING');
    } catch (err: any) {
      setError(err.message || "Gagal menyusun perangkat.");
      setState('IDLE');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-indigo-100">
      <Header />
      <main className="flex-grow">
        {state === 'IDLE' && (
          <div className="max-w-4xl mx-auto py-10 px-4 no-print">
            <Card title="Generator Instrumen Kurikulum Merdeka Terpadu">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase mb-1 tracking-widest">Mata Pelajaran</label>
                      <input 
                        type="text" 
                        className="w-full border border-slate-300 rounded-xl p-3 focus:ring-4 focus:ring-indigo-100 outline-none"
                        value={params.mataPelajaran}
                        onChange={(e) => handleInputChange('mataPelajaran', e.target.value)}
                        placeholder="Contoh: Matematika"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-indigo-700 uppercase mb-1 tracking-widest font-bold">Pilih Fase</label>
                        <select 
                          className="w-full border-2 border-indigo-200 rounded-xl p-3 focus:ring-4 focus:ring-indigo-100 bg-white font-bold"
                          value={params.fase}
                          onChange={(e) => handleInputChange('fase', e.target.value)}
                        >
                          {FASE_OPTIONS.map(f => <option key={f} value={f.split(' ')[0]}>{f}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase mb-1 tracking-widest">Kelas</label>
                        <select 
                          className="w-full border border-slate-300 rounded-xl p-3 focus:ring-4 focus:ring-indigo-100 bg-white"
                          value={params.kelas}
                          onChange={(e) => handleInputChange('kelas', e.target.value)}
                        >
                          {KELAS_MAP[params.jenjang]?.map(k => (
                            <option key={k} value={k}>{k}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase mb-1 tracking-widest">Tahun Ajaran</label>
                      <input 
                        type="text" 
                        className="w-full border border-slate-300 rounded-xl p-3 focus:ring-4 focus:ring-indigo-100 outline-none"
                        value={params.tahunAjaran}
                        onChange={(e) => handleInputChange('tahunAjaran', e.target.value)}
                        placeholder="2024/2025"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase mb-1 tracking-widest">Semester</label>
                        <select 
                          className="w-full border border-slate-300 rounded-xl p-3 focus:ring-4 focus:ring-indigo-100 bg-white"
                          value={params.semester}
                          onChange={(e) => handleInputChange('semester', e.target.value)}
                        >
                          <option value="Ganjil">Ganjil</option>
                          <option value="Genap">Genap</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase mb-1 tracking-widest">Jumlah Pertemuan</label>
                        <input 
                          type="number" 
                          className="w-full border border-slate-300 rounded-xl p-3 focus:ring-4 focus:ring-indigo-100 outline-none"
                          value={params.jumlahPertemuan}
                          onChange={(e) => handleInputChange('jumlahPertemuan', e.target.value)}
                          min="1" max="5"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase mb-1 tracking-widest">Nama Sekolah</label>
                      <input 
                        type="text" 
                        className="w-full border border-slate-300 rounded-xl p-3 focus:ring-4 focus:ring-indigo-100 outline-none"
                        value={params.satuanPendidikan}
                        onChange={(e) => handleInputChange('satuanPendidikan', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase mb-1 tracking-widest">Alokasi Waktu</label>
                      <input 
                        type="text" 
                        className="w-full border border-slate-300 rounded-xl p-3 focus:ring-4 focus:ring-indigo-100 outline-none"
                        value={params.alokasiWaktu}
                        onChange={(e) => handleInputChange('alokasiWaktu', e.target.value)}
                        placeholder="Contoh: 4 JP (2 x 45 menit)"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-200">
                  <label className="block text-xs font-black text-slate-600 uppercase mb-3 tracking-widest">Pilih atau Ketik Topik Pembelajaran</label>
                  <input 
                    type="text" 
                    className="w-full border border-slate-300 rounded-xl p-4 focus:ring-4 focus:ring-indigo-100 outline-none mb-4 font-bold text-lg"
                    value={params.topik}
                    onChange={(e) => handleInputChange('topik', e.target.value)}
                    placeholder="Masukkan topik..."
                  />
                  {loadingTopics ? <div className="text-[10px] animate-pulse text-indigo-600 font-bold uppercase tracking-widest">Memuat saran kurikulum...</div> : (
                    <div className="flex flex-wrap gap-2">
                      {suggestedTopics.map(t => (
                        <button 
                          key={t}
                          onClick={() => handleInputChange('topik', t)}
                          className={`text-[10px] px-3 py-2 rounded-full border transition-all font-bold uppercase tracking-wider ${params.topik === t ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-400'}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-indigo-50/40 rounded-3xl border border-indigo-100">
                   <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase text-indigo-700 tracking-widest">Tanda Tangan Guru</h4>
                      <input 
                        type="text" 
                        className="w-full border border-slate-200 rounded-xl p-3 text-sm bg-white"
                        value={params.guruPengampu}
                        onChange={(e) => handleInputChange('guruPengampu', e.target.value)}
                      />
                      <input 
                        type="text" 
                        className="w-full border border-slate-200 rounded-xl p-3 text-sm bg-white"
                        value={params.nipGuru}
                        onChange={(e) => handleInputChange('nipGuru', e.target.value)}
                        placeholder="NIP Guru"
                      />
                   </div>
                   <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase text-indigo-700 tracking-widest">Tanda Tangan Kepala Sekolah</h4>
                      <input 
                        type="text" 
                        className="w-full border border-slate-200 rounded-xl p-3 text-sm bg-white"
                        value={params.kepalaSekolah}
                        onChange={(e) => handleInputChange('kepalaSekolah', e.target.value)}
                      />
                      <input 
                        type="text" 
                        className="w-full border border-slate-200 rounded-xl p-3 text-sm bg-white"
                        value={params.nipKepalaSekolah}
                        onChange={(e) => handleInputChange('nipKepalaSekolah', e.target.value)}
                        placeholder="NIP Kepala Sekolah"
                      />
                   </div>
                </div>

                {error && <div className="p-4 bg-rose-50 text-rose-700 rounded-xl border border-rose-200 text-xs font-bold uppercase tracking-widest">{error}</div>}

                <button 
                  onClick={handleGenerate}
                  className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black text-xl uppercase tracking-[0.3em] shadow-2xl transition-all hover:bg-black hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-4"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  Generate Instrumen Lengkap
                </button>
              </div>
            </Card>
          </div>
        )}

        {state === 'GENERATING' && (
          <div className="flex flex-col items-center justify-center py-48 space-y-10">
            <div className="relative">
               <div className="w-32 h-32 border-[12px] border-indigo-100 border-t-indigo-700 rounded-full animate-spin"></div>
               <div className="absolute inset-0 flex items-center justify-center font-black text-2xl text-indigo-700">AI</div>
            </div>
            <div className="text-center max-w-lg px-8">
              <h2 className="text-4xl font-black text-slate-800 uppercase tracking-tighter mb-4 italic">MENYUSUN TABEL INSTRUMEN...</h2>
              <p className="text-slate-500 font-bold uppercase text-xs tracking-[0.2em] leading-relaxed opacity-70">
                AI sedang menyusun Alur Tujuan, Kuesioner, Ceklis, Rubrik, dan 10 Soal PG per sesi pembelajaran. Mohon tunggu sejenak.
              </p>
            </div>
          </div>
        )}

        {state === 'VIEWING' && kit && (
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto mb-12 flex flex-col md:flex-row justify-between items-center gap-6 no-print bg-white p-8 rounded-[3rem] shadow-2xl border border-slate-100">
               <button onClick={() => setState('IDLE')} className="w-full md:w-auto text-slate-600 font-black flex items-center justify-center gap-2 px-10 py-5 bg-slate-100 rounded-3xl border border-slate-200 hover:bg-slate-200 transition-all">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                 Kembali ke Form
               </button>
               <button 
                 onClick={handlePrint} 
                 className="w-full md:w-auto bg-indigo-700 text-white px-16 py-5 rounded-3xl font-black shadow-2xl flex items-center justify-center gap-4 hover:bg-indigo-800 transition-all active:scale-95 group"
               >
                 <svg className="w-7 h-7 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                 SIMPAN PDF
               </button>
            </div>
            <KitRenderer kit={kit} />
            <div className="max-w-4xl mx-auto mt-16 mb-32 no-print text-center">
               <button 
                 onClick={handlePrint}
                 className="bg-slate-900 text-white px-24 py-10 rounded-full font-black text-4xl shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] hover:bg-black transition-all transform hover:scale-105 active:scale-95"
               >
                 KONFIRMASI & CETAK
               </button>
               <p className="mt-6 text-slate-400 font-bold uppercase text-[10px] tracking-widest">Dokumen siap cetak dengan Alur Tujuan & Lampiran Tabel Lengkap</p>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;
