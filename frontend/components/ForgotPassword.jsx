import React from "react";
import Link from "next/link";

export default function ForgotPassword() {
    return (
        <>
            <div
                className="modal fade"
                id="modal-forgot-password"
                tabIndex={-1}
                role="dialog"
                aria-labelledby="modal-forgot-password"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-sm modal-login">
                    <div className="modal-content dark-bg img-bg img-bg-softer no-modal-header no-modal-footer">
                        <div className="modal-header">
                            <button
                                type="button"
                                className="close"
                                data-dismiss="modal"
                                aria-label="Close"
                            >
                                <span aria-hidden="true">
                                    <i className="icon-cancel-1" />
                                </span>
                            </button>
                        </div>
                        {/* ============================================================= MODAL CONTENT ============================================================= */}
                        <div className="modal-body">
                            {/* ============================================================= SECTION – PORTFOLIO POST ============================================================= */}
                            <section
                                className="d-flex h-100 w-100 bg-svg"
                                style={{
                                    backgroundSize: "cover",
                                }}
                            >
                                <div className="container mt-2">
                                    <div className="row">
                                        <div className="col-md-8 col-sm-8 h-100 p-5 mx-auto rounded dark-bg bg-opacity-50">
                                            <Link
                                                className="navbar-brand d-flex"
                                                href="#modal-forgot-password"
                                                data-dismiss="modal"
                                            >
                                                {/* <img
                                            src="./images/logo.svg"
                                            className="logo"
                                            alt=""
                                        /> */}
                                                <h1 className="p-0 mx-auto font-weight-bold logo text-center">
                                                    APDOC
                                                </h1>
                                            </Link>
                                            <form
                                                id=""
                                                className="form-inline newsletter mb-5"
                                                role="form"
                                            >
                                                <label
                                                    className="text-sm mb-3 h6 mt-4"
                                                    htmlFor="exampleInputEmail"
                                                >
                                                    Forgot Password
                                                </label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    // id="exampleInputEmail"
                                                    placeholder="Enter your email address"
                                                />
                                                <small className="mb-2">
                                                    <i className="icon-info-circle"></i>{" "}
                                                    Lorem ipsum dolor sit amet
                                                    consectetur adipisicing
                                                    elit. Quia, exercitationem!
                                                    Quos, voluptas.
                                                </small>
                                                <button className="btn btn-green w-100 mt-5">
                                                    Send Email
                                                </button>
                                                <a
                                                    href="#modal-login"
                                                    data-toggle="modal"
                                                    data-dismiss="modal"
                                                    className="w-100 text-center mt-1"
                                                >
                                                    <h5 className="text-white">
                                                        Cancel
                                                    </h5>
                                                </a>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                        {/* ============================================================= MODAL CONTENT : END ============================================================= */}
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn"
                                data-dismiss="modal"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* /.modal */}
        </>
    );
}
