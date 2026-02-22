import { motion, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";

// Animated counter component
const AnimatedCounter = ({ target, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;
    
    let startTime;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [isInView, target, duration]);

  return <span ref={ref}>{count}</span>;
};

// CTA Button component
const CTAButton = ({ text, onClick, variant = "primary", className = "" }) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300 rounded-lg";
  const variants = {
    primary: "bg-[#141414] hover:bg-[#262626] text-white px-8 py-4 text-lg",
    light: "bg-white hover:bg-gray-100 text-[#141414] px-8 py-4 text-lg"
  };

  return (
    <motion.button
      data-testid={`cta-${text.toLowerCase().replace(/\s+/g, '-')}`}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {text}
      <ArrowRight className="w-5 h-5" />
    </motion.button>
  );
};

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

export default function VSLPage() {
  const navigate = useNavigate();
  const handleCTAClick = () => navigate("/schedule");

  const faqItems = [
    { question: "Is this compliant?", answer: "Yes. We operate at the company/account level and use legally sourced enrichment data. We'll walk you through details on the call." },
    { question: "Does this replace our CRM?", answer: "No. It enhances it by adding intelligence that your CRM doesn't naturally capture." },
    { question: "How long does installation take?", answer: "Typically about 15 minutes." },
    { question: "Is there any commitment?", answer: "No. The 7-Day Reveal is simply an opportunity to evaluate what's possible." },
    { question: "What happens after the reveal?", answer: "If you see value, we discuss subscription options based on your traffic and goals." }
  ];

  return (
    <div className="min-h-screen bg-white" data-testid="vsl-page">
      
      {/* HERO SECTION - Clean white with subtle grid */}
      <section className="relative min-h-screen flex items-center justify-center py-20 px-4 section-white" data-testid="hero-section">
        <div className="absolute inset-0 grid-pattern opacity-50" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.h1 
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#141414] mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            You're Investing in Driving Traffic to Your Website…
          </motion.h1>
          
          <motion.p 
            className="text-xl sm:text-2xl text-[#141414] font-medium mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            It's Only Fair to Know Who's Showing Up.
          </motion.p>
          
          <motion.p 
            className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            If you're spending real money on SEO, ads, email, or campaigns — and most visitors leave without buying, signing up, or filling out a form — you deserve visibility.
          </motion.p>
          
          {/* Vimeo Video */}
          <motion.div 
            className="vimeo-wrapper mb-10 max-w-3xl mx-auto"
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
            className="flex flex-col items-center gap-3"
          >
            <CTAButton text="Book My 7-Day Reveal Call" onClick={handleCTAClick} />
            <p className="text-gray-500 text-sm">15-minute qualification call. No obligation.</p>
          </motion.div>
        </div>
        
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown className="w-8 h-8 text-gray-300" />
        </motion.div>
      </section>

      {/* SECTION 1 - The Reality (Gray background) */}
      <section className="py-24 px-4 section-gray" data-testid="reality-section">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeInUp}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#141414] mb-10">
              You're Doing What You're Supposed to Do.
            </h2>
            
            <div className="space-y-5 text-lg text-gray-600 leading-relaxed">
              <p>You've invested in driving traffic.</p>
              <p>You've worked on your messaging.</p>
              <p>You've tested pages.</p>
              <p>You've improved conversion rates.</p>
              <p>You've done what responsible business owners do.</p>
              
              <p className="text-[#141414] font-medium pt-4">And yes — sometimes results improve.</p>
              <p>But even when they do…</p>
              <p className="text-xl text-[#141414] font-semibold">Most visitors still leave.</p>
              
              <div className="pt-4 space-y-4">
                <p>Not because your business isn't good.</p>
                <p>Not because your offer isn't strong.</p>
                <p>But because modern buyers browse quietly.</p>
              </div>
              
              <div className="pt-4 space-y-4">
                <p>They research. They compare. They evaluate.</p>
              </div>
              
              <div className="pt-4 space-y-4 text-[#141414]">
                <p>And when they leave…</p>
                <p>You don't know who they were.</p>
                <p>You can't follow up.</p>
                <p>You can't continue the conversation.</p>
              </div>
              
              <p className="text-lg text-gray-700 font-medium pt-4">That's frustrating. And it's completely understandable.</p>
            </div>
            
            <div className="mt-12">
              <CTAButton text="Book the 7-Day Reveal Call" onClick={handleCTAClick} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* BIG STAT SECTION - Large 97% */}
      <section className="py-32 px-4 section-white" data-testid="stat-section">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div {...fadeInUp}>
            <div className="mb-8">
              <span className="stat-counter text-[120px] sm:text-[160px] lg:text-[200px] text-[#141414]">
                <AnimatedCounter target={97} duration={2000} />%
              </span>
            </div>
            <p className="text-xl sm:text-2xl text-gray-600 max-w-xl mx-auto">
              of your website visitors leave without identifying themselves.
            </p>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2 - The Shift with Comparison Block (Gray) */}
      <section className="py-24 px-4 section-gray" data-testid="shift-section">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeInUp}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#141414] mb-4">
              This Isn't About More Traffic.
            </h2>
            <p className="text-xl sm:text-2xl text-gray-700 font-medium mb-12">It's about more visibility.</p>
            
            <p className="text-lg text-gray-600 mb-10">You're already paying for attention. What if you could see more?</p>
            
            {/* Split Comparison Block */}
            <div className="grid md:grid-cols-2 gap-0 mb-12 border border-gray-200 rounded-xl overflow-hidden bg-white">
              <div className="p-8 md:border-r border-gray-200">
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-6">What You See Today</p>
                <ul className="space-y-4 text-gray-600">
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                    Purchases
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                    Form fills
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                    Sign-ups
                  </li>
                </ul>
              </div>
              <div className="p-8 bg-gray-50">
                <p className="text-sm font-medium text-[#141414] uppercase tracking-wider mb-6">What You Could See</p>
                <ul className="space-y-4 text-[#141414]">
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-[#141414] rounded-full" />
                    Who visited
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-[#141414] rounded-full" />
                    What they viewed
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-[#141414] rounded-full" />
                    Repeat interest
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-[#141414] rounded-full" />
                    Buying signals
                  </li>
                </ul>
              </div>
            </div>
            
            <p className="text-lg text-gray-700 mb-4">Instead of guessing who might be interested…</p>
            <p className="text-xl text-[#141414] font-bold mb-10">You would know. Not in theory. In your actual data.</p>
            
            <CTAButton text="Schedule My 15-Minute Call" onClick={handleCTAClick} />
          </motion.div>
        </div>
      </section>

      {/* SECTION 3 - The Solution (White) */}
      <section className="py-24 px-4 section-white" data-testid="solution-section">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#141414] mb-4">
              Introducing the Anonymous Buyer Reveal System™
            </h2>
            <p className="text-lg text-gray-600">A practical way to understand who is visiting your website.</p>
          </motion.div>
          
          <motion.div {...fadeInUp} className="space-y-6 text-lg text-gray-600 max-w-2xl mx-auto text-center mb-12">
            <p>It works alongside your existing marketing efforts.</p>
            <p>No overhaul. No complicated rebuild. Just additional clarity.</p>
          </motion.div>
          
          <motion.div {...fadeInUp} className="mb-12">
            <p className="text-center text-[#141414] font-semibold text-lg mb-8">The system helps you:</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {[
                "Detect company-level visitors",
                "Understand visitor behavior",
                "Identify patterns of intent",
                "Integrate insights into your CRM",
                "Decide how and when to follow up"
              ].map((item, index) => (
                <div key={index} className="premium-card rounded-lg p-4 text-center">
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
          
          <p className="text-lg text-gray-700 text-center font-medium">
            It doesn't replace what you're doing. It strengthens it.
          </p>
        </div>
      </section>

      {/* SECTION 4 - 7-Day Reveal with 3 Cards (Gray) */}
      <section className="py-24 px-4 section-gray" data-testid="reveal-section">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#141414] mb-4">
              We Don't Expect You to Commit.
            </h2>
            <p className="text-xl sm:text-2xl text-gray-700 font-medium">We Simply Offer to Show You.</p>
          </motion.div>
          
          <motion.p {...fadeInUp} className="text-lg text-gray-600 text-center mb-12">Here's how it works:</motion.p>
          
          {/* 3 Minimal Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              { step: "Step 1", title: "Install", desc: "We deploy a lightweight identification layer." },
              { step: "Step 2", title: "Monitor", desc: "For 7 days, we observe your inbound traffic." },
              { step: "Step 3", title: "Reveal", desc: "We review what we found together." }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="premium-card rounded-xl p-8 text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <p className="text-sm text-gray-400 font-medium mb-2">{item.step}</p>
                <h3 className="text-2xl font-bold text-[#141414] mb-4">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
          
          <motion.div {...fadeInUp} className="text-center space-y-3 text-lg text-gray-600 mb-12">
            <p>You'll see who has been showing up.</p>
            <p>If it's helpful, we discuss next steps.</p>
            <p>If it's not, you leave with insight.</p>
            <p className="text-[#141414] font-semibold text-xl pt-4">No pressure. No obligation.</p>
          </motion.div>
          
          <div className="text-center">
            <CTAButton text="Book My 7-Day Reveal Call" onClick={handleCTAClick} />
          </div>
        </div>
      </section>

      {/* SECTION 5 - Who This Works Best For (White) */}
      <section className="py-24 px-4 section-white" data-testid="qualification-section">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeInUp}>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#141414] mb-10 text-center">
              This works best for businesses that:
            </h2>
            
            <div className="space-y-4 mb-10">
              {[
                "Are actively investing in traffic",
                "Have meaningful monthly visitors",
                "Care about improving conversion and revenue",
                "Have a follow-up strategy (sales or marketing automation)"
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-4 text-lg"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <span className="text-[#141414] text-xl">✓</span>
                  <span className="text-gray-700">{item}</span>
                </motion.div>
              ))}
            </div>
            
            <p className="text-lg text-center text-gray-700 font-medium">
              If you're already investing in growth, this adds clarity.
            </p>
          </motion.div>
        </div>
      </section>

      {/* SECTION 6 - FAQ (Gray) */}
      <section className="py-24 px-4 section-gray" data-testid="faq-section">
        <div className="max-w-2xl mx-auto">
          <motion.div {...fadeInUp}>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#141414] mb-12 text-center">
              Frequently Asked Questions
            </h2>
            
            <Accordion type="single" collapsible className="space-y-3">
              {faqItems.map((item, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="bg-white rounded-xl border border-gray-200 px-6 overflow-hidden"
                  data-testid={`faq-item-${index}`}
                >
                  <AccordionTrigger className="text-lg text-[#141414] font-medium py-5 hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 pb-5">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* FINAL CTA SECTION - Dark background */}
      <section className="py-24 px-4 section-dark" data-testid="final-section">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              You're Already Investing in Traffic.
            </h2>
            <p className="text-lg text-gray-400 mb-3">You're already doing the work.</p>
            <p className="text-lg text-gray-400 mb-8">You're already trying to improve results.</p>
            <p className="text-xl text-white font-medium mb-10">
              Now it's time to see the full picture.
            </p>
            
            <div className="space-y-3">
              <p className="text-gray-300">Book your 7-Day Reveal call.</p>
              <p className="text-gray-300 mb-8">Let's find out who's been showing up.</p>
              
              <CTAButton text="Schedule My Qualification Call" onClick={handleCTAClick} variant="light" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-[#0a0a0a] border-t border-gray-800">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Visibility Pixel. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
