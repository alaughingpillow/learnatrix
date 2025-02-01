export const Privacy = () => {
  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      <main className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="space-y-8 max-w-3xl mx-auto">
          <div className="bg-[#1E293B] p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-3 text-[#4785FF]">Data Collection</h2>
            <p className="text-gray-300">
              We collect information that you provide directly to us, including your name, email address, and test results. This information is used to provide and improve our services.
            </p>
          </div>

          <div className="bg-[#1E293B] p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-3 text-[#4785FF]">Data Usage</h2>
            <p className="text-gray-300">
              Your data is used to:
              - Provide personalized feedback on your test performance
              - Generate analytics to help you track your progress
              - Improve our AI-powered features and services
            </p>
          </div>

          <div className="bg-[#1E293B] p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-3 text-[#4785FF]">Data Protection</h2>
            <p className="text-gray-300">
              We implement appropriate security measures to protect your personal information. Your data is stored securely on our servers and is only accessible to authorized personnel.
            </p>
          </div>

          <div className="bg-[#1E293B] p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-3 text-[#4785FF]">Contact Us</h2>
            <p className="text-gray-300">
              If you have any questions about our privacy policy or how we handle your data, please contact our support team.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};