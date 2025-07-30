// File: src/components/ResourceLinks.tsx
"use client";
import { FC } from "react";
import { trackResourceClick } from "@/lib/gtag";

const links = [
  { href: "/blog", label: "Fasting Blog", icon: "📝" },
  { href: "#", label: "Get Zero App", icon: "📱" },
  { href: "#", label: "Fasting Guide", icon: "📖" },
  { href: "#", label: "Meal Plans", icon: "🥗" },
  { href: "#", label: "Supplements", icon: "💊" }
];

const ResourceLinks: FC = () => (
  <section className="py-8 px-4 bg-blue-900 text-white">
    <h2 className="text-xl font-semibold text-center mb-4">Helpful Resources</h2>
    <div className="flex flex-wrap justify-center gap-4">
      {links.map((l, i) => (
        <a 
          key={i} 
          href={l.href} 
          className="border border-yellow-400 rounded-lg px-6 py-3 flex items-center space-x-2 hover:bg-yellow-400 hover:text-black transition min-h-[44px]"
          onClick={() => trackResourceClick(l.label, l.href)}
        >
          <span>{l.icon}</span><span>{l.label}</span>
        </a>
      ))}
    </div>
  </section>
);

export default ResourceLinks;
