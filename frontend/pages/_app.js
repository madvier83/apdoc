import "../styles/globals.css";
import "../styles/tailwind.css";
import NextNProgress from "nextjs-progressbar";

function MyApp({ Component, pageProps }) {
  return (
    <>
      {/* <NextNProgress
        color="#6366F1"
        startPosition={0.3}
        stopDelayMs={200}
        height={4}
        showOnShallow={true}
        // options={{ easing: 'ease', speed: 500 }}
      /> */}
      <Component {...pageProps} />
    </>
  );;
}

export default MyApp;
