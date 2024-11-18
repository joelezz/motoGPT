import "./global.css"

export const metadata = {
    title: "MotoGPT",
    description: "The place to go for all your Formula One questions"
}

const RootLayout = ({ children }) => {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}

export default RootLayout;
