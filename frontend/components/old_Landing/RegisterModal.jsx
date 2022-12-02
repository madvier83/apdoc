import React, { useState, useRef } from "react";
import Link from "next/link";
import axios from "../../pages/api/axios";

export default function RegisterModal() {
    const toLoginRef = useRef();

    const [email, setEmail] = useState('')
    const [pwd, setPwd] = useState('')

    async function handleRegister(e) {
        e.preventDefault()

        const data = {
            email: email,
            password: pwd,
        }

        console.log(data)
        try {
            const response = await axios.post('register', data, {
                'Content-Type' : 'application/json'
            })
            console.log(response.data)
            setEmail('')
            setPwd('')
            toLoginRef.current.click()
            
        } catch(e) {
            console.error(e.message)
        }
    }
    return (
        <>
            <div
                className="modal fade show"
                id="modal-register"
                tabIndex={-1}
                role="dialog"
                aria-labelledby="modal-register"
                aria-hidden="true"
                // style={{ display: 'block' }}
            >
                <div className="modal-dialog modal-sm modal-register">
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
                                    backgroundSize: "123%",
                                }}
                            >
                                <div className="container">
                                    <div className="row">
                                        <div className="col-md-8 col-sm-8 h-100 p-5 mx-auto rounded dark-bg bg-opacity-50">
                                            <Link
                                                className="navbar-brand d-flex mt-4"
                                                href="#modal-register"
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
                                                onSubmit={handleRegister}
                                                className="form-inline newsletter"
                                                role="form"
                                            >
                                                <label
                                                    className="text-sm mb-3 h6"
                                                    htmlFor="exampleInputEmail"
                                                >
                                                    Name as shown on ID
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    // id="exampleInputEmail"
                                                    placeholder="Your full name"
                                                />
                                                <label
                                                    className="text-sm mb-3 h6"
                                                    htmlFor="exampleInputEmail"
                                                >
                                                    Phone number
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    // id="exampleInputEmail"
                                                    placeholder="+62 12341234123"
                                                />
                                                <label
                                                    className="text-sm mb-3 h6"
                                                    htmlFor="exampleInputEmail"
                                                >
                                                    Email address
                                                </label>
                                                <input
                                                    value={email}
                                                    onChange={e => setEmail(e.target.value)}
                                                    type="email"
                                                    className="form-control"
                                                    // id="exampleInputEmail"
                                                    placeholder="Enter your email address"
                                                />
                                                <label
                                                    className="text-sm mb-3 h6"
                                                    htmlFor="exampleInputEmail"
                                                >
                                                    Password
                                                </label>
                                                <input
                                                    value={pwd}
                                                    onChange={e => setPwd(e.target.value)}
                                                    type="password"
                                                    className="form-control"
                                                    // id="exampleInputEmail"
                                                    placeholder="Enter your password"
                                                />
                                                <label
                                                    className="text-sm mb-3 h6"
                                                    htmlFor="exampleInputEmail"
                                                >
                                                    Confirm Password
                                                </label>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    // id="exampleInputEmail"
                                                    placeholder="Enter your password"
                                                />
                                                <button className="btn btn-green w-100">
                                                    Sign Up
                                                </button>
                                                <h5 className="text-white w-100 text-center mt-1 mb-4">
                                                    Already have an account?
                                                    <a
                                                        ref={toLoginRef}
                                                        href="#modal-login"
                                                        data-toggle="modal"
                                                        data-dismiss="modal"
                                                        className="ml-1 green"
                                                    >
                                                        Login
                                                    </a>
                                                </h5>
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
