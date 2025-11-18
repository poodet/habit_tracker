export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
                <h1 className="text-4xl font-bold text-center mb-8">
                    Customizable Calendar Application
                </h1>
                <p className="text-center text-xl mb-4">
                    Welcome to your personalized event tracking system
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                    <div className="p-6 border rounded-lg">
                        <h2 className="text-xl font-semibold mb-2">📊 Custom Objects</h2>
                        <p>Define your own object types with custom attributes</p>
                    </div>
                    <div className="p-6 border rounded-lg">
                        <h2 className="text-xl font-semibold mb-2">📅 Calendar Events</h2>
                        <p>Track events and link them to your custom objects</p>
                    </div>
                    <div className="p-6 border rounded-lg">
                        <h2 className="text-xl font-semibold mb-2">📈 Statistics</h2>
                        <p>Visualize your data with charts and analytics</p>
                    </div>
                </div>
            </div>
        </main>
    )
}
