import React from "react";

export default function RegisterModal({ showModal, setShowModal }) {
    return (
        <>
        {showModal ? (
            <>
            <div
                className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                // onClick={() => setShowModal(false)}
            >
                <div className="relative w-auto my-6 mx-auto max-w-sm">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-blueGray-200 outline-none focus:outline-none">
                    <div className="flex w-full justify-end">
                    <button onClick={() => setShowModal((p) => !p)}>
                        <i className="fas fa-close p-4"></i>
                    </button>
                    </div>
                    <div className="text-center mt-4">
                    <h6 className="text-emerald-500 text-4xl font-bold">
                        APDOC
                    </h6>
                    </div>
                    <div className="relative p-6 flex-auto px-8 lg:px-10 py-10 w-80 md:w-96">
                    <form>
                        <div className="relative w-full mb-3">
                        <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            placeholder="Email"
                        />
                        </div>

                        <div className="relative w-full mb-3">
                        <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            placeholder="Password"
                        />
                        </div>
                        <div>
                        <label className="inline-flex items-center cursor-pointer">
                            {/* <input
                                        id="customCheckLogin"
                                        type="checkbox"
                                        className="form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                                        /> */}
                            <span className="ml-2 text-sm font-semibold text-blueGray-600">
                            Forgot Password
                            </span>
                        </label>
                        </div>

                        <div className="text-center mt-6">
                        <button
                            className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                            type="button"
                        >
                            Sign In
                        </button>
                        <button
                            className="text-blueGray-500 bg-transparent hover:bg-blueGray-500 active:bg-blueGray-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 my-2 w-full ease-linear transition-all duration-150"
                            type="button"
                        >
                            Create An Account
                        </button>
                        </div>
                    </form>
                    </div>
                </div>
                </div>
            </div>
            <div className="opacity-80 fixed inset-0 z-40 bg-black"></div>
            </>
        ) : null}
        </>
    );        
}
