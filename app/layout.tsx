import './globals.css'
import BackgroundImage from '@/components/BackgroundImage'
import Navbar from '@/components/Navbar'

export const metadata = {
    title: 'WEW - What To Eat',
    description: 'Let the wheel decide your next meal in Singapore!',
}

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
                <Navbar />
                <main className="">
                    {children}
                </main>
            </body>
        </html>
    )
} 