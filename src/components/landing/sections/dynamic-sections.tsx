"use client";

import dynamic from "next/dynamic";

const HowItWorksSection = dynamic(() =>
        import("@/components/landing/sections/how-it-works-section").then(m => m.HowItWorksSection),
    {ssr: false}
);
const FeaturesSection = dynamic(() =>
        import("@/components/landing/sections/features-section").then(m => m.FeaturesSection),
    {ssr: false}
);
const BenefitsSection = dynamic(() =>
        import("@/components/landing/sections/benefits-section").then(m => m.BenefitsSection),
    {ssr: false}
);
const PricingSection = dynamic(() =>
        import("@/components/landing/sections/pricing-section").then(m => m.PricingSection),
    {ssr: false}
);
const CtaSection = dynamic(() =>
        import("@/components/landing/sections/cta-section").then(m => m.CtaSection),
    {ssr: false}
);

export const DynamicSections = () => (
    <>
        <HowItWorksSection/>
        <FeaturesSection/>
        <BenefitsSection/>
        <PricingSection/>
        <CtaSection/>
    </>
);