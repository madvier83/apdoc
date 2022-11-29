import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html>
            <Head>
                {/* Meta */}
                {/* <meta charSet="utf-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0, user-scalable=no"
                />
                <meta name="description" content="" />
                <meta name="author" content="" /> */}

                {/* Core CSS */}
                <link href="./css/bootstrap.min.css" rel="stylesheet" />
                <link href="./css/main.css" rel="stylesheet" />
                {/* AddOn/Plugin CSS */}
                <link href="./css/green.css" rel="stylesheet" title="Color" />
                <link href="./css/owl.carousel.css" rel="stylesheet" />
                <link href="./css/owl.transitions.css" rel="stylesheet" />
                <link href="./css/animate.min.css" rel="stylesheet" />
                <link href="./css/aos.css" rel="stylesheet" />
                {/* Custom CSS */}
                <link href="./css/custom.css" rel="stylesheet" />
                {/* Fonts */}
                <link
                    href="http://fonts.googleapis.com/css?family=Lato:400,900,300,700"
                    rel="stylesheet"
                />
                <link
                    href="http://fonts.googleapis.com/css?family=Source+Sans+Pro:400,700,400italic,700italic"
                    rel="stylesheet"
                />
                {/* Icons/Glyphs */}
                <link href="./fonts/fontello.css" rel="stylesheet" />
                {/* Favicon */}
                <link rel="shortcut icon" href="./images/favicon.ico" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
