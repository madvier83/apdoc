import {
    ScatterChart, Scatter, LineChart, Line,
    ComposedChart, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, ReferenceLine, Legend
} from 'recharts';

export function GrafikRegresiLinear({ listAntrean }) {
    const dataSelesai = (listAntrean || [])
        .filter(item => item.status_id === 3 && item.updated_at)
        .map((item, index) => {
            const durasi = Math.max(1, (new Date(item.updated_at) - new Date(item.created_at)) / (1000 * 60));
            return { x: index + 1, y: parseFloat(durasi.toFixed(2)) };
        });

    if (dataSelesai.length === 0) return null;

    const n = dataSelesai.length;
    let sx = 0, sy = 0, sxy = 0, sx2 = 0;
    dataSelesai.forEach(p => { sx += p.x; sy += p.y; sxy += p.x * p.y; sx2 += p.x * p.x; });
    const bDen = (n * sx2) - (sx * sx);
    const b = bDen !== 0 ? ((n * sxy) - (sx * sy)) / bDen : sy / n;
    const a = (sy - b * sx) / n;

    const regresiLine = Array.from({ length: n }, (_, i) => ({
        x: i + 1,
        yRegresi: parseFloat((a + b * (i + 1)).toFixed(2))
    }));

    const combined = dataSelesai.map((p, i) => ({
        x: p.x,
        yNyata: p.y,
        yRegresi: regresiLine[i].yRegresi
    }));

    const CustomTooltip = ({ active, payload }) => {
        if (!active || !payload?.length) return null;
        const d = payload[0]?.payload;
        return (
            <div className="bg-white border border-slate-200 rounded-md shadow-sm px-3 py-2 text-xs text-slate-700">
                <p className="font-semibold mb-1">Urutan ke-{d.x}</p>
                {d.yNyata != null && <p className="text-blue-600">Data nyata: <strong>{d.yNyata} menit</strong></p>}
                <p className="text-orange-500">Prediksi: <strong>{d.yRegresi} menit</strong></p>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-md shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Visualisasi Regresi Linear
                </span>
                <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-medium">
                    Y = {a.toFixed(2)} + ({b.toFixed(2)} × X)
                </span>
            </div>

            <div className="p-5">
                {/* Legend manual */}
                <div className="flex gap-4 mb-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                        Data nyata
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-4 h-0.5 bg-orange-400 inline-block" />
                        Garis regresi
                    </span>
                </div>

                <ResponsiveContainer width="100%" height={280}>
                    <ComposedChart data={combined} margin={{ top: 8, right: 16, bottom: 24, left: 8 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(136,135,128,0.2)" />
                        <XAxis
                            dataKey="x"
                            type="number"
                            domain={[0.5, n + 0.5]}
                            tickCount={n}
                            label={{ value: 'Nomor Urut Antrean (X)', position: 'insideBottom', offset: -16, fontSize: 11, fill: '#888780' }}
                            tick={{ fontSize: 11, fill: '#888780' }}
                            allowDecimals={false}
                        />
                        <YAxis
                            label={{ value: 'Durasi (menit)', angle: -90, position: 'insideLeft', offset: 12, fontSize: 11, fill: '#888780' }}
                            tick={{ fontSize: 11, fill: '#888780' }}
                            width={48}
                        />
                        <Tooltip content={<CustomTooltip />} />

                        {/* Garis regresi */}
                        <Line
                            type="linear"
                            dataKey="yRegresi"
                            stroke="#f97316"
                            strokeWidth={2}
                            strokeDasharray="5 3"
                            dot={false}
                            activeDot={false}
                            legendType="none"
                        />

                        {/* Titik data nyata */}
                        <Scatter
                            dataKey="yNyata"
                            fill="#378ADD"
                            r={5}
                            legendType="none"
                        />
                    </ComposedChart>
                </ResponsiveContainer>

                <p className="text-center text-[10px] text-slate-400 italic mt-1">
                    X = Nomor urut antrean selesai &nbsp;|&nbsp; Y = Durasi layanan (menit)
                </p>
            </div>
        </div>
    );
}