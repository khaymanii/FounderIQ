export default function Testimonials() {
  return (
    <div className="py-20">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-12">
          Trusted by Founders Worldwide
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow">
            <p className="italic mb-4">
              “The AI Co-Founder helped me validate my SaaS idea in days, saving
              months of research. It’s like having an advisor always on call.”
            </p>
            <h4 className="font-semibold">— Sarah, SaaS Founder</h4>
          </div>
          <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow">
            <p className="italic mb-4">
              “From pitch deck creation to growth strategies, this tool gave me
              the confidence to raise my first round. Absolutely game-changing!”
            </p>
            <h4 className="font-semibold">— Daniel, Fintech Startup</h4>
          </div>
        </div>
      </div>
    </div>
  );
}
