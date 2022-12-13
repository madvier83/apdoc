import React from "react";

export default function FooterAdmin() {
  return (
    <>
      <footer className="absolute bottom-0 w-full py-4">
        <div className="pr-16">
          <hr className="mb-4 border-b-1 border-slate-700" />
          <div className="flex flex-wrap items-center md:justify-between justify-center">
            <div className="w-full px-4">
              <div className="text-sm text-slate-700 font-semibold py-1 text-center">
                Copyright © {new Date().getFullYear()}{" "}
                <a
                  href="https://www.creative-tim.com?ref=nnjs-footer-admin"
                  className="text-slate-700 text-sm font-semibold py-1"
                >
                  Creative Tim
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
