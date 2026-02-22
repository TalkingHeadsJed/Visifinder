import { motion, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { ArrowRight, ChevronDown, TrendingDown, DollarSign, Users, Eye, Target, BarChart3, Check, X } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";

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

// CTA Button with gold styling
const CTAButton = ({ text, onClick, variant = "gold", className = "", size = "lg" }) => {
  const sizeClasses = {
    lg: "px-8 py-4 text-lg",
    md: "px-6 py-3 text-base"
  };
  const variants = {
    gold: "cta-gold text-white font-bold rounded-lg",
    dark: "bg-[#0a0a0a] hover:bg-[#1a1a1a] text-white font-bold rounded-lg",
    outline: "border-2 border-[#EAA73F] text-[#EAA73F] hover:bg-[#EAA73F] hover:text-white font-bold rounded-lg transition-all"
  };

  return (
    <motion.button
      data-testid={`cta-${text.toLowerCase().replace(/\s+/g, '-')}`}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 ${sizeClasses[size]} ${variants[variant]} ${className}`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      {text}
      <ArrowRight className="w-5 h-5" />
    </motion.button>
  );
};

// Pain Bar Graph Component
const PainBarGraph = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  return (
    <div ref={ref} className="relative h-64 flex items-end justify-center gap-8">
      {/* Money In Bar */}
      <div className="flex flex-col items-center">
        <motion.div 
          className="w-20 sm:w-28 bg-gradient-to-t from-[#EAA73F] to-[#F5C063] rounded-t-lg"
          initial={{ height: 0 }}
          animate={isInView ? { height: 200 } : { height: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        />
        <p className="mt-3 text-sm font-semibold text-gray-700">Traffic Spend</p>
        <p className="text-xs text-gray-500">100%</p>
      </div>
      
      {/* Arrow */}
      <div className="flex flex-col items-center justify-center h-full">
        <TrendingDown className="w-10 h-10 text-red-500" />
      </div>
      
      {/* Leads Out Bar */}
      <div className="flex flex-col items-center">
        <motion.div 
          className="w-20 sm:w-28 bg-gradient-to-t from-red-600 to-red-400 rounded-t-lg"
          initial={{ height: 0 }}
          animate={isInView ? { height: 12 } : { height: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        />
        <p className="mt-3 text-sm font-semibold text-gray-700">Leads You See</p>
        <p className="text-xs text-red-500 font-bold">Only 3%</p>
      </div>
    </div>
  );
};

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7 }
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
      
      {/* HERO - Strong Hook */}
      <section className="relative min-h-screen flex items-center justify-center py-16 px-4 overflow-hidden" data-testid="hero-section">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23EAA73F' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
        
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Product badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-blue-50 border border-[#589DFD] text-[#589DFD] px-4 py-2 rounded-full mb-6 text-sm font-bold"
          >
            <Eye className="w-4 h-4" />
            <span>Introducing VisiFinder™</span>
          </motion.div>
          
          {/* STRONG HOOK - Turn the knife */}
          <motion.h1 
            className="text-4xl sm:text-5xl lg:text-7xl font-black text-[#0a0a0a] mb-6 leading-[1.1]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="gradient-text">97% of Your Website Visitors</span>
            <br />
            <span className="text-[#0a0a0a]">Are Walking Out the Door</span>
            <br />
            <span className="text-red-600 relative inline-block">
              And You Don't Even Know Who They Are.
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            You're spending <span className="font-bold text-[#0a0a0a]">real money</span> on SEO, PPC, and ads. 
            A CFO visits your pricing page. A VP reads three case studies. 
            Then they leave. <span className="text-red-600 font-bold">Invisible. Gone. Taking your revenue with them.</span>
            <span className="block mt-2 text-[#589DFD] font-semibold">VisiFinder changes that.</span>
          </motion.p>
          
          {/* Vimeo Video */}
          <motion.div 
            className="vimeo-wrapper mb-8 max-w-3xl mx-auto"
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
            <CTAButton text="Stop the Bleeding — Book Your Reveal Call" onClick={handleCTAClick} />
            <p className="text-gray-500 text-sm">15-minute call. See who's been visiting. No obligation.</p>
          </motion.div>
        </div>
        
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 12, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown className="w-8 h-8 text-[#EAA73F]" />
        </motion.div>
      </section>

      {/* THE PAIN - Visual Graph Section */}
      <section className="py-20 px-4 section-gray" data-testid="pain-section">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <p className="text-[#589DFD] font-bold mb-3 tracking-wide uppercase text-sm">The Problem</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0a0a0a] mb-4">
              Here's What's <span className="text-red-600">Really</span> Happening
            </h2>
            <p className="text-lg text-gray-600">Every dollar you spend on traffic, this is what you actually see:</p>
          </motion.div>
          
          {/* Pain Bar Graph */}
          <motion.div {...fadeInUp} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-12">
            <PainBarGraph />
            <p className="text-center text-gray-500 mt-6 text-sm">
              You're paying for 100% of your traffic. You're only seeing 3% convert.
              <span className="block text-red-600 font-bold mt-2">The other 97%? Gone. Forever.</span>
            </p>
          </motion.div>
          
          {/* Pain Points Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Users, title: "Anonymous Visitors", stat: "97%", desc: "Leave without filling out a form" },
              { icon: DollarSign, title: "Wasted Ad Spend", stat: "$$$", desc: "Paying for traffic you can't follow up with" },
              { icon: TrendingDown, title: "Lost Revenue", stat: "∞", desc: "Every invisible visitor is a missed opportunity" }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-6 border border-gray-200 text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-red-500" />
                </div>
                <p className="text-3xl font-black text-red-600 mb-2">{item.stat}</p>
                <h3 className="text-lg font-bold text-[#0a0a0a] mb-1">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BIG STAT - 97% */}
      <section className="py-24 px-4 bg-[#0a0a0a] relative overflow-hidden" data-testid="stat-section">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-[#EAA73F] rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-[#589DFD] rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div {...fadeInUp}>
            <span className="stat-counter text-[100px] sm:text-[150px] lg:text-[200px] gradient-text">
              <AnimatedCounter target={97} duration={2500} suffix="%" />
            </span>
            <p className="text-xl sm:text-2xl text-gray-300 max-w-xl mx-auto mt-4">
              of your website visitors leave without identifying themselves.
            </p>
            <p className="text-lg text-[#589DFD] font-semibold mt-4">
              That's not a conversion problem. That's a <span className="underline">visibility</span> problem.
            </p>
            <p className="text-xl text-white font-bold mt-2">
              VisiFinder™ solves it.
            </p>
          </motion.div>
        </div>
      </section>

      {/* THE SHIFT - What If? */}
      <section className="py-20 px-4 section-gold-gradient" data-testid="shift-section">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <p className="text-[#589DFD] font-bold mb-3 tracking-wide uppercase text-sm">The Shift</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0a0a0a] mb-4">
              What If You Could <span className="blue-gradient-text">Finally See</span> Who's Visiting?
            </h2>
            <p className="text-lg text-gray-600">Imagine opening your <span className="font-bold text-[#589DFD]">VisiFinder</span> dashboard and knowing:</p>
          </motion.div>
          
          {/* Before/After Comparison */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Before - Frustration */}
            <motion.div 
              {...fadeInUp}
              className="bg-white rounded-2xl p-8 border-2 border-red-200 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <X className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-[#0a0a0a]">Without Visibility</h3>
              </div>
              <ul className="space-y-4">
                {[
                  "Anonymous visitors leave with no trace",
                  "Guessing who might be interested",
                  "Wasting money on traffic you can't see",
                  "Competitors steal your leads"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-600">
                    <X className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <img 
                src="https://images.pexels.com/photos/5717791/pexels-photo-5717791.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                alt="Frustrated business person"
                className="w-full h-40 object-cover rounded-lg mt-6 opacity-80"
              />
            </motion.div>
            
            {/* After - Success */}
            <motion.div 
              {...fadeInUp}
              className="bg-white rounded-2xl p-8 border-2 border-[#589DFD] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-[#589DFD]" />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-[#589DFD]" />
                </div>
                <h3 className="text-xl font-bold text-[#0a0a0a]">With <span className="text-[#589DFD]">VisiFinder™</span></h3>
              </div>
              <ul className="space-y-4">
                {[
                  "See exactly who visits your website",
                  "Know which pages they viewed",
                  "Identify repeat visitors & buying signals",
                  "Follow up before competitors do"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-700">
                    <Check className="w-5 h-5 text-[#589DFD] mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MDZ8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGRhc2hib2FyZCUyMGFuYWx5dGljcyUyMGRhdGElMjBpbnNpZ2h0cyUyMHN1Y2Nlc3N8ZW58MHx8fHwxNzcxNzUwNjIxfDA&ixlib=rb-4.1.0&q=85"
                alt="Analytics dashboard showing insights"
                className="w-full h-40 object-cover rounded-lg mt-6"
              />
            </motion.div>
          </div>
          
          <div className="text-center">
            <CTAButton text="See Who's Visiting Your Site" onClick={handleCTAClick} />
          </div>
        </div>
      </section>

      {/* THE SOLUTION */}
      <section className="py-20 px-4 section-white" data-testid="solution-section">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <p className="text-[#589DFD] font-bold mb-3 tracking-wide uppercase text-sm">The Solution</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0a0a0a] mb-4">
              <span className="blue-gradient-text">VisiFinder™</span>
            </h2>
            <p className="text-xl text-gray-700 font-medium mb-2">The Anonymous Buyer Reveal System</p>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              X-Ray vision for your website. Know who's visiting before they fill out a form.
            </p>
          </motion.div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Eye, title: "Detect Visitors", desc: "Company-level identification", color: "from-[#589DFD] to-[#7BB5FF]" },
              { icon: BarChart3, title: "Track Behavior", desc: "See which pages they visit", color: "from-[#EAA73F] to-[#F5C063]" },
              { icon: Target, title: "Identify Intent", desc: "Spot buying signals", color: "from-[#589DFD] to-[#7BB5FF]" },
              { icon: Users, title: "CRM Integration", desc: "Sync insights instantly", color: "from-[#EAA73F] to-[#F5C063]" }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="premium-card rounded-xl p-6 text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-[#0a0a0a] mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7-DAY REVEAL */}
      <section className="py-20 px-4 section-gray" data-testid="reveal-section">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <p className="text-[#589DFD] font-bold mb-3 tracking-wide uppercase text-sm">7-Day VisiFinder Reveal</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0a0a0a] mb-4">
              Don't Take Our Word For It.
              <span className="block blue-gradient-text">Let Us Prove It.</span>
            </h2>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { step: "1", title: "Install VisiFinder", desc: "15-minute setup. No dev work needed.", color: "from-[#589DFD] to-[#7BB5FF]" },
              { step: "2", title: "Monitor Traffic", desc: "7 days of real visitor data.", color: "from-[#EAA73F] to-[#F5C063]" },
              { step: "3", title: "Reveal Buyers", desc: "See exactly who's been shopping you.", color: "from-[#589DFD] to-[#7BB5FF]" }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-lg hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center mx-auto mb-6 text-white font-black text-2xl`}>
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold text-[#0a0a0a] mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
          
          <motion.div {...fadeInUp} className="bg-[#0a0a0a] rounded-2xl p-8 text-center">
            <p className="text-gray-300 text-lg mb-2">If we don't reveal valuable prospects…</p>
            <p className="text-white text-2xl font-bold mb-6">You don't pay. Simple as that.</p>
            <CTAButton text="Book Your 7-Day Reveal" onClick={handleCTAClick} variant="gold" />
          </motion.div>
        </div>
      </section>

      {/* WHO IS THIS FOR */}
      <section className="py-20 px-4 section-white" data-testid="qualification-section">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeInUp}>
            <p className="text-[#589DFD] font-bold mb-3 tracking-wide uppercase text-sm text-center">Who VisiFinder Is For</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0a0a0a] mb-8 text-center">
              This Is For <span className="blue-gradient-text">Serious</span> B2B Companies
            </h2>
            
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {[
                "Investing in SEO, PPC, or paid traffic",
                "3,000+ monthly website visitors",
                "Selling high-ticket products/services",
                "Have a sales team ready to follow up"
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-4 bg-gradient-to-r from-blue-50 to-white p-5 rounded-xl border border-blue-100"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="w-8 h-8 bg-[#589DFD] rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">{item}</span>
                </motion.div>
              ))}
            </div>
            
            <p className="text-center text-gray-600">
              <span className="font-bold text-[#0a0a0a]">Not for you?</span> If you get under 100 visitors/month or sell low-ticket items, this won't move the needle.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 section-gray" data-testid="faq-section">
        <div className="max-w-2xl mx-auto">
          <motion.div {...fadeInUp}>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0a0a0a] mb-10 text-center">
              Questions? We've Got Answers.
            </h2>
            
            <Accordion type="single" collapsible className="space-y-3">
              {faqItems.map((item, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="bg-white rounded-xl border border-gray-200 px-6 overflow-hidden shadow-sm"
                  data-testid={`faq-item-${index}`}
                >
                  <AccordionTrigger className="text-lg text-[#0a0a0a] font-semibold py-5 hover:no-underline hover:text-[#EAA73F] transition-colors">
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

      {/* FINAL CTA - Dark with blue and gold accents */}
      <section className="py-24 px-4 section-dark relative overflow-hidden" data-testid="final-section">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#589DFD] rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#EAA73F] rounded-full blur-[100px]" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div {...fadeInUp}>
            <p className="text-[#589DFD] font-bold mb-4 tracking-wide uppercase text-sm">Start Using VisiFinder Today</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Every Day You Wait,
              <span className="block blue-gradient-text mt-2">More Buyers Slip Through Your Fingers.</span>
            </h2>
            <p className="text-lg text-gray-400 mb-4">
              Right now, someone is on your website. Evaluating you. Comparing you. 
            </p>
            <p className="text-xl text-white font-semibold mb-8">
              <span className="text-[#589DFD]">VisiFinder</span> will tell you who they are.
            </p>
            
            <CTAButton text="Book Your VisiFinder Reveal Call" onClick={handleCTAClick} variant="gold" />
            <p className="text-gray-500 text-sm mt-4">15-minute call. No commitment. Just clarity.</p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-[#050505] border-t border-gray-800">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xl font-bold mb-2">
            <span className="text-[#589DFD]">Visi</span><span className="text-[#EAA73F]">Finder</span><span className="text-gray-400">™</span>
          </p>
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} VisiFinder. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
