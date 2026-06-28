import React from 'react';
import { Cpu, Factory, Users, CheckSquare, Zap, MapPin, Building, Activity } from 'lucide-react';
import { STATS, MANUFACTURING_UNITS } from '../data';

export default function InfrastructureSection() {
  return (
    <section id="infrastructure" className="py-24 bg-tiger-dark text-white relative overflow-hidden">
      
      {/* Visual background accents */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-tiger-orange/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title details */}
        <div id="infra-heading" className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full mb-4">
            <Factory className="w-4 h-4 text-tiger-orange" />
            <span className="text-xs font-mono font-bold tracking-widest text-[#f57416] uppercase">Heavy Infrastructure</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight leading-tight">
            High-Volume Production, Controlled Quality
          </h2>
          <p className="text-gray-400 mt-4 text-base sm:text-lg">
            Engineering robust bulk apparel with precision mechanical systems and certified safety standards over our diverse Kolkata units.
          </p>
          <div className="w-16 h-1.5 bg-tiger-orange mx-auto mt-6 rounded-full" />
        </div>

        {/* Stats Grid Counters */}
        <div id="infra-stats-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-20 md:mb-24">
          {STATS.map((stat, i) => {
            const icons = [
              <Zap className="w-6 h-6 text-tiger-orange" key="zap" />,
              <Cpu className="w-6 h-6 text-tiger-orange" key="cpu" />,
              <Users className="w-6 h-6 text-tiger-orange" key="users" />,
              <CheckSquare className="w-6 h-6 text-tiger-orange" key="check" />
            ];

            return (
              <div
                id={`stat-card-${i}`}
                key={i}
                className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-2xl flex flex-col justify-between hover:bg-white/10 hover:border-tiger-orange/30 transition-all duration-300 group"
              >
                <div className="bg-white/5 p-3 rounded-lg w-fit mb-6 group-hover:scale-105 transition-transform">
                  {icons[i % icons.length]}
                </div>
                <div>
                  <span className="block font-display font-bold text-4xl sm:text-5xl text-white tracking-tight leading-none mb-2">
                    {stat.value}
                  </span>
                  <span className="block text-sm font-semibold tracking-wider uppercase text-tiger-orange mb-3">
                    {stat.label}
                  </span>
                  <p className="text-gray-400 text-xs sm:text-sm leading-relaxed border-t border-white/5 pt-3">
                    {stat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Facility Locations List & Machinary Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-12">
          
          {/* Left: Manufacturing Facility locations */}
          <div id="infra-facility-cards" className="lg:col-span-7 space-y-6">
            <h3 className="font-display font-semibold text-xl sm:text-2xl text-white mb-6 flex items-center space-x-2">
              <Building className="w-5 h-5 text-tiger-orange shrink-0" />
              <span>Operational Manufacturing Hubs & Headquarters</span>
            </h3>

            <div className="space-y-4">
              {MANUFACTURING_UNITS.map((unit, i) => (
                <div
                  id={`facility-row-${i}`}
                  key={i}
                  className="bg-white/5 border border-white/5 hover:border-white/10 p-5 rounded-xl flex items-start space-x-4 transition-colors"
                >
                  <div className="bg-tiger-orange/15 border border-tiger-orange/30 text-tiger-orange p-3 rounded-xl shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-tiger-orange uppercase tracking-wider font-bold">
                      {unit.type}
                    </span>
                    <h4 className="font-display font-bold text-white text-base sm:text-lg">
                      {unit.name}
                    </h4>
                    <p className="text-gray-400 text-xs sm:text-sm">
                      {unit.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Machinery and HR capabilities card */}
          <div id="infra-machinery-card" className="lg:col-span-5 bg-white/5 border border-white/10 p-6 sm:p-8 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-tiger-orange/15 rounded-full blur-2xl pointer-events-none" />
            
            <h3 className="font-display font-semibold text-xl text-white mb-4 flex items-center space-x-2">
              <Activity className="w-5 h-5 text-tiger-orange" />
              <span>High-Speed Machinery Specifications</span>
            </h3>

            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              To output over 1 Lakh pieces with 100% QA checks, we integrated advanced single-needle lockstitch, heavy-duty overlock, and flatlock operations.
            </p>

            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-tiger-orange mt-2 shrink-0" />
                <div>
                  <strong className="text-white block font-medium">JUKI High-Speed Lockstitch</strong>
                  <span className="text-gray-400 text-xs">Japanese engineering offering high flat seam integrity at 5000 stitches per min.</span>
                </div>
              </li>
              <li className="flex items-start space-x-3 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-tiger-orange mt-2 shrink-0" />
                <div>
                  <strong className="text-white block font-medium">SIRUBA 4/5 Thread Overlockers</strong>
                  <span className="text-gray-400 text-xs">Essential for stretchable cotton knitwear, ensuring robust side side-closures that never rip.</span>
                </div>
              </li>
              <li className="flex items-start space-x-3 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-tiger-orange mt-2 shrink-0" />
                <div>
                  <strong className="text-white block font-medium">BROTHER flatlock & specialized folder machines</strong>
                  <span className="text-gray-400 text-xs">Required for clean hem finishes on girl dresses and toddler baba play suits.</span>
                </div>
              </li>
            </ul>

            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-xs text-gray-400 font-mono">
              <span>WORKFORCE: 50-60 EXPERTS</span>
              <span className="text-tiger-orange">ORGANIZED & ETHICAL UNIT</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
