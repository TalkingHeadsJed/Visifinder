import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Shield, Check, Zap } from "lucide-react";

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
            className="flex items-center gap-2 text-gray-500 hover:text-[#EAA73F] transition-colors"
            data-testid="back-button"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Video</span>
          </button>
          <div className="text-[#0a0a0a] font-bold text-xl">
            <span className="gradient-text">Visibility</span>Pixel
          </div>
        </div>
      </header>

      <div className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-12 items-start">
            {/* Left Column - Info (2 cols) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2"
            >
              <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-[#EAA73F] px-3 py-1.5 rounded-full mb-4 text-sm font-medium">
                <Zap className="w-4 h-4" />
                <span>7-Day Free Reveal</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-bold text-[#0a0a0a] mb-4">
                Book Your <span className="gradient-text">Reveal Call</span>
              </h1>
              
              <p className="text-lg text-gray-600 mb-8">
                Schedule a 15-minute call to see if you qualify for the 7-Day Anonymous Buyer Reveal.
              </p>

              <div className="space-y-4 mb-8">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <div className="w-6 h-6 bg-[#EAA73F] rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700">{benefit}</span>
                  </motion.div>
                ))}
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-white rounded-xl p-6 border border-amber-100">
                <h3 className="text-[#0a0a0a] font-bold mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#EAA73F]" />
                  What to Expect
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span>15-minute call to understand your traffic and goals</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span>We'll determine if you qualify for the 7-Day Reveal</span>
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
              className="lg:col-span-3 bg-white rounded-2xl border-2 border-[#EAA73F] overflow-hidden shadow-xl shadow-amber-100/50"
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
