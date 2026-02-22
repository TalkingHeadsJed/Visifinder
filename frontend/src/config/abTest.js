// A/B Testing Configuration for VisiFinder VSL
// Easy to modify headlines and track which variant converts better

export const AB_TEST_CONFIG = {
  // Test name for tracking
  testName: "headline_test_v1",
  
  // Variant A - Control
  variantA: {
    id: "A",
    badge: "Finally See Who's Visiting Your Website",
    headline: {
      line1: "97% of Your Website Visitors",
      line2: "Leave Without a Trace",
      line3: "And You Have No Idea Who They Were."
    },
    subtext: {
      main: "You're spending <strong>real money</strong> driving traffic—ads, SEO, social, email. People click. They browse. They leave. And you're left wondering:",
      pain: "Who were they? Why didn't they buy? Could I have followed up?",
      hook: "What if you could finally know?"
    }
  },
  
  // Variant B - Challenger
  variantB: {
    id: "B",
    badge: "Stop Losing Anonymous Visitors",
    headline: {
      line1: "You're Paying for Traffic",
      line2: "That Disappears Forever",
      line3: "What If You Could See Your Visitors?"
    },
    subtext: {
      main: "Every day, potential customers visit your website. They browse your products, check your pricing, read your content. Then they vanish—",
      pain: "no name, no email, no way to follow up.",
      hook: "VisiFinder reveals who they are."
    }
  },
  
  // Traffic split (0.5 = 50/50 split)
  splitRatio: 0.5
};

// Get or assign variant for current user
export const getVariant = () => {
  const storageKey = `ab_test_${AB_TEST_CONFIG.testName}`;
  
  // Check if user already has assigned variant
  let variant = localStorage.getItem(storageKey);
  
  if (!variant) {
    // Randomly assign variant based on split ratio
    variant = Math.random() < AB_TEST_CONFIG.splitRatio ? "A" : "B";
    localStorage.setItem(storageKey, variant);
    
    // Log variant assignment (could send to analytics)
    console.log(`[A/B Test] Assigned variant: ${variant}`);
  }
  
  return variant;
};

// Get the content for current variant
export const getVariantContent = () => {
  const variant = getVariant();
  return variant === "A" ? AB_TEST_CONFIG.variantA : AB_TEST_CONFIG.variantB;
};

// Track CTA click with variant info (for analytics)
export const trackCTAClick = (ctaName) => {
  const variant = getVariant();
  const trackingData = {
    testName: AB_TEST_CONFIG.testName,
    variant,
    ctaName,
    timestamp: new Date().toISOString(),
    url: window.location.href
  };
  
  // Log to console (replace with actual analytics call)
  console.log(`[A/B Test] CTA Click:`, trackingData);
  
  // Store locally for simple tracking
  const clicksKey = `ab_clicks_${AB_TEST_CONFIG.testName}`;
  const existingClicks = JSON.parse(localStorage.getItem(clicksKey) || "[]");
  existingClicks.push(trackingData);
  localStorage.setItem(clicksKey, JSON.stringify(existingClicks));
  
  return trackingData;
};

// Get simple stats (for debugging/demo)
export const getTestStats = () => {
  const clicksKey = `ab_clicks_${AB_TEST_CONFIG.testName}`;
  const clicks = JSON.parse(localStorage.getItem(clicksKey) || "[]");
  
  const stats = {
    totalClicks: clicks.length,
    variantA: clicks.filter(c => c.variant === "A").length,
    variantB: clicks.filter(c => c.variant === "B").length
  };
  
  return stats;
};

// Force a specific variant (for testing)
export const forceVariant = (variant) => {
  const storageKey = `ab_test_${AB_TEST_CONFIG.testName}`;
  localStorage.setItem(storageKey, variant);
  window.location.reload();
};

// Reset test (clear variant assignment)
export const resetTest = () => {
  const storageKey = `ab_test_${AB_TEST_CONFIG.testName}`;
  const clicksKey = `ab_clicks_${AB_TEST_CONFIG.testName}`;
  localStorage.removeItem(storageKey);
  localStorage.removeItem(clicksKey);
  window.location.reload();
};
