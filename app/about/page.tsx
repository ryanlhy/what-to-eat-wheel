export default function AboutPage() {
    return (
        <main className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">About What To Eat Wheel</h1>

                <div className="space-y-6">
                    <section>
                        <h2 className="text-xl font-semibold mb-3">Our Mission</h2>
                        <p className="text-gray-600">
                            What To Eat Wheel was created to solve the eternal question: "What should we eat today?"
                            In Singapore's vibrant food scene, choosing from countless delicious options can be
                            overwhelming. Our wheel makes the decision-making process fun and effortless!
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">How It Works</h2>
                        <p className="text-gray-600">
                            Using a combination of randomization and customizable weights, our wheel helps you
                            discover food options you might not have considered. It's perfect for those times
                            when you're hungry but can't decide what to eat.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">Local Focus</h2>
                        <p className="text-gray-600">
                            Our wheel is specially curated for Singapore's diverse food culture, featuring everything
                            from hawker favorites to modern cuisine. Whether you're craving local delights or
                            international flavors, we've got you covered!
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
} 