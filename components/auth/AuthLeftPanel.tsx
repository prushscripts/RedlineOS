'use client'

import { motion } from 'framer-motion'
import { Activity, TrendingUp, Truck, Lock } from 'lucide-react'

export default function AuthLeftPanel() {
  return (
    <div className="hidden lg:flex lg:w-[55%] relative px-16 py-12 flex-col justify-between">
      {/* Animated particles */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-0.5 h-0.5 bg-accent rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            opacity: 0.15 + Math.random() * 0.15,
          }}
          animate={{
            y: [Math.random() * 100, -100],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'linear',
          }}
        />
      ))}

      {/* Logo */}
      <div className="flex items-center gap-3">
        <Activity className="text-accent" size={24} strokeWidth={2.5} />
        <h1 className="text-sm font-display font-bold text-white">
          RedlineOS
        </h1>
      </div>

      {/* Center content */}
      <div className="flex-1 flex flex-col justify-center max-w-lg">
        <p className="text-xs text-accent tracking-[0.3em] mb-6 font-medium">
          OPERATOR COMMAND CENTER
        </p>
        
        <h2 className="font-display font-bold text-6xl leading-tight mb-2">
          <span className="text-white">Road to</span>
          <br />
          <span 
            className="text-accent"
            style={{ textShadow: '0 0 40px rgba(239,68,68,0.4)' }}
          >
            $1,000,000
          </span>
        </h2>

        <div className="w-16 h-px bg-accent my-6" />

        <p className="text-sm text-slate-400 max-w-sm mb-8">
          Track every dollar. Every mile. Every step of the journey.
        </p>

        {/* Features */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <TrendingUp size={16} className="text-accent" />
            <div>
              <span className="text-sm font-medium text-white">Live Profit Tracking</span>
              <span className="text-xs text-slate-500 ml-2">· Real-time financial visibility</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Truck size={16} className="text-accent" />
            <div>
              <span className="text-sm font-medium text-white">Fleet Command</span>
              <span className="text-xs text-slate-500 ml-2">· Monitor your trucks and drivers</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Lock size={16} className="text-accent" />
            <div>
              <span className="text-sm font-medium text-white">Private Vault</span>
              <span className="text-xs text-slate-500 ml-2">· Encrypted document storage</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="text-xs text-slate-600">
        v1.0 · redlineos.space
      </div>

      {/* Animated sweep line */}
      <motion.div
        className="absolute bottom-0 left-0 h-px bg-accent"
        style={{ opacity: 0.3 }}
        animate={{
          width: ['0%', '100%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  )
}
