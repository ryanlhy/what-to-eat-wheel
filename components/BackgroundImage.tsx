import Image from 'next/image'

export default function BackgroundImage() {
    return (
        <div className="fixed inset-0 -z-10">
            <Image
                alt="Background"
                // src="https://res.cloudinary.com/dz4lbnlcd/image/upload/v1717993674/samples/coffee.jpg"
                // src="/background-image.png"
                src="https://res.cloudinary.com/dz4lbnlcd/image/upload/f_auto,q_auto/v1/small-projects/hw9aw1iqxj4s18mowq9p"
                quality={100}
                fill
                sizes="100vw"
                priority
                style={{
                    objectFit: 'cover',
                }}
            />
            <div className="absolute inset-0 bg-white/70" />
        </div>
    )
} 