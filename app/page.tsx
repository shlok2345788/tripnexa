import Hero from "@/components/Hero";
import PopularRoutes from "@/components/PopularRoutes";

export default function Home() {
  return (
    <>
      <Hero />
      <PopularRoutes />

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">Why Choose <span className="text-blue-600">TripNexa</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-xl transition-shadow group">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold group-hover:scale-110 transition-transform">
                🏷️
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Transparent Pricing</h3>
              <p className="text-gray-600">No hidden costs. Get estimated prices upfront based on distance and car type.</p>
            </div>

            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-xl transition-shadow group">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold group-hover:scale-110 transition-transform">
                🛡️
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Safe & Reliable</h3>
              <p className="text-gray-600">Verified drivers, well-maintained cars, and 24/7 support for your peace of mind.</p>
            </div>

            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-xl transition-shadow group">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold group-hover:scale-110 transition-transform">
                🚙
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Self Drive Option</h3>
              <p className="text-gray-600">Want to drive? Rent our premium cars for self-drive and travel at your own pace.</p>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
