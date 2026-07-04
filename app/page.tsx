"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Activity, Network, ShieldAlert } from "lucide-react";
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
          
          {/* Removed AI Label */}

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
          <div className="p-8 rounded-3xl bg-card border border-border backdrop-blur-sm">
            <h3 className="text-2xl font-semibold text-card-foreground mb-3">Instant Ingestion</h3>
            <p className="text-muted-foreground leading-relaxed">
              Process thousands of unstructured claim narratives and medical records instantly. Extract entities automatically without manual data entry.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-8 rounded-3xl bg-card border border-border backdrop-blur-sm">
            <h3 className="text-2xl font-semibold text-card-foreground mb-3">Network Mapping</h3>
            <p className="text-muted-foreground leading-relaxed">
              Map the hidden relationships between attorneys, clinics, and claimants across all historical cases to find organized rings.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-8 rounded-3xl bg-card border border-border backdrop-blur-sm">
            <h3 className="text-2xl font-semibold text-card-foreground mb-3">Pattern Discovery</h3>
            <p className="text-muted-foreground leading-relaxed">
              Analyze claims across the entire network topology to expose organized syndicates and duplicate billing schemes before they strike again.
            </p>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
