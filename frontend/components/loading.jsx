import React from "react";

export default function Loading({dataLoading, data, reload}) {
    return (
        <React.Fragment>
        {dataLoading && (
            <tr>
                <td colSpan={99}>
                    <div className="flex w-full justify-center my-4 mt-60">
                    <img src="/loading.svg" alt="now loading" />
                    </div>
                </td>
            </tr>
        )}
        {!dataLoading && data.data?.length <= 0 && (
            <tr>
                <td colSpan={99}>
                    <div className="flex w-full justify-center mt-48">
                    <div className="text-center">
                        <h1 className="text-xl">Data tidak ditemukan</h1>
                        <small>Data kosong atau coba sesuaikan filter Anda</small>
                        <br />
                        <div
                        className="mt-8 px-8 btn btn-success text-gray-800 normal-case"
                        onClick={() => reload()}
                        >
                        Memuat ulang <i className="fas fa-refresh ml-3"></i>
                        </div>
                    </div>
                    </div>
                </td>
            </tr>
        )}
        </React.Fragment>
    );
}
