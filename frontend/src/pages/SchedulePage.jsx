import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Shield, Check } from "lucide-react";

export default function SchedulePage() {
  const navigate = useNavigate();

  const benefits = [
    "See exactly who's visiting your website",
    "Understand visitor behavior and intent",
    "No commitment required",
    "15-minute qualification call"
  ];

  return (
    <div className="min-h-screen bg-white" data-testid="schedule-page">
      {/* Header */}
      <header className="py-6 px-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-500 hover:text-[#141414] transition-colors"
            data-testid="back-button"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Video</span>
          </button>
          <div className="text-[#141414] font-bold text-xl">
            <span className="font-normal">Visibility</span>Pixel
          </div>
        </div>
      </header>

      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-12 items-start">
            {/* Left Column - Info (2 cols) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2"
            >
              <h1 className="text-3xl sm:text-4xl font-bold text-[#141414] mb-6">
                Book Your 7-Day Reveal Call
              </h1>
              
              <p className="text-lg text-gray-600 mb-8">
                Schedule a 15-minute qualification call to see if the Anonymous Buyer Reveal System is right for your business.
              </p>

              <div className="space-y-4 mb-10">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <span className="text-[#141414]">✓</span>
                    <span className="text-gray-700">{benefit}</span>
                  </motion.div>
                ))}
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-[#141414] font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  What to Expect
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span>15-minute call to understand your traffic and goals</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span>We'll determine if you're a good fit for the 7-Day Reveal</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span>No sales pressure — just an honest conversation</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Right Column - Bookafy Calendar Embed (3 cols) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-3 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-lg"
              data-testid="bookafy-calendar"
            >
              {/* Bookafy Calendar Embed */}
              <iframe
                src="https://websitetalkingheads.bookafy.com/schedule?type=iframe&locale=en"
                height="800"
                style={{ width: "100%" }}
                frameBorder="0"
                title="Book Appointment"
                data-testid="bookafy-iframe"
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-50 border-t border-gray-200 mt-auto">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Visibility Pixel. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
