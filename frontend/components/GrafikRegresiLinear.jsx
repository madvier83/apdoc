import React, { useMemo } from "react";
import {
    ResponsiveContainer,
    ScatterChart,
    Scatter,
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";

const GrafikRegresiLinear = ({ data = [] }) => {
    const regression = useMemo(() => {
        const validData = data
            .map((item) => ({
                x: Number(item.queue_position),
                y: Number(item.actual_time),
            }))
            .filter(
                (item) =>
                    Number.isFinite(item.x) &&
                    Number.isFinite(item.y)
            );

        if (validData.length < 2) {
            return {
                a: 0,
                b: 0,
                mae: 0,
                rmse: 0,
                r2: 0,
                data: [],
                line: [],
            };
        }

        const n = validData.length;

        const meanX =
            validData.reduce((sum, item) => sum + item.x, 0) / n;

        const meanY =
            validData.reduce((sum, item) => sum + item.y, 0) / n;

        const numerator = validData.reduce(
            (sum, item) =>
                sum + (item.x - meanX) * (item.y - meanY),
            0
        );

        const denominator = validData.reduce(
            (sum, item) =>
                sum + Math.pow(item.x - meanX, 2),
            0
        );

        const b = denominator === 0 ? 0 : numerator / denominator;
        const a = meanY - b * meanX;

        const predictions = validData.map((item) => ({
            ...item,
            predicted: a + b * item.x,
        }));

        const mae =
            predictions.reduce(
                (sum, item) =>
                    sum + Math.abs(item.y - item.predicted),
                0
            ) / n;

        const rmse = Math.sqrt(
            predictions.reduce(
                (sum, item) =>
                    sum + Math.pow(item.y - item.predicted, 2),
                0
            ) / n
        );

        const ssRes = predictions.reduce(
            (sum, item) =>
                sum + Math.pow(item.y - item.predicted, 2),
            0
        );

        const ssTot = validData.reduce(
            (sum, item) =>
                sum + Math.pow(item.y - meanY, 2),
            0
        );

        const r2 =
            ssTot === 0
                ? 0
                : 1 - ssRes / ssTot;

        const maxX = Math.max(...validData.map((item) => item.x));

        const line = Array.from(
            { length: maxX + 1 },
            (_, index) => ({
                queue_position: index,
                predicted: a + b * index,
            })
        );

        return {
            a,
            b,
            mae,
            rmse,
            r2,
            data: predictions,
            line,
        };
    }, [data]);

    const queueDistribution = useMemo(() => {
        const distribution = {};

        data.forEach((item) => {
            const position = Number(item.queue_position);

            if (!Number.isFinite(position)) {
                return;
            }

            distribution[position] =
                (distribution[position] || 0) + 1;
        });

        return Object.keys(distribution)
            .map(Number)
            .sort((a, b) => a - b)
            .map((position) => ({
                queue_position: position,
                total: distribution[position],
            }));
    }, [data]);

    const comparisonData = useMemo(() => {
        return data
            .map((item, index) => ({
                id: item.id ?? index + 1,
                queue_number: item.queue_number,
                prediction: Number(item.prediction_time),
                actual: Number(item.actual_time),
            }))
            .filter(
                (item) =>
                    Number.isFinite(item.prediction) &&
                    Number.isFinite(item.actual)
            )
            .slice(-30);
    }, [data]);

    const format = (value) => Number(value).toFixed(2);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                <div className="rounded-xl bg-blue-50 p-5">
                    <p className="text-sm text-blue-600">
                        Intercept (a)
                    </p>
                    <p className="mt-1 text-2xl font-bold text-blue-700">
                        {format(regression.a)}
                        <span className="ml-1 text-sm font-medium">
                            menit
                        </span>
                    </p>
                </div>

                <div className="rounded-xl bg-orange-50 p-5">
                    <p className="text-sm text-orange-600">
                        Slope (b)
                    </p>
                    <p className="mt-1 text-2xl font-bold text-orange-700">
                        {format(regression.b)}
                        <span className="ml-1 text-sm font-medium">
                            menit/pasien
                        </span>
                    </p>
                </div>

                <div className="rounded-xl bg-green-50 p-5">
                    <p className="text-sm text-green-600">
                        MAE
                    </p>
                    <p className="mt-1 text-2xl font-bold text-green-700">
                        {format(regression.mae)}
                        <span className="ml-1 text-sm font-medium">
                            menit
                        </span>
                    </p>
                </div>

                <div className="rounded-xl bg-purple-50 p-5">
                    <p className="text-sm text-purple-600">
                        RMSE
                    </p>
                    <p className="mt-1 text-2xl font-bold text-purple-700">
                        {format(regression.rmse)}
                        <span className="ml-1 text-sm font-medium">
                            menit
                        </span>
                    </p>
                </div>

                <div className="rounded-xl bg-emerald-50 p-5">
                    <p className="text-sm text-emerald-600">
                        R²
                    </p>
                    <p className="mt-1 text-2xl font-bold text-emerald-700">
                        {format(regression.r2)}
                    </p>
                </div>
            </div>

            <div className="rounded-xl border bg-white p-5 shadow-sm">
                <div className="mb-5">
                    <h3 className="text-lg font-semibold">
                        Regresi Linear Queue Position terhadap Waktu Tunggu
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                        X = jumlah pasien di depan dalam antrean |
                        Y = waktu tunggu aktual pasien
                    </p>
                </div>

                <div className="h-[430px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart
                            margin={{
                                top: 10,
                                right: 30,
                                left: 10,
                                bottom: 25,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis
                                type="number"
                                dataKey="x"
                                name="Queue Position"
                                domain={[0, "dataMax + 1"]}
                                label={{
                                    value: "Queue Position",
                                    position: "insideBottom",
                                    offset: -15,
                                }}
                            />

                            <YAxis
                                type="number"
                                dataKey="y"
                                name="Actual Time"
                                label={{
                                    value: "Waktu Tunggu Aktual (menit)",
                                    angle: -90,
                                    position: "insideLeft",
                                }}
                            />

                            <Tooltip
                                formatter={(value, name) => [
                                    `${format(value)} menit`,
                                    name === "y"
                                        ? "Actual Time"
                                        : "Prediksi",
                                ]}
                                labelFormatter={(value) =>
                                    `Queue Position: ${value}`
                                }
                            />

                            <Legend />

                            <Scatter
                                name="Data Aktual"
                                data={regression.data}
                                dataKey="y"
                            />

                            <Line
                                name="Regresi Linear"
                                type="monotone"
                                data={regression.line}
                                dataKey="predicted"
                                strokeWidth={2.5}
                                dot={false}
                            />
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-4 rounded-lg bg-gray-50 p-4 text-center">
                    <p className="text-sm text-gray-500">
                        Persamaan Regresi Linear
                    </p>

                    <p className="mt-1 text-xl font-semibold">
                        Y = {format(regression.a)} + (
                        {format(regression.b)} × X)
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-xl border bg-white p-5 shadow-sm">
                    <div className="mb-5">
                        <h3 className="text-lg font-semibold">
                            Distribusi Queue Position
                        </h3>

                        <p className="text-sm text-gray-500">
                            Jumlah pasien berdasarkan posisi dalam antrean
                        </p>
                    </div>

                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={queueDistribution}
                                margin={{
                                    top: 10,
                                    right: 20,
                                    left: 0,
                                    bottom: 10,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />

                                <XAxis
                                    dataKey="queue_position"
                                    label={{
                                        value: "Queue Position",
                                        position: "insideBottom",
                                        offset: -5,
                                    }}
                                />

                                <YAxis
                                    allowDecimals={false}
                                    label={{
                                        value: "Jumlah Pasien",
                                        angle: -90,
                                        position: "insideLeft",
                                    }}
                                />

                                <Tooltip />

                                <Bar
                                    dataKey="total"
                                    name="Jumlah Pasien"
                                    radius={[5, 5, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="rounded-xl border bg-white p-5 shadow-sm">
                    <div className="mb-5">
                        <h3 className="text-lg font-semibold">
                            Prediksi vs Aktual
                        </h3>

                        <p className="text-sm text-gray-500">
                            Perbandingan waktu tunggu prediksi dan aktual
                        </p>
                    </div>

                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={comparisonData}
                                margin={{
                                    top: 10,
                                    right: 20,
                                    left: 0,
                                    bottom: 10,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />

                                <XAxis
                                    dataKey="queue_number"
                                    interval="preserveStartEnd"
                                />

                                <YAxis
                                    label={{
                                        value: "Waktu (menit)",
                                        angle: -90,
                                        position: "insideLeft",
                                    }}
                                />

                                <Tooltip />

                                <Legend />

                                <Line
                                    type="monotone"
                                    dataKey="prediction"
                                    name="Prediksi"
                                    strokeWidth={2}
                                    dot={false}
                                />

                                <Line
                                    type="monotone"
                                    dataKey="actual"
                                    name="Aktual"
                                    strokeWidth={2}
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GrafikRegresiLinear;