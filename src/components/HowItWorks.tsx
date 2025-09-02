export default function HowItWorks() {
  return (
    <section className="w-full bg-white dark:bg-black">
      <div className="max-w-6xl mx-auto px-6 py-20 text-center">
        {/* Title */}
        <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-gray-900 dark:text-white">
          How It Works
        </h2>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="p-6 border rounded-2xl bg-white dark:bg-gray-900 shadow-sm">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 text-gray-900 dark:text-white">
              1. Select Your Startup Sector
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Choose your startup sector directly in the chatbot to get more
              personalized guidance.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 border rounded-2xl bg-white dark:bg-gray-900 shadow-sm">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 text-gray-900 dark:text-white">
              2. Share Your Idea
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Enter your startup concept, goals, or current challenges into the
              chatbot.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 border rounded-2xl bg-white dark:bg-gray-900 shadow-sm">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 text-gray-900 dark:text-white">
              3. Get Tailored Advice
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              The AI analyzes your inputs and delivers actionable strategies,
              resources, and recommendations.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-6 border rounded-2xl bg-white dark:bg-gray-900 shadow-sm md:col-span-3">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 text-gray-900 dark:text-white">
              4. Execute & Scale
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Follow step-by-step roadmaps, adjust as needed, and grow your
              startup with ongoing AI support.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
