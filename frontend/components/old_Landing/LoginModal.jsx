import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import axios from '../../pages/api/axios';
import {setCookie} from 'cookies-next';
import { useRouter } from "next/router";

export default function LoginModal() {
    const router = useRouter()

    const [email, setEmail] = useState('')
    const [pwd, setPwd] = useState('')

    const closeRef = useRef()

    async function handleLogin(e) {
        e.preventDefault()
        if (!email && !pwd) return;
        const data = {
            email: email,
            password: pwd
        }
        try {
            const response = await axios.post('/login', data ,{
                'Content-Type' : 'application/json'
            })
            // console.log(response.data)
            setCookie('token', response.data.access_token, {maxAge: 60 * 60 * 24})
            setEmail('')
            setPwd('')
            closeRef.current.click()
            router.push('/dashboard')
        } catch (e) {
            console.error(e.message)
        }
    }

    return (
        <>
            <div
                className="modal fade"
                id="modal-login"
                tabIndex={-1}
                role="dialog"
                aria-labelledby="modal-login"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-sm modal-login">
                    <div className="modal-content dark-bg img-bg img-bg-softer no-modal-header no-modal-footer">
                        <div className="modal-header">
                            <button
                                ref={closeRef}
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
                                                href="#modal-login"
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
                                                onSubmit={handleLogin}
                                                className="form-inline newsletter"
                                                role="form"
                                            >
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
                                                <a
                                                    className=""
                                                    href="#modal-forgot-password"
                                                    data-toggle="modal"
                                                    data-dismiss="modal"
                                                >
                                                    <h5>Forgot password</h5>
                                                </a>
                                                <button className="btn btn-green w-100">
                                                    LOGIN
                                                </button>
                                                <a
                                                    href="#modal-register"
                                                    data-toggle="modal"
                                                    data-dismiss="modal"
                                                    className="w-100 text-center mt-1 mb-4"
                                                >
                                                    <h5 className="text-white">
                                                        Register
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