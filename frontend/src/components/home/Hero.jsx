import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-12 md:py-24">
      <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-blush/60 blur-3xl dark:bg-rose/10" />
      <div className="absolute -right-10 bottom-0 h-72 w-72 rounded-full bg-lavender/60 blur-3xl dark:bg-purple-900/20" />
      <div className="relative grid items-center gap-10 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-flex items-center gap-2 rounded-full bg-blush/80 px-4 py-1.5 text-sm font-semibold text-rose-dark dark:bg-gray-800 dark:text-rose">
            <Sparkles className="h-4 w-4" /> Personalized memory pages
          </span>
          <h1 className="mt-6 font-display text-4xl font-bold leading-tight text-gray-800 dark:text-white md:text-5xl lg:text-6xl">
            Turn Your Memories Into Beautiful Digital Stories{' '}
            <span className="inline-block animate-float">✨</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
            Upload your photos, pick a dreamy theme, and we&apos;ll craft a scrapbook-style memory page
            you&apos;ll treasure forever.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/products" className="btn-primary">
              Start Designing <ArrowRight className="h-5 w-5" />
            </Link>
            <Link to="/signup" className="btn-secondary">
              Create Account
            </Link>
            <a href="#features" className="text-sm font-semibold text-rose self-center hover:underline">
              See all features →
            </a>
          </div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            🎂 Pick an occasion theme or create your own — colors update live on the design page
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative hidden md:block"
        >
          <div className="card-polaroid absolute left-8 top-0 z-10 w-48 animate-float">
            <img src="https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=300" alt="" className="aspect-square object-cover" />
          </div>
          <div className="card-polaroid absolute right-4 top-16 z-20 w-56 rotate-3">
            <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300" alt="" className="aspect-square object-cover" />
          </div>
          <div className="card-polaroid relative mx-auto mt-24 w-64 -rotate-2">
            <img src="https://images.unsplash.com/photo-1518199266791-5375a57590ae?w=400" alt="" className="aspect-[4/5] object-cover" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
