import React, { useRef } from "react";
import ModalBox from "./ModalBox";

export default function ModalDelete({title, id, callback}) {
    const cancelRef = useRef()
    async function closeAfterCallback() {
        await callback();
        cancelRef.current.click()
    }
    return (
        <>
        <ModalBox id={id}>
            <div className="text-black z-50">
                <i className="fas fa-warning text-rose-500 text-6xl text-center w-full mt-8"></i>
                <h3 className="font-bold text-2xl text-center pb-8 pt-4">{title}</h3>
                <input type="hidden" autoComplete="off" />
                <div className="modal-action rounded-sm flex items-center justify-center mb-8">
                    <label htmlFor={id} ref={cancelRef} className="btn btn-ghost rounded-md w-2/5 bg-blue-100">
                    Cancel
                    </label>
                    <button className="btn btn-danger rounded-md w-2/5" onClick={closeAfterCallback}>Delete</button>
                </div>
            </div>
        </ModalBox>
        </>
    );
}
