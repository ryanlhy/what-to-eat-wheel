import './globals.css'
import BackgroundImage from '@/components/BackgroundImage'

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className="overflow-x-hidden">
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
            </head>
            <body className="overflow-x-hidden">
                <BackgroundImage />
                {children}
            </body>
        </html>
    )
} 