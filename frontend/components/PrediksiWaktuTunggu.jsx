import React from 'react';

export default function PrediksiWaktuTunggu({ listAntrean }) {

    const hitungKonstantaRegresi = () => {
        if (!listAntrean || listAntrean.length === 0) {
            return { a: 15, b: 15, debug: { n: 0, jumlahX: 0, jumlahY: 0, jumlahXY: 0, jumlahX2: 0 } };
        }

        const dataSelesai = listAntrean.filter(item => item.status_id === 3 && item.updated_at);

        let a = 15;
        let b = 15;
        let debugData = { n: dataSelesai.length, jumlahX: 0, jumlahY: 0, jumlahXY: 0, jumlahX2: 0 };

        if (dataSelesai.length > 0) {
            let jumlahX = 0, jumlahY = 0, jumlahXY = 0, jumlahX2 = 0;
            const n = dataSelesai.length;
            let totalDurasiNyata = 0;

            dataSelesai.forEach((item, index) => {
                const x = index + 1;
                const waktuMulai = new Date(item.created_at);
                const waktuSelesai = new Date(item.updated_at);
                const selisihMenit = Math.max(1, (waktuSelesai - waktuMulai) / (1000 * 60));
                const y = parseFloat(selisihMenit.toFixed(2));

                totalDurasiNyata += y;
                jumlahX += x;
                jumlahY += y;
                jumlahXY += (x * y);
                jumlahX2 += (x * x);
            });

            debugData.jumlahX = jumlahX;
            debugData.jumlahY = parseFloat(jumlahY.toFixed(2));
            debugData.jumlahXY = parseFloat(jumlahXY.toFixed(2));
            debugData.jumlahX2 = jumlahX2;

            const rataRataDurasiRiil = totalDurasiNyata / n;
            const pembilangB = (n * jumlahXY) - (jumlahX * jumlahY);
            const penyebutB = (n * jumlahX2) - (jumlahX * jumlahX);

            if (penyebutB !== 0) b = pembilangB / penyebutB;
            if (Math.abs(b) < 0.1 || b <= 0 || penyebutB === 0) b = rataRataDurasiRiil;

            a = (jumlahY - (b * jumlahX)) / n;
            if (a <= 0) a = rataRataDurasiRiil;
        }

        return { a, b, debug: debugData };
    };

    const dapatkanAntreanMenunggu = () => {
        if (!listAntrean) return [];

        const antreanBelumDipanggil = listAntrean
            .filter(item => item.status_id === 1)
            .sort((a, b) => a.queue_number.localeCompare(b.queue_number));

        const { a, b } = hitungKonstantaRegresi();
        const waktuSekarang = new Date();

        return antreanBelumDipanggil.map((item, index) => {
            const antreanDiDepan = index;
            const prediksiMenitTunggu = a + (b * antreanDiDepan);
            const perkiraanJam = new Date(waktuSekarang.getTime());
            perkiraanJam.setMinutes(perkiraanJam.getMinutes() + prediksiMenitTunggu);

            return {
                ...item,
                antreanDiDepan,
                estimasiMenit: prediksiMenitTunggu.toFixed(2),
                // estimasiMenit: Math.round(prediksiMenitTunggu),
                perkiraanJam
            };
        });
    };

    const daftarTunggu = dapatkanAntreanMenunggu();
    const { a, b, debug } = hitungKonstantaRegresi();

    return (
        <div className="max-w-xl mx-auto space-y-4 font-sans antialiased text-slate-800">
            
            {/* CARD UTAMA: DAFTAR PREDIKSI */}
            <div className="bg-white rounded-md shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-100 px-5 py-4 flex justify-between items-center">
                    <div>
                        <h3 className="font-semibold">Prediksi Waktu Tunggu</h3>
                    </div>
                    <span className="bg-slate-800 text-slate-200  text-xs px-2.5 py-1 rounded-md border border-slate-700">
                        Total: <strong>{daftarTunggu.length} Orang</strong>
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/75 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                <th className="py-3 px-5">No. Antrean</th>
                                <th className="py-3 px-5 text-center">Antrean di Depan</th>
                                <th className="py-3 px-5 text-right">Perkiraan Dilayani</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {daftarTunggu.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="py-12 text-center text-slate-400 italic bg-slate-50/20">
                                        Tidak ada antrean yang sedang menunggu.
                                    </td>
                                </tr>
                            ) : (
                                daftarTunggu.map((pasien) => (
                                    <tr key={pasien.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="py-3.5 px-5 font-bold text-slate-700 tracking-wide text-base">
                                            {pasien.queue_number}
                                        </td>
                                        <td className="py-3.5 px-5 text-center">
                                            {pasien.antreanDiDepan === 0 ? (
                                                <span className="inline-flex items-center bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium text-xs px-2.5 py-0.5 rounded-full">
                                                    Giliran Berikutnya
                                                </span>
                                            ) : (
                                                <span className="text-slate-600 font-medium">{pasien.antreanDiDepan} orang</span>
                                            )}
                                        </td>
                                        <td className="py-3.5 px-5 text-right">
                                            <div className="font-semibold text-blue-600">
                                                {pasien.perkiraanJam.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                                            </div>
                                            <div className="text-[14px]  mt-0.5">
                                                (± {pasien.estimasiMenit} menit lagi)
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="bg-slate-50 px-5 py-2.5 border-t border-slate-200 text-[10px] text-slate-400 italic text-center">
                    *Waktu diperbarui berkala berdasarkan durasi pasien sebelumnya.
                </div>
            </div>

            {/* CARD LOG & KALKULASI RUMUS */}
           <div className="bg-white rounded-md shadow-sm border border-slate-200 overflow-hidden">
    <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex flex-wrap justify-between items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Kalkulasi Regresi</span>
        <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-medium">
            Sampel data: n = {debug.n}
        </span>
    </div>
    
    <div className="p-5 space-y-5 text-xs">
        {/* Ringkasan Nilai Variabel Dasar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-lg">
            <div>∑X  = <span className="text-slate-900 font-bold">{debug.jumlahX}</span></div>
            <div>∑Y  = <span className="text-slate-900 font-bold">{debug.jumlahY}</span></div>
            <div>∑XY = <span className="text-slate-900 font-bold">{debug.jumlahXY}</span></div>
            <div>∑X² = <span className="text-slate-900 font-bold">{debug.jumlahX2}</span></div>
        </div>

        {/* Breakdown Rumus Matematika */}
        <div className="space-y-4 border-t border-slate-100 pt-4 text-slate-700">
            {/* Kalkulasi Nilai B */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 pb-3 border-b border-dashed border-slate-100">
                <span className="font-bold text-slate-500 sm:w-24">Mencari b :</span>
                <div className="flex items-center gap-2 overflow-x-auto py-1">
                    <div className="text-center text-[11px]">
                        <div className="border-b border-slate-400 px-1">(n × ∑XY) - (∑X × ∑Y)</div>
                        <div className="px-1">(n × ∑X²) - (∑X)²</div>
                    </div>
                    <span className="text-slate-400">→</span>
                    <div className="text-center font-semibold text-slate-600 text-[11px]">
                        <div className="border-b border-slate-400 px-1">({debug.n} × {debug.jumlahXY}) - ({debug.jumlahX} × {debug.jumlahY})</div>
                        <div className="px-1">({debug.n} × {debug.jumlahX2}) - ({debug.jumlahX})²</div>
                    </div>
                    <span className="text-slate-400">=</span>
                    <span className="text font-bold px-2 py-1 rounded text-[11px]">
                        {b.toFixed(5)}
                    </span>
                </div>
            </div>

            {/* Kalkulasi Nilai A */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 pb-2">
                <span className="font-bold text-slate-500 sm:w-24">Mencari a :</span>
                <div className="flex items-center gap-2 overflow-x-auto py-1">
                    <div className="text-center text-[11px]">
                        <div className="border-b border-slate-400 px-1">∑Y - (b × ∑X)</div>
                        <div className="px-1">n</div>
                    </div>
                    <span className="text-slate-400">→</span>
                    <div className="text-center font-semibold text-slate-600 text-[11px]">
                        <div className="border-b border-slate-400 px-1">{debug.jumlahY} - ({b.toFixed(2)} × {debug.jumlahX})</div>
                        <div className="px-1">{debug.n || 1}</div>
                    </div>
                    <span className="text-slate-400">=</span>
                    <span className=" font-bold px-2 py-1 rounded text-[11px]">
                        {a.toFixed(5)}
                    </span>
                </div>
            </div>
        </div>

        {/* Hasil Persamaan Regresi Penuh (Dipindah ke Bawah) */}
        <div className="border-t-2 border-slate-100 pt-4 bg-slate-50/50 -mx-5 -mb-5 p-5 flex flex-col items-center gap-2">
            <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Persamaan Regresi Linear Penuh:</span>
            <div className="items-start sm:items-center gap-3">
                <div className="px-3 py-2 rounded-md text-sm font-bold tracking-wide w-full sm:w-auto text-center">
                    Y = a + bX
                </div>
                <div className="px-4 py-2 rounded-md text-sm font-bold tracking-wide w-full sm:w-auto text-center">
                    Y = {a.toFixed(2)} + ({b.toFixed(2)} × X)
                </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 italic">
                Y = Estimasi Waktu Tunggu (Menit), X = Nomor Urut Antrean Berjalan.
            </p>
        </div>
    </div>
</div>

        </div>
    );
}