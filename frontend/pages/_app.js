import "../styles/globals.css";
import "../styles/tailwind.css";
import { Provider } from "jotai";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Provider>
        <Component {...pageProps} />
      </Provider>
    </>
  );
}

export default MyApp;
