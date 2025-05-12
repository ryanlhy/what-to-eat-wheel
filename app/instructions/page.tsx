export default function InstructionsPage() {
    return (
        <main className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">How to Use the Food Wheel</h1>

                <div className="space-y-6">
                    <section>
                        <h2 className="text-xl font-semibold mb-3">1. Spin the Wheel</h2>
                        <p className="text-gray-600">
                            Click the spin button or give the wheel a swipe to start the randomization process.
                            The wheel will spin and gradually slow down to reveal your food destiny!
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">2. Customize Your Options</h2>
                        <p className="text-gray-600">
                            Don't like what you see? You can customize the wheel by:
                            <ul className="list-disc ml-6 mt-2">
                                <li>Adding new food options</li>
                                <li>Removing existing options</li>
                                <li>Adjusting the probability weights</li>
                            </ul>
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">3. Save Your Preferences</h2>
                        <p className="text-gray-600">
                            Your customized wheel options will be automatically saved in your browser,
                            so they'll be ready the next time you're hungry and indecisive!
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
} 