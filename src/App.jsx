export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center p-6">
      <header className="w-full max-w-3xl text-center py-6 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-base44green">
          Bottle to Donation
        </h1>
        <p className="text-gray-600 mt-2">
          Turn your bottles into community impact
        </p>
      </header>

      <main className="w-full max-w-3xl mt-8 space-y-6">
        <section className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome</h2>
          <p className="text-gray-700">
            This is your test light theme layout. You can start adding your
            features and pages here.
          </p>
        </section>
      </main>

      <footer className="w-full max-w-3xl text-center py-4 mt-auto text-gray-500 text-sm">
        © {new Date().getFullYear()} Bottle to Donation
      </footer>
    </div>
  );
}
