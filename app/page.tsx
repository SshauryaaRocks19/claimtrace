"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Activity, Network, ShieldAlert, Database, BrainCircuit, TrendingUp, CheckCircle2, XCircle } from "lucide-react";
import Ferrofluid from "@/components/Ferrofluid";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-x-hidden">
      {/* 
        HERO SECTION (100vh)
        =================== 
      */}
      <section className="relative h-screen w-full flex flex-col items-center justify-center -mt-20">
        
        {/* Ferrofluid Background Layer */}
        <div className="absolute inset-0 z-0 opacity-60 pointer-events-none">
          <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <Ferrofluid
              colors={["#059669", "#3b82f6", "#1f2937"]} // Emerald, Blue, Dark Gray
              speed={0.5}
              scale={1.6}
              turbulence={1}
              fluidity={0.1}
              rimWidth={0.2}
              sharpness={2.5}
              shimmer={1.5}
              glow={2}
              flowDirection="down"
              opacity={1}
              mouseInteraction={true}
              mouseStrength={1}
              mouseRadius={0.35}
            />
          </div>
          {/* Vignette overlay to fade out the edges of the video/webgl */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_20%,_var(--background)_100%)] z-10"></div>
        </div>

        {/* Main Hero Content */}
        <div className="relative z-20 flex-1 flex flex-col items-center justify-center px-6 pt-32 w-full max-w-5xl">
          
          {/* Overlapping Typography */}
          <div className="flex flex-col items-center text-center w-full relative">
            <motion.h1 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              className="text-[12vw] md:text-[8vw] lg:text-9xl font-normal text-muted-foreground leading-none tracking-tighter"
            >
              Uncover.
            </motion.h1>
            <motion.h1 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
              className="text-[12vw] md:text-[8vw] lg:text-9xl font-normal text-foreground leading-none tracking-tighter -mt-[3vw] md:-mt-8 z-10 drop-shadow-2xl"
            >
              The Unseen.
            </motion.h1>
          </div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-base md:text-xl text-muted-foreground mt-8 mb-12 max-w-2xl text-center font-light leading-relaxed px-4"
          >
            Detect organized insurance fraud instantly. Your dedication to truth deserves the ultimate tool.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
          >
            <Link
              href="/network"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-secondary border border-border text-secondary-foreground font-medium hover:bg-secondary/80 transition-all text-center"
            >
              View Topology
            </Link>
            <Link
              href="/queue"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 shadow-[0_0_30px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_40px_hsl(var(--primary)/0.5)] transition-all flex items-center justify-center gap-2"
            >
              Enter Workspace
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
          
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
        >
          <span className="text-xs text-muted-foreground tracking-widest uppercase">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-muted-foreground to-transparent"></div>
        </motion.div>
      </section>

      {/* 
        SCROLL REVEAL SECTION (Eye Candy)
        ================================= 
      */}
      <section className="relative z-20 w-full max-w-7xl mx-auto px-6 py-32 bg-background">
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
        >
          {/* Feature 1 */}
          <div className="p-8 rounded-3xl bg-card border border-border backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-2xl font-semibold text-card-foreground mb-3 flex items-center gap-3">
              <Database className="w-6 h-6 text-primary" />
              Instant Ingestion
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Process thousands of unstructured claim narratives and medical records instantly. Extract entities automatically without manual data entry.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-8 rounded-3xl bg-card border border-border backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-2xl font-semibold text-card-foreground mb-3 flex items-center gap-3">
              <Network className="w-6 h-6 text-primary" />
              Network Mapping
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Map the hidden relationships between attorneys, clinics, and claimants across all historical cases to find organized rings.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-8 rounded-3xl bg-card border border-border backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-2xl font-semibold text-card-foreground mb-3 flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 text-primary" />
              Pattern Discovery
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Analyze claims across the entire network topology to expose organized syndicates and duplicate billing schemes before they strike again.
            </p>
          </div>
        </motion.div>
      </section>

      {/* 
        SECTION 1: HOW CLAIMTRACE THINKS (The Pipeline)
        ================================= 
      */}
      <section className="relative z-20 w-full bg-muted/20 py-32 border-y border-border/50">
         <div className="max-w-7xl mx-auto px-6">
           <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight mb-4">How ClaimTrace Thinks</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">A continuous loop of ingestion, memory recall, and human-in-the-loop learning.</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
             {/* Connecting Line (hidden on mobile) */}
             <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-border z-0"></div>

             {/* Steps */}
             {[
               { icon: Database, title: "1. Ingest", desc: "Process raw narratives into structured entities." },
               { icon: Network, title: "2. Memorize", desc: "Store relationships in the Cognee graph database." },
               { icon: BrainCircuit, title: "3. Recall", desc: "Inject historical context into the LLM on new claims." },
               { icon: TrendingUp, title: "4. Improve", desc: "Adjuster feedback makes the knowledge graph smarter." }
             ].map((step, idx) => (
               <motion.div 
                 key={idx}
                 initial={{ opacity: 0, y: 50 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true, margin: "-50px" }}
                 transition={{ duration: 0.6, delay: idx * 0.15 }}
                 className="relative z-10 flex flex-col items-center text-center"
               >
                 <div className="w-24 h-24 rounded-full bg-card border-2 border-border flex items-center justify-center mb-6 shadow-xl hover:border-primary/50 transition-colors">
                   <step.icon className="w-10 h-10 text-primary" />
                 </div>
                 <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                 <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
               </motion.div>
             ))}
           </div>
         </div>
      </section>

      {/* 
        SECTION 2: THE MEMORY ADVANTAGE (Before & After)
        ================================= 
      */}
      <section className="relative z-20 w-full bg-background py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight mb-4">The Context Advantage</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">See the difference between a stateless rules engine and a graph-vector memory layer.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Stateless Mockup */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-card rounded-3xl border border-border p-8 md:p-12 shadow-sm flex flex-col h-full opacity-60 grayscale hover:grayscale-0 transition-all duration-500"
            >
              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-border/50">
                <div className="p-3 bg-muted rounded-full">
                  <XCircle className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">Stateless Rules Engine</h3>
                  <p className="text-sm text-muted-foreground mt-1">Evaluating claim in isolation</p>
                </div>
              </div>
              <div className="space-y-6 flex-1 flex flex-col justify-center">
                <div className="flex justify-between items-center bg-muted/50 p-6 rounded-xl">
                  <span className="text-muted-foreground font-medium">Risk Score</span>
                  <span className="text-2xl font-bold text-foreground">43 / 100 (Medium)</span>
                </div>
                <div className="p-6 rounded-xl border border-border bg-muted/20 space-y-4">
                  <p className="text-base text-muted-foreground leading-relaxed"><strong className="text-foreground">Entity Check:</strong> No isolated red flags detected for involved entities.</p>
                  <p className="text-base text-muted-foreground leading-relaxed"><strong className="text-foreground">Pattern Match:</strong> Insufficient context to detect multi-claim narrative patterns.</p>
                </div>
              </div>
            </motion.div>

            {/* Cognee Memory Mockup */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-card rounded-3xl border border-primary/30 p-8 md:p-12 shadow-[0_0_50px_hsl(var(--primary)/0.1)] relative overflow-hidden flex flex-col h-full"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 to-primary"></div>
              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-border/50">
                <div className="p-3 bg-primary/10 rounded-full">
                  <BrainCircuit className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">ClaimTrace Memory</h3>
                  <p className="text-sm text-primary mt-1">Evaluating with full historical graph context</p>
                </div>
              </div>
              <div className="space-y-6 flex-1 flex flex-col justify-center">
                <div className="flex justify-between items-center bg-primary/10 p-6 rounded-xl border border-primary/20">
                  <span className="text-muted-foreground font-medium">Risk Score</span>
                  <span className="text-3xl font-bold text-destructive">91 / 100 (Critical)</span>
                </div>
                <div className="p-6 rounded-xl border border-destructive/20 bg-destructive/5 space-y-4">
                  <p className="text-base text-foreground leading-relaxed"><strong className="text-destructive">Entity Alert:</strong> Kaplan & Associates appears in 11 historical claims, 8 confirmed fraud.</p>
                  <p className="text-base text-foreground leading-relaxed"><strong className="text-destructive">Pattern Match:</strong> Narrative structure matches known soft-tissue fraud script.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 
        SECTION 3: CTA & FOOTER
        ================================= 
      */}
      <section className="relative z-20 w-full bg-muted/30 py-32 border-t border-border/50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold text-foreground tracking-tight mb-8"
          >
            Ready to uncover the unseen?
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link
              href="/claims/new"
              className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold hover:bg-primary/90 shadow-lg hover:shadow-[0_0_30px_hsl(var(--primary)/0.4)] transition-all"
            >
              Launch Investigation Demo
            </Link>
            <Link
              href="/queue"
              className="px-8 py-4 rounded-full bg-secondary border border-border text-secondary-foreground font-bold hover:bg-secondary/80 transition-all"
            >
              View Claims Queue
            </Link>
          </motion.div>
        </div>
      </section>

      <footer className="relative z-20 border-t border-border/50 py-12 text-center text-muted-foreground bg-background">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center gap-4">
          <ShieldAlert className="w-8 h-8 opacity-20" />
          <p className="text-sm font-medium">Built for modern Special Investigation Units.</p>
          <p className="text-xs opacity-50">Licensed under Apache 2.0</p>
        </div>
      </footer>
    </div>
  );
}
