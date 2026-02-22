import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Check, ArrowRight, Eye, Target, BarChart3, Users, ChevronDown } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

const CTAButton = ({ text, onClick, variant = "primary", className = "" }) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300 rounded-lg";
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 text-lg cta-pulse",
    secondary: "bg-transparent border-2 border-blue-600 text-blue-500 hover:bg-blue-600 hover:text-white px-8 py-4 text-lg"
  };

  return (
    <motion.button
      data-testid={`cta-${text.toLowerCase().replace(/\s+/g, '-')}`}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      {text}
      <ArrowRight className="w-5 h-5" />
    </motion.button>
  );
};

export default function VSLPage() {
  const navigate = useNavigate();

  const handleCTAClick = () => {
    navigate("/schedule");
  };

  const faqItems = [
    {
      question: "Is this compliant?",
      answer: "Yes. We operate at the company/account level and use legally sourced enrichment data. We'll walk you through details on the call."
    },
    {
      question: "Does this replace our CRM?",
      answer: "No. It enhances it by adding intelligence that your CRM doesn't naturally capture."
    },
    {
      question: "How long does installation take?",
      answer: "Typically about 15 minutes."
    },
    {
      question: "Is there any commitment?",
      answer: "No. The 7-Day Reveal is simply an opportunity to evaluate what's possible."
    },
    {
      question: "What happens after the reveal?",
      answer: "If you see value, we discuss subscription options based on your traffic and goals."
    }
  ];

  const qualificationItems = [
    "Are actively investing in traffic",
    "Have meaningful monthly visitors",
    "Care about improving conversion and revenue",
    "Have a follow-up strategy (sales or marketing automation)"
  ];

  return (
    <div className="vsl-container min-h-screen bg-[#050505]" data-testid="vsl-page">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center py-20 px-4" data-testid="hero-section">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/27141316/pexels-photo-27141316.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/30 via-[#050505]/80 to-[#050505]" />
        
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.p 
            className="text-blue-500 font-medium mb-4 tracking-wide uppercase text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            For Serious B2B Traffic Operators
          </motion.p>
          
          <motion.h1 
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            You're Investing in Driving Traffic to Your Website…
            <span className="block text-blue-500 mt-2">It's Only Fair to Know Who's Showing Up.</span>
          </motion.h1>
          
          <motion.p 
            className="text-lg text-zinc-400 max-w-3xl mx-auto mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            If you're spending real money on SEO, ads, email, or campaigns — and most visitors leave without buying, signing up, or filling out a form — you deserve visibility.
          </motion.p>
          
          {/* Vimeo Video Embed */}
          <motion.div 
            className="vimeo-wrapper mb-10 max-w-4xl mx-auto shadow-2xl shadow-blue-500/10"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            data-testid="vimeo-embed"
          >
            <iframe
              src="https://player.vimeo.com/video/1167050545?h=8067fe9053&badge=0&autopause=0&player_id=0&app_id=58479"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
              title="Visibility Pixel VSL"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <CTAButton text="Book My 7-Day Reveal Call" onClick={handleCTAClick} />
            <p className="text-zinc-500 text-sm">15-minute qualification call. No obligation.</p>
          </motion.div>
        </div>
        
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown className="w-8 h-8 text-zinc-600" />
        </motion.div>
      </section>

      {/* Section 1 - The Reality */}
      <section className="py-24 px-4 bg-[#0f0f0f]" data-testid="reality-section">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeInUp}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-8">
              You're Doing What You're Supposed to Do.
            </h2>
            
            <div className="space-y-6 text-lg text-zinc-400 leading-relaxed">
              <p>You've invested in driving traffic.</p>
              <p>You've worked on your messaging.</p>
              <p>You've tested pages.</p>
              <p>You've improved conversion rates.</p>
              <p>You've done what responsible business owners do.</p>
              
              <p className="text-white font-medium pt-4">And yes — sometimes results improve.</p>
              
              <p>But even when they do…</p>
              <p className="text-xl text-white font-semibold">Most visitors still leave.</p>
              
              <div className="pt-6 space-y-4">
                <p>Not because your business isn't good.</p>
                <p>Not because your offer isn't strong.</p>
                <p>But because <span className="text-blue-500">modern buyers browse quietly.</span></p>
              </div>
              
              <div className="pt-6 space-y-4">
                <p>They research.</p>
                <p>They compare.</p>
                <p>They evaluate.</p>
              </div>
              
              <div className="pt-6 space-y-4 text-white">
                <p>And when they leave…</p>
                <p>You don't know who they were.</p>
                <p>You can't follow up.</p>
                <p>You can't continue the conversation.</p>
                <p>You can't even understand what almost happened.</p>
              </div>
              
              <p className="text-xl text-amber-500 font-medium pt-6">That's frustrating. And it's completely understandable.</p>
            </div>
            
            <div className="mt-12">
              <CTAButton text="Book the 7-Day Reveal Call" onClick={handleCTAClick} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 2 - The Shift */}
      <section className="py-24 px-4 bg-[#050505]" data-testid="shift-section">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeInUp}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              This Isn't About More Traffic.
            </h2>
            <p className="text-2xl text-blue-500 font-semibold mb-8">It's about more visibility.</p>
            
            <p className="text-lg text-zinc-400 mb-8">You're already paying for attention. What if you could see:</p>
            
            <div className="space-y-4 mb-10">
              {[
                "Who is visiting your website",
                "Which pages they're spending time on",
                "Who is returning more than once",
                "Where interest is building"
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="feature-check">
                    <Eye className="w-4 h-4 text-emerald-500" />
                  </div>
                  <span className="text-lg text-white">{item}</span>
                </motion.div>
              ))}
            </div>
            
            <p className="text-xl text-zinc-300 mb-4">Instead of guessing who might be interested…</p>
            <p className="text-2xl text-white font-bold mb-4">You would know.</p>
            <p className="text-lg text-zinc-400 mb-10">Not in theory. In your actual data.</p>
            
            <CTAButton text="Schedule My 15-Minute Call" onClick={handleCTAClick} />
          </motion.div>
        </div>
      </section>

      {/* Big Stat Section */}
      <section className="py-24 px-4 bg-[#0f0f0f]" data-testid="stat-section">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div {...fadeInUp}>
            <div className="mb-8">
              <span className="stat-number text-7xl sm:text-8xl lg:text-9xl text-blue-500">97%</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6">
              Most Businesses Only See a Small Fraction of Their Traffic.
            </h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              The majority of visitors leave without identifying themselves. Not because they aren't interested. But because that's how people browse today.
            </p>
            <p className="text-lg text-zinc-300 mt-4">
              It doesn't mean your marketing isn't working. It means you don't have full visibility yet.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section 3 - The Solution */}
      <section className="py-24 px-4 bg-[#050505]" data-testid="solution-section">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <p className="text-blue-500 font-medium mb-4 tracking-wide uppercase text-sm">The Solution</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Introducing the Anonymous Buyer Reveal System™
            </h2>
            <p className="text-xl text-zinc-400">A practical way to understand who is visiting your website.</p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeInUp}>
              <img 
                src="https://images.pexels.com/photos/8090147/pexels-photo-8090147.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                alt="Technology Dashboard"
                className="rounded-xl shadow-2xl shadow-blue-500/10"
              />
            </motion.div>
            
            <motion.div {...fadeInUp} className="space-y-6">
              <p className="text-lg text-zinc-400">It works alongside your existing marketing efforts.</p>
              <p className="text-lg text-zinc-400">No overhaul. No complicated rebuild. Just additional clarity.</p>
              
              <div className="pt-4 space-y-4">
                <p className="text-white font-semibold text-lg">The system helps you:</p>
                {[
                  { icon: Target, text: "Detect company-level visitors" },
                  { icon: Eye, text: "Understand visitor behavior" },
                  { icon: BarChart3, text: "Identify patterns of intent" },
                  { icon: Users, text: "Integrate insights into your CRM" },
                  { icon: Check, text: "Decide how and when to follow up" }
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="feature-check">
                      <item.icon className="w-4 h-4 text-emerald-500" />
                    </div>
                    <span className="text-zinc-300">{item.text}</span>
                  </motion.div>
                ))}
              </div>
              
              <p className="text-lg text-amber-500 font-medium pt-4">
                It doesn't replace what you're doing. It strengthens it.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 4 - The 7-Day Reveal */}
      <section className="py-24 px-4 bg-[#0f0f0f]" data-testid="reveal-section">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              We Don't Expect You to Commit.
            </h2>
            <p className="text-2xl text-blue-500 font-semibold">We Simply Offer to Show You.</p>
          </motion.div>
          
          <motion.p {...fadeInUp} className="text-xl text-zinc-300 text-center mb-12">Here's how it works:</motion.p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              { step: 1, title: "Install", desc: "We deploy a lightweight identification layer." },
              { step: 2, title: "Monitor", desc: "For 7 days, we observe your inbound traffic." },
              { step: 3, title: "Reveal", desc: "We review what we found together." }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-[#1a1a1a] rounded-xl p-8 text-center border border-zinc-800 hover:border-blue-600/50 transition-colors"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <div className="step-indicator mx-auto mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Step {item.step}: {item.title}</h3>
                <p className="text-zinc-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
          
          <motion.div {...fadeInUp} className="text-center space-y-4 text-lg text-zinc-400 mb-12">
            <p>You'll see who has been showing up.</p>
            <p>If it's helpful, we discuss next steps.</p>
            <p>If it's not, you leave with insight.</p>
            <p className="text-white font-semibold text-xl pt-4">No pressure. No obligation.</p>
          </motion.div>
          
          <div className="text-center">
            <CTAButton text="Book My 7-Day Reveal Call" onClick={handleCTAClick} />
          </div>
        </div>
      </section>

      {/* Section 5 - Who This Works Best For */}
      <section className="py-24 px-4 bg-[#050505]" data-testid="qualification-section">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeInUp}>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8 text-center">
              This works best for businesses that:
            </h2>
            
            <div className="grid sm:grid-cols-2 gap-6 mb-10">
              {qualificationItems.map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-4 bg-[#0f0f0f] p-6 rounded-xl border border-zinc-800"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-emerald-500" />
                  </div>
                  <span className="text-lg text-zinc-300">{item}</span>
                </motion.div>
              ))}
            </div>
            
            <p className="text-xl text-center text-amber-500 font-medium">
              If you're already investing in growth, this adds clarity.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section 6 - FAQ */}
      <section className="py-24 px-4 bg-[#0f0f0f]" data-testid="faq-section">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeInUp}>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-12 text-center">
              Frequently Asked Questions
            </h2>
            
            <Accordion type="single" collapsible className="space-y-4">
              {faqItems.map((item, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="bg-[#1a1a1a] rounded-xl border border-zinc-800 px-6 overflow-hidden"
                  data-testid={`faq-item-${index}`}
                >
                  <AccordionTrigger className="text-lg text-white font-medium py-6 hover:text-blue-500 transition-colors hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-400 pb-6">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* Final Section - Calm Close */}
      <section className="py-24 px-4 bg-[#050505]" data-testid="final-section">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              You're Already Investing in Traffic.
            </h2>
            <p className="text-xl text-zinc-400 mb-4">You're already doing the work.</p>
            <p className="text-xl text-zinc-400 mb-8">You're already trying to improve results.</p>
            <p className="text-2xl text-blue-500 font-semibold mb-10">
              Now it's time to see the full picture.
            </p>
            
            <div className="space-y-4">
              <p className="text-lg text-zinc-300">Book your 7-Day Reveal call.</p>
              <p className="text-lg text-zinc-300 mb-8">Let's find out who's been showing up.</p>
              
              <CTAButton text="Schedule My Qualification Call" onClick={handleCTAClick} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-[#0f0f0f] border-t border-zinc-800">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-zinc-500 text-sm">
            © {new Date().getFullYear()} Visibility Pixel. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
