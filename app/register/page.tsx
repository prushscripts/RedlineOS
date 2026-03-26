'use client'

import RegisterForm from '@/components/auth/RegisterForm'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(239, 68, 68, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(239, 68, 68, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'gridMove 20s linear infinite'
          }}
        />
      </div>

      <RegisterForm />

      <style jsx>{`
        @keyframes gridMove {
          0% {
            transform: perspective(500px) rotateX(60deg) translateY(0);
          }
          100% {
            transform: perspective(500px) rotateX(60deg) translateY(50px);
          }
        }
      `}</style>
    </div>
  )
}
