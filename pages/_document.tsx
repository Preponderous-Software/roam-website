import {Html, Head, Main, NextScript} from 'next/document';

// Load the brand fonts (Inter for body, Space Grotesk for headings) from Google
// Fonts. They are linked here in the document head, with preconnect hints to
// keep the extra round-trip cheap. next/font is available on Next 14 and moving
// to it would be a separate, behaviour-changing step.
export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
                    rel="stylesheet"
                />
            </Head>
            <body>
                <Main/>
                <NextScript/>
            </body>
        </Html>
    );
}
