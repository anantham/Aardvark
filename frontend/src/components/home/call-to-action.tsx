'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

/**
 * Call to action section encouraging users to sign up.
 */
export function CallToAction() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            Start your journey today
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Write Your Own Adventure?
          </h2>

          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of writers and millions of readers in the world&apos;s
            largest interactive fiction community. Create an account to start
            reading for free or begin crafting your first branching narrative.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/register" className="gap-2">
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/about">Learn More</Link>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-6">
            No credit card required. Free forever for readers.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
