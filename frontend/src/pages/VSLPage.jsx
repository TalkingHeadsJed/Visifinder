import { motion, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { ArrowRight, ChevronDown, TrendingDown, DollarSign, Users, Eye, Target, BarChart3, Check, X, Sparkles, Zap, ShieldCheck, Clock } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import { getVariantContent, trackCTAClick, getVariant } from "../config/abTest";

// Animated counter component
const AnimatedCounter = ({ target, duration = 2000, suffix = "" }) => {
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
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, target, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

// CTA Button
const CTAButton = ({ text, onClick, variant = "gold", className = "", size = "lg" }) => {
  const sizeClasses = {
    lg: "px-10 py-5 text-lg",
    md: "px-8 py-4 text-base"
  };
  const variants = {
    gold: "cta-gold text-white font-bold rounded-2xl",
    dark: "bg-[#0a0a0a] hover:bg-[#1a1a1a] text-white font-bold rounded-2xl shadow-xl",
    outline: "border-2 border-[#589DFD] text-[#589DFD] hover:bg-[#589DFD] hover:text-white font-bold rounded-2xl transition-all"
  };

  return (
    <motion.button
      data-testid={`cta-${text.toLowerCase().replace(/\s+/g, '-')}`}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-3 ${sizeClasses[size]} ${variants[variant]} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
    >
      {text}
      <ArrowRight className="w-5 h-5" />
    </motion.button>
  );
};

// Pain Bar Graph
const PainBarGraph = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  return (
    <div ref={ref} className="relative h-72 flex items-end justify-center gap-16 py-8">
      <div className="flex flex-col items-center">
        <motion.div 
          className="w-24 sm:w-32 rounded-t-2xl relative overflow-hidden"
          style={{ background: 'linear-gradient(180deg, #EAA73F 0%, #F5C063 100%)' }}
          initial={{ height: 0 }}
          animate={isInView ? { height: 220 } : { height: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </motion.div>
        <div className="mt-4 text-center">
          <p className="text-lg font-bold text-gray-800">Your Traffic</p>
          <p className="text-sm text-[#EAA73F] font-semibold">100%</p>
        </div>
      </div>
      
      <div className="flex flex-col items-center justify-center h-full pb-16">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={isInView ? { scale: 1, rotate: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center shadow-lg"
        >
          <TrendingDown className="w-8 h-8 text-red-500" />
        </motion.div>
      </div>
      
      <div className="flex flex-col items-center">
        <motion.div 
          className="w-24 sm:w-32 rounded-t-2xl relative overflow-hidden"
          style={{ background: 'linear-gradient(180deg, #ef4444 0%, #f87171 100%)' }}
          initial={{ height: 0 }}
          animate={isInView ? { height: 14 } : { height: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </motion.div>
        <div className="mt-4 text-center">
          <p className="text-lg font-bold text-gray-800">Identified</p>
          <p className="text-sm text-red-500 font-bold">Only 3%</p>
        </div>
      </div>
    </div>
  );
};

const fadeInUp = {
  initial: { opacity: 0, y: 50 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: "easeOut" }
};

const staggerContainer = {
  initial: {},
  whileInView: {
    transition: { staggerChildren: 0.1 }
  },
  viewport: { once: true }
};

export default function VSLPage() {
  const navigate = useNavigate();
  
  // A/B Test - Get variant content
  const [variantContent, setVariantContent] = useState(null);
  const [currentVariant, setCurrentVariant] = useState(null);
  
  useEffect(() => {
    setVariantContent(getVariantContent());
    setCurrentVariant(getVariant());
  }, []);
  
  const handleCTAClick = (ctaName = "default") => {
    trackCTAClick(ctaName);
    navigate("/schedule");
  };

  const faqItems = [
    { question: "Is this compliant with privacy laws?", answer: "Yes. VisiFinder operates at the company/account level for B2B and uses legally sourced, compliant data enrichment. We'll walk you through all the details on the call." },
    { question: "Does this work for eCommerce and DTC brands?", answer: "Absolutely. Whether you're B2B, B2C, or DTC, if you're driving traffic and want to know who's visiting, VisiFinder reveals those anonymous visitors." },
    { question: "Does this replace our CRM or analytics?", answer: "No. It enhances them by adding intelligence they can't naturally capture—the identity of visitors who never fill out a form." },
    { question: "How long does installation take?", answer: "About 15 minutes. It's a simple script—no developer needed." },
    { question: "Is there any commitment?", answer: "None. The 7-Day Reveal is free. If you see value, we talk next steps. If not, you leave with insights." },
    { question: "What if it doesn't find anyone valuable?", answer: "Then you pay nothing. We only win if you win." }
  ];

  return (
    <div className="min-h-screen bg-[#fafbfc] relative" data-testid="vsl-page" data-variant={currentVariant}>
      <div className="grain-overlay" />
      
      {/* A/B Test Variant Indicator (remove in production) */}
      {currentVariant && (
        <div className="fixed bottom-4 left-4 z-50 bg-black/80 text-white px-3 py-1.5 rounded-full text-xs font-mono">
          Variant {currentVariant}
        </div>
      )}
      
      {/* ============================================
          SECTION 1: HOOK - Pattern Interrupt + Problem
          ============================================ */}
      <section className="relative min-h-screen flex items-center justify-center py-16 px-4 overflow-hidden" data-testid="hero-section">
        <div className="floating-shape w-[600px] h-[600px] bg-[#589DFD] top-[-20%] right-[-10%]" />
        <div className="floating-shape w-[400px] h-[400px] bg-[#EAA73F] bottom-[-10%] left-[-5%]" />
        
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Pattern interrupt badge - A/B Tested */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 glass px-5 py-2.5 rounded-full mb-8 text-sm font-bold text-[#589DFD] shadow-lg"
          >
            <Sparkles className="w-4 h-4" />
            <span>{variantContent?.badge || "Finally See Who's Visiting Your Website"}</span>
          </motion.div>
          
          {/* HOOK - A/B Tested Headline */}
          <motion.h1 
            className="text-4xl sm:text-5xl lg:text-7xl font-black text-[#0a0a0a] mb-8 leading-[1.1]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="blue-gradient-text">{variantContent?.headline?.line1 || "97% of Your Website Visitors"}</span>
            <br />
            <span className="text-[#0a0a0a]">{variantContent?.headline?.line2 || "Leave Without a Trace"}</span>
            <br />
            <span className="text-red-600 relative inline-block">
              {variantContent?.headline?.line3 || "And You Have No Idea Who They Were."}
            </span>
          </motion.h1>
          
          {/* Agitate - A/B Tested Subtext */}
          <motion.p 
            className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <span dangerouslySetInnerHTML={{ __html: variantContent?.subtext?.main || "You're spending <strong>real money</strong> driving traffic—ads, SEO, social, email. People click. They browse. They leave. And you're left wondering:" }} />
            <span className="text-red-600 font-bold"> {variantContent?.subtext?.pain || "Who were they? Why didn't they buy? Could I have followed up?"}</span>
            <span className="block mt-3 text-[#589DFD] font-semibold text-lg">{variantContent?.subtext?.hook || "What if you could finally know?"}</span>
          </motion.p>
          
          {/* Video */}
          <motion.div 
            className="vimeo-wrapper mb-10 max-w-4xl mx-auto"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            data-testid="vimeo-embed"
          >
            <iframe
              src="https://player.vimeo.com/video/1167050545?h=8067fe9053&badge=0&autopause=0&player_id=0&app_id=58479"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
              title="VisiFinder VSL"
            />
          </motion.div>
          
          {/* First CTA - Early placement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col items-center gap-4"
          >
            <CTAButton text="See Who's Visiting — Free 7-Day Reveal" onClick={() => handleCTAClick("hero_main")} />
            <p className="text-gray-500 text-sm">No credit card. No commitment. Just answers.</p>
          </motion.div>
        </div>
        
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 12, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown className="w-8 h-8 text-[#589DFD]" />
        </motion.div>
      </section>

      {/* ============================================
          SECTION 2: PROBLEM AMPLIFICATION
          ============================================ */}
      <section className="py-24 px-4 section-gray relative" data-testid="pain-section">
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-red-100 text-red-600 rounded-full text-sm font-bold mb-4">THE PROBLEM YOU'RE FACING</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0a0a0a] mb-4">
              You're Paying for <span className="text-red-600">100%</span> of Your Traffic
            </h2>
            <p className="text-xl text-gray-600">But you only know who <span className="font-bold text-red-600">3%</span> of them are.</p>
          </motion.div>
          
          {/* Visual proof of the problem */}
          <motion.div {...fadeInUp} className="floating-card p-8 sm:p-12 mb-16">
            <PainBarGraph />
            <div className="text-center mt-6 space-y-2">
              <p className="text-gray-600">Every visitor costs you money. Every anonymous exit is lost opportunity.</p>
              <p className="text-red-600 font-bold text-lg">The other 97%? They could be your best customers. And you'll never know.</p>
            </div>
          </motion.div>
          
          {/* Relatable pain scenarios */}
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h3 className="text-2xl font-bold text-[#0a0a0a] mb-6">Sound Familiar?</h3>
          </motion.div>
          
          <motion.div {...staggerContainer} className="grid md:grid-cols-3 gap-8">
            {[
              { icon: DollarSign, title: "Wasted Ad Spend", desc: "Paying for clicks that vanish into thin air. No name. No email. No follow-up.", color: "red" },
              { icon: Users, title: "Invisible Buyers", desc: "Someone browsed your pricing page 5 times this week. Who? You'll never know.", color: "red" },
              { icon: TrendingDown, title: "Lost Revenue", desc: "Competitors reach your visitors first because they know who's shopping. You don't.", color: "red" }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="floating-card p-8 text-center group"
              >
                <div className={`icon-badge icon-badge-${item.color} mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-7 h-7 text-white relative z-10" />
                </div>
                <h3 className="text-xl font-bold text-[#0a0a0a] mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
          
          {/* CTA after problem section */}
          <motion.div {...fadeInUp} className="text-center mt-12">
            <CTAButton text="Stop Losing Visitors — Book Your Reveal" onClick={() => handleCTAClick("after_problem")} size="md" />
          </motion.div>
        </div>
      </section>

      {/* ============================================
          SECTION 2.5: VISUAL IMPACT - Invisible vs Visible
          ============================================ */}
      <section className="py-10 px-4 section-white relative overflow-hidden" data-testid="visual-section">
        <div className="max-w-3xl mx-auto relative z-10">
          <motion.div {...fadeInUp} className="text-center mb-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0a0a0a]">
              See the Difference
            </h2>
          </motion.div>
          
          <motion.div 
            {...fadeInUp}
            className="relative"
          >
            {/* Main comparison image */}
            <div className="rounded-2xl overflow-hidden shadow-xl max-h-[280px] flex items-center justify-center">
              <img 
                src="https://customer-assets.emergentagent.com/job_91154cc5-6887-48b2-bd90-93334b2768e9/artifacts/ocl1pycn_Hispanic-manweb.png"
                alt="Anonymous visitor vs identified visitor comparison"
                className="w-full h-auto object-cover"
              />
            </div>
            
            {/* Labels below image */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              {/* Left label - Without */}
              <div className="floating-card floating-card-red p-3 text-center">
                <p className="text-xs font-bold text-red-500 mb-0.5">WITHOUT VISIFINDER</p>
                <p className="text-base sm:text-lg font-bold text-[#0a0a0a]">Your Website Now</p>
                <p className="text-gray-500 text-sm">Anonymous. Invisible. Unknown.</p>
              </div>
              
              {/* Right label - With */}
              <div className="floating-card floating-card-blue p-3 text-center">
                <p className="text-xs font-bold text-[#589DFD] mb-0.5">WITH VISIFINDER</p>
                <p className="text-base sm:text-lg font-bold text-[#0a0a0a]">Your Website Revealed</p>
                <p className="text-gray-500 text-sm">Names. Companies. Intent.</p>
              </div>
            </div>
          </motion.div>
          
          <motion.p 
            {...fadeInUp}
            className="text-center text-base text-gray-600 mt-4 max-w-xl mx-auto"
          >
            Every day, real people visit your website. With VisiFinder, 
            <span className="font-bold text-[#589DFD]"> you finally see who they are.</span>
          </motion.p>
        </div>
      </section>

      {/* ============================================
          SECTION 3: BIG STAT - Emotional Impact
          ============================================ */}
      <section className="py-32 px-4 section-dark relative" data-testid="stat-section">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div {...fadeInUp}>
            <span className="stat-counter text-[100px] sm:text-[150px] lg:text-[200px] blue-gradient-text">
              <AnimatedCounter target={97} duration={2500} suffix="%" />
            </span>
            <p className="text-xl sm:text-2xl text-gray-300 max-w-xl mx-auto mt-6">
              of your website visitors leave without ever identifying themselves.
            </p>
            <p className="text-lg text-[#589DFD] font-semibold mt-4">
              That's not a marketing problem. That's a <span className="underline decoration-2">visibility</span> problem.
            </p>
            <p className="text-2xl text-white font-bold mt-4">
              And <span className="gradient-text">VisiFinder™</span> solves it.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============================================
          SECTION 4: THE SOLUTION + TRANSFORMATION
          ============================================ */}
      <section className="py-24 px-4 section-gray relative" data-testid="shift-section">
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-blue-100 text-[#589DFD] rounded-full text-sm font-bold mb-4">THE SOLUTION</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0a0a0a] mb-4">
              Imagine <span className="blue-gradient-text">Finally Knowing</span> Who Visits
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">What would change if you could see every visitor—not just the 3% who fill out forms?</p>
          </motion.div>
          
          {/* Before/After Transformation */}
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-16">
            {/* Before */}
            <motion.div 
              {...fadeInUp}
              className="floating-card floating-card-red p-8 lg:p-10 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 to-red-400" />
              
              <div className="flex items-center gap-4 mb-8">
                <div className="icon-badge icon-badge-red">
                  <X className="w-6 h-6 text-white relative z-10" />
                </div>
                <h3 className="text-2xl font-bold text-[#0a0a0a]">Right Now (Blind)</h3>
              </div>
              
              <ul className="space-y-5 mb-8">
                {[
                  "Anonymous visitors disappear forever",
                  "Guessing which campaigns actually work",
                  "Competitors convert YOUR traffic",
                  "Marketing feels like throwing darts blindfolded"
                ].map((item, i) => (
                  <motion.li 
                    key={i} 
                    className="flex items-start gap-4 text-gray-700"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <X className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                    <span className="text-lg">{item}</span>
                  </motion.li>
                ))}
              </ul>
              
              <div className="floating-image h-48">
                <img 
                  src="https://images.pexels.com/photos/5717791/pexels-photo-5717791.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                  alt="Frustrated marketer"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
            
            {/* After */}
            <motion.div 
              {...fadeInUp}
              className="floating-card floating-card-blue p-8 lg:p-10 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#589DFD] to-[#7BB5FF]" />
              
              <div className="flex items-center gap-4 mb-8">
                <div className="icon-badge icon-badge-blue">
                  <Check className="w-6 h-6 text-white relative z-10" />
                </div>
                <h3 className="text-2xl font-bold text-[#0a0a0a]">With <span className="text-[#589DFD]">VisiFinder™</span></h3>
              </div>
              
              <ul className="space-y-5 mb-8">
                {[
                  "See exactly who visits your site",
                  "Know which pages they viewed & how often",
                  "Identify hot leads before they buy elsewhere",
                  "Follow up with the right message at the right time"
                ].map((item, i) => (
                  <motion.li 
                    key={i} 
                    className="flex items-start gap-4 text-gray-700"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Check className="w-5 h-5 text-[#589DFD] mt-1 flex-shrink-0" />
                    <span className="text-lg">{item}</span>
                  </motion.li>
                ))}
              </ul>
              
              <div className="floating-image h-48">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MDZ8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGRhc2hib2FyZCUyMGFuYWx5dGljcyUyMGRhdGElMjBpbnNpZ2h0cyUyMHN1Y2Nlc3N8ZW58MHx8fHwxNzcxNzUwNjIxfDA&ixlib=rb-4.1.0&q=85"
                  alt="Analytics dashboard"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
          
          <div className="text-center">
            <CTAButton text="Get Your Free 7-Day Reveal" onClick={() => handleCTAClick("after_transformation")} />
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 5: HOW IT WORKS (Mechanism)
          ============================================ */}
      <section className="py-24 px-4 section-white relative" data-testid="solution-section">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-blue-100 text-[#589DFD] rounded-full text-sm font-bold mb-4">HOW IT WORKS</span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              <span className="blue-gradient-text">VisiFinder™</span>
            </h2>
            <p className="text-xl text-gray-700 font-medium mb-2">Your Invisible Traffic, Finally Visible</p>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Works for B2B, B2C, eCommerce, DTC—anyone driving traffic who wants to know who's actually visiting.
            </p>
          </motion.div>
          
          <motion.div {...staggerContainer} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { icon: Eye, title: "Identify Visitors", desc: "See who's on your site—even if they never fill out a form", color: "blue" },
              { icon: BarChart3, title: "Track Behavior", desc: "Know what pages they view and how engaged they are", color: "gold" },
              { icon: Target, title: "Spot Intent", desc: "Identify buyers ready to purchase vs. casual browsers", color: "blue" },
              { icon: Users, title: "Sync & Act", desc: "Push insights to your CRM, ads, or sales team instantly", color: "gold" }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="floating-card p-8 text-center group"
              >
                <div className={`icon-badge icon-badge-${item.color} mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all`}>
                  <item.icon className="w-7 h-7 text-white relative z-10" />
                </div>
                <h3 className="text-xl font-bold text-[#0a0a0a] mb-2">{item.title}</h3>
                <p className="text-gray-500">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Trust badges */}
          <motion.div {...fadeInUp} className="flex flex-wrap justify-center gap-6 mt-12">
            {[
              { icon: ShieldCheck, text: "Privacy Compliant" },
              { icon: Zap, text: "15-Min Setup" },
              { icon: Clock, text: "Real-Time Data" }
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-2 text-gray-600">
                <badge.icon className="w-5 h-5 text-[#589DFD]" />
                <span className="font-medium">{badge.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================================
          SECTION 6: OFFER + PROOF (7-Day Reveal)
          ============================================ */}
      <section className="py-24 px-4 section-gray relative" data-testid="reveal-section">
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-[#589DFD] to-[#EAA73F] text-white rounded-full text-sm font-bold mb-4">RISK-FREE OFFER</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0a0a0a] mb-4">
              Don't Take Our Word For It.
              <span className="block blue-gradient-text">See It For Yourself—Free.</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">We'll reveal who's been visiting your site for 7 days. If you don't see value, you pay nothing.</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              { step: "1", title: "Quick Install", desc: "15 minutes. Simple script. No developers needed.", color: "blue" },
              { step: "2", title: "7 Days of Data", desc: "We monitor and identify your anonymous visitors.", color: "gold" },
              { step: "3", title: "Reveal Call", desc: "We show you exactly who's been visiting. You decide next steps.", color: "blue" }
            ].map((item, index) => (
              <motion.div
                key={index}
                className={`floating-card floating-card-${item.color} p-10 text-center`}
                initial={{ opacity: 0, y: 40, rotateY: -10 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
              >
                <div className={`icon-badge icon-badge-${item.color} w-20 h-20 rounded-full mx-auto mb-8 text-3xl font-black text-white flex items-center justify-center`}>
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold text-[#0a0a0a] mb-4">{item.title}</h3>
                <p className="text-gray-600 text-lg">{item.desc}</p>
              </motion.div>
            ))}
          </div>
          
          {/* Risk reversal */}
          <motion.div {...fadeInUp} className="floating-card p-10 text-center bg-gradient-to-r from-[#0a0a0a] to-[#1a1a1a] border-none">
            <p className="text-gray-300 text-xl mb-3">No credit card required. No contracts. No risk.</p>
            <p className="text-white text-3xl font-bold mb-8">If we don't deliver value, you pay nothing.</p>
            <CTAButton text="Start Your Free 7-Day Reveal" onClick={() => handleCTAClick("risk_reversal")} variant="gold" />
          </motion.div>
        </div>
      </section>

      {/* ============================================
          SECTION 7: WHO THIS IS FOR (Expanded ICP)
          ============================================ */}
      <section className="py-24 px-4 section-white" data-testid="qualification-section">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeInUp}>
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 bg-blue-100 text-[#589DFD] rounded-full text-sm font-bold mb-4">WHO THIS IS FOR</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#0a0a0a] mb-4">
                VisiFinder Works For <span className="blue-gradient-text">Anyone Driving Traffic</span>
              </h2>
              <p className="text-lg text-gray-600">B2B, B2C, eCommerce, DTC—if you're investing in traffic, you deserve to know who's showing up.</p>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6 mb-10">
              {[
                "Running ads, SEO, or paid campaigns",
                "Getting traffic but not enough conversions",
                "Frustrated that most visitors leave anonymous",
                "Want to follow up with interested buyers",
                "Selling products or services online",
                "Ready to turn invisible visitors into revenue"
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="floating-card floating-card-blue p-6 flex items-center gap-5"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                >
                  <div className="icon-badge icon-badge-blue w-12 h-12 rounded-xl flex-shrink-0">
                    <Check className="w-6 h-6 text-white relative z-10" />
                  </div>
                  <span className="text-gray-700 font-medium text-lg">{item}</span>
                </motion.div>
              ))}
            </div>
            
            <p className="text-center text-gray-600">
              <span className="font-bold text-[#0a0a0a]">Bottom line:</span> If you're paying for traffic and wish you knew who was visiting, this is for you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============================================
          SECTION 8: FAQ - Objection Handling
          ============================================ */}
      <section className="py-24 px-4 section-gray relative" data-testid="faq-section">
        <div className="max-w-3xl mx-auto relative z-10">
          <motion.div {...fadeInUp}>
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 bg-gray-200 text-gray-700 rounded-full text-sm font-bold mb-4">QUESTIONS?</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#0a0a0a]">
                Everything You Need to Know
              </h2>
            </div>
            
            <Accordion type="single" collapsible className="space-y-4">
              {faqItems.map((item, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="floating-card px-8 overflow-hidden border-none"
                  data-testid={`faq-item-${index}`}
                >
                  <AccordionTrigger className="text-lg text-[#0a0a0a] font-semibold py-6 hover:no-underline hover:text-[#589DFD] transition-colors">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 pb-6 text-base leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* ============================================
          SECTION 9: FINAL CTA - Urgency Close
          ============================================ */}
      <section className="py-28 px-4 section-dark relative" data-testid="final-section">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div {...fadeInUp}>
            <span className="inline-block px-4 py-1.5 bg-[#589DFD]/20 text-[#589DFD] rounded-full text-sm font-bold mb-6">DON'T WAIT</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Right Now, Someone Is On Your Website.
              <span className="block blue-gradient-text mt-3">Do You Know Who They Are?</span>
            </h2>
            <p className="text-lg text-gray-400 mb-4">
              Every day you wait, buyers visit your site, evaluate your offer, and leave without a trace.
            </p>
            <p className="text-xl text-gray-300 mb-4">
              Your competitors might already know who they are.
            </p>
            <p className="text-2xl text-white font-bold mb-10">
              It's time <span className="text-[#EAA73F]">you</span> did too.
            </p>
            
            <CTAButton text="Start Your Free 7-Day Reveal Now" onClick={() => handleCTAClick("final_cta")} variant="gold" />
            <p className="text-gray-500 text-sm mt-5">15-minute call. See your visitors. No obligation.</p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 bg-[#050505] border-t border-gray-800">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-2xl font-bold mb-3">
            <span className="text-[#589DFD]">Visi</span><span className="text-[#EAA73F]">Finder</span><span className="text-gray-500">™</span>
          </p>
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} VisiFinder. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
