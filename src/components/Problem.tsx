export default function Problem() {
  return (
    <section className="w-full bg-white dark:bg-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-start text-center">
        {/* Problem */}
        <div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            The Problem
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Starting a business is tough. Founders often face overwhelming
            challenges: validating ideas, creating business models, writing
            pitches, planning product roadmaps, and finding the right growth
            strategies. Without proper guidance, time and resources are wasted,
            leading to high failure rates.
          </p>
        </div>

        {/* Solution */}
        <div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Our Solution
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Imagine having a co-founder who never sleeps, analyzes data in
            seconds, and provides strategic advice instantly. Our AI Co-Founder
            helps entrepreneurs move from idea to launch with clarity, offering
            expert-level consulting across all aspects of startup building.
          </p>
        </div>
      </div>
    </section>
  );
}
