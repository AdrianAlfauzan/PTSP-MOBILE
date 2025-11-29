export const detectIntent = (lowerQuestion: string) => {
  // Deteksi pertanyaan tentang produk/harga
  const isAboutProducts =
    lowerQuestion.includes('harga') ||
    lowerQuestion.includes('produk') ||
    lowerQuestion.includes('layanan') ||
    lowerQuestion.includes('jasa') ||
    lowerQuestion.includes('informasi') ||
    lowerQuestion.includes('top') ||
    lowerQuestion.includes('populer') ||
    lowerQuestion.includes('rekomendasi') ||
    lowerQuestion.includes('apa saja') ||
    lowerQuestion.includes('daftar') ||
    lowerQuestion.includes('berapa') ||
    lowerQuestion.includes('murah') ||
    lowerQuestion.includes('mahal') ||
    lowerQuestion.includes('biaya') ||
    lowerQuestion.includes('tarif') ||
    lowerQuestion.includes('fee') ||
    lowerQuestion.includes('prioritas') ||
    lowerQuestion.includes('unggulan') ||
    lowerQuestion.includes('stasiun') ||
    lowerQuestion.includes('kantor') ||
    lowerQuestion.includes('pelayanan') ||
    lowerQuestion.includes('admin') ||
    lowerQuestion.includes('izin') ||
    lowerQuestion.includes('usaha') ||
    lowerQuestion.includes('lokasi') ||
    lowerQuestion.includes('jam') ||
    lowerQuestion.includes('buka');

  // ✅ PERBAIKI: Deteksi pengajuan lebih LUAS & tidak block produk/harga
  const isAboutSubmission =
    lowerQuestion.includes('pengajuan') ||
    lowerQuestion.includes('ajukan') ||
    lowerQuestion.includes('upload') ||
    lowerQuestion.includes('dokumen') ||
    lowerQuestion.includes('file') ||
    lowerQuestion.includes('syarat') ||
    lowerQuestion.includes('lanjut') ||
    lowerQuestion.includes('permohonan') ||
    lowerQuestion.includes('submit') ||
    lowerQuestion.includes('kirim') ||
    lowerQuestion.includes('proses') ||
    lowerQuestion.includes('formulir') ||
    lowerQuestion.includes('berkas');

  return { isAboutProducts, isAboutSubmission };
};
