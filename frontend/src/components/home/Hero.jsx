import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-6 md:py-24">
      {/* Background Blobs */}
      <div className="absolute -left-10 top-5 h-40 w-40 rounded-full bg-blush/60 blur-3xl dark:bg-rose/10 md:-left-20 md:top-10 md:h-64 md:w-64" />
      <div className="absolute -right-5 bottom-0 h-48 w-48 rounded-full bg-lavender/60 blur-3xl dark:bg-purple-900/20 md:-right-10 md:h-72 md:w-72" />

      {/* Grid - Mobile pe bhi 2 columns */}
      <div className="relative grid grid-cols-2 items-center gap-3 px-3 md:gap-10 md:px-0">

        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="col-span-1"
        >
          <span className="inline-flex items-center gap-1 rounded-full bg-blush/80 px-2 py-1 text-xs font-semibold text-rose-dark dark:bg-gray-800 dark:text-rose md:gap-2 md:px-4 md:py-1.5 md:text-sm">
            <Sparkles className="h-3 w-3 md:h-4 md:w-4" /> Personalized memory pages
          </span>

          <h1 className="mt-3 font-display text-base font-bold leading-tight text-gray-800 dark:text-white md:mt-6 md:text-5xl lg:text-6xl">
            Turn Your Memories Into Beautiful Digital Stories{' '}
            <span className="inline-block animate-float">✨</span>
          </h1>

          <p className="mt-2 text-xs leading-tight text-gray-600 dark:text-gray-300 md:mt-6 md:text-lg">
            Upload your photos, pick a dreamy theme, and we&apos;ll craft a scrapbook-style memory page
            you&apos;ll treasure forever.
          </p>

          <Link
            to="/services"
            className="mt-3 inline-block rounded-full bg-rose px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-600 md:mt-6 md:px-6 md:py-3 md:text-base"
          >
            Start Creating
          </Link>
        </motion.div>

        {/* Right Images - Mobile pe bhi dikhega */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative col-span-1 h-40 md:h-96"
        >
          {/* Left top */}
          <div className="card-polaroid absolute left-0 top-0 z-10 w-16 rotate-[-6deg] animate-float md:left-8 md:w-48">
            <img
              src="/hero1.jpg"
              alt="memories"
              className="aspect-square rounded-sm object-cover md:rounded"
            />
          </div>

          {/* Right */}
          <div className="card-polaroid absolute right-0 top-6 z-20 w-16 rotate-3 md:right-4 md:top-16 md:w-56">
            <img
              src="/hero2.jpg"
              alt="memory"
              className="aspect-square rounded-sm object-cover md:rounded"
            />
          </div>

          {/* Center bottom - Overlay HATA DIYA */}
          <div className="card-polaroid absolute left-1/2 top-12 z-30 w-20 -translate-x-1/2 -rotate-2 md:relative md:left-auto md:top-0 md:mx-auto md:mt-24 md:w-64 md:translate-x-0">
            <img
              src="/hero3.jpg"
              alt="Birthday celebration"
              className="aspect-[4/5] rounded-sm object-cover md:rounded"
            />
            {/* ❌ Ye overlay div delete kar di - "Making Memories" text wala */}
          </div>
        </motion.div>
      </div>
    </section>
  );
}