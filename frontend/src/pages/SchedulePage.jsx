import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Shield, Check } from "lucide-react";
import { Button } from "../components/ui/button";

export default function SchedulePage() {
  const navigate = useNavigate();

  const benefits = [
    "See exactly who's visiting your website",
    "Understand visitor behavior and intent",
    "No commitment required",
    "15-minute qualification call"
  ];

  return (
    <div className="min-h-screen bg-[#050505]" data-testid="schedule-page">
      {/* Header */}
      <header className="py-6 px-4 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
            data-testid="back-button"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Video</span>
          </button>
          <div className="text-white font-bold text-xl">
            <span className="text-blue-500">Visibility</span>Pixel
          </div>
        </div>
      </header>

      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                Book Your 7-Day Reveal Call
              </h1>
              
              <p className="text-lg text-zinc-400 mb-8">
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
                    <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-emerald-500" />
                    </div>
                    <span className="text-zinc-300">{benefit}</span>
                  </motion.div>
                ))}
              </div>

              <div className="bg-[#0f0f0f] rounded-xl p-6 border border-zinc-800">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  What to Expect
                </h3>
                <ul className="space-y-3 text-zinc-400">
                  <li className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-zinc-500 mt-0.5 flex-shrink-0" />
                    <span>15-minute call to understand your traffic and goals</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-zinc-500 mt-0.5 flex-shrink-0" />
                    <span>We'll determine if you're a good fit for the 7-Day Reveal</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-zinc-500 mt-0.5 flex-shrink-0" />
                    <span>No sales pressure — just an honest conversation</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Right Column - Bookafy Calendar Embed */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-[#0f0f0f] rounded-xl border border-zinc-800 overflow-hidden"
              data-testid="bookafy-calendar"
            >
              <div className="p-4 border-b border-zinc-800">
                <h3 className="text-white font-semibold">Select a Time</h3>
              </div>
              
              {/* Bookafy Calendar Embed */}
              <div className="bookafy-wrapper min-h-[600px]">
                <iframe
                  src="https://www.bookafy.com/booking/visibilitypixel"
                  title="Book Appointment"
                  className="w-full h-[600px] border-0"
                  allow="payment"
                  data-testid="bookafy-iframe"
                />
              </div>
              
              {/* Fallback if iframe doesn't load properly */}
              <div className="p-6 text-center border-t border-zinc-800">
                <p className="text-zinc-400 text-sm mb-4">
                  Having trouble with the calendar?
                </p>
                <a
                  href="https://www.bookafy.com/booking/visibilitypixel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 transition-colors"
                  data-testid="bookafy-direct-link"
                >
                  Open booking page directly
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 px-4 bg-[#0f0f0f] border-t border-zinc-800 mt-auto">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-zinc-500 text-sm">
            © {new Date().getFullYear()} Visibility Pixel. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
