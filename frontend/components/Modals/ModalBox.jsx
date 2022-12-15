import React from "react";

export default function ModalBox({id, children}) {
    return (
        <>
        <input type="checkbox" id={id} className="modal-toggle" />
        <div className="modal modal-bottom sm:modal-middle rounded-sm">
            <div className="modal-box">
                {children}
            </div>
        </div>
        </>
    );
}
