import type { Metadata } from "next";
import React from "react";
import { PackagesSection } from "@/components/packages/PackagesSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Membership Packages & Pricing",
  description:
    "Compare Flipss.id streaming plans — Mobile, Basic, Standard, and Ultra. Flexible monthly or yearly billing with zero ads.",
  path: "/packages",
});

const FAQS = [
  {
    q: "What is Flipss.id?",
    a: "Flipss.id is a modern streaming platform offering award-winning Indonesian Originals, international blockbusters, and 1080p Full HD series with zero ads.",
  },
  {
    q: "Can I upgrade or cancel my package anytime?",
    a: "Yes. You can switch between Mobile, Basic, Standard, and Ultra or cancel your subscription at any time with no cancellation fees.",
  },
  {
    q: "How many devices can stream at the same time?",
    a: "Depending on your plan, you can stream on 1 device (Mobile/Basic), 2 devices simultaneously (Standard), or up to 4 devices in 1080p Full HD (Ultra).",
  },
  {
    q: "Does Flipss.id support offline downloads?",
    a: "Yes! Every Flipss.id package includes offline downloads so you can watch movies and episodes on flights or commutes.",
  },
];

export default function PackagesPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <div className="pt-24 pb-16">
      <JsonLd data={faqSchema} />
      {/* Ambient top glow */}
      <div className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-[640px] rounded-full bg-[#E50914]/20 blur-[140px]"
        />
        <PackagesSection asH1 />
      </div>

      {/* Native <details> FAQ Accordion */}
      <section
        id="faq"
        aria-labelledby="faq-heading"
        className="mx-auto max-w-3xl px-4 sm:px-8 pt-16 space-y-6"
      >
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#E50914]">
            Questions &amp; Answers
          </span>
          <h2 id="faq-heading" className="text-2xl sm:text-3xl font-black text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((item) => (
            <details
              key={item.q}
              className="group rounded-xl bg-[#141414] border border-white/10 open:border-[#E50914]/50 transition-colors"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between p-5 font-semibold text-white">
                <span>{item.q}</span>
                <span className="ml-4 text-[#E50914] text-xl font-bold transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <div className="px-5 pb-5 text-sm leading-relaxed text-neutral-400">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
