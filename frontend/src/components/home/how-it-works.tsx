'use client';

import { motion } from 'framer-motion';
import {
  UserPlus,
  BookOpen,
  GitBranch,
  PenTool,
  Sparkles,
  Share2,
} from 'lucide-react';

const readerSteps = [
  {
    icon: UserPlus,
    title: 'Create Account',
    description: 'Sign up for free to save progress and unlock all features',
  },
  {
    icon: BookOpen,
    title: 'Choose a Story',
    description: 'Browse thousands of interactive stories across genres',
  },
  {
    icon: GitBranch,
    title: 'Make Choices',
    description: 'Your decisions shape the narrative and determine endings',
  },
];

const writerSteps = [
  {
    icon: PenTool,
    title: 'Write Your Story',
    description: 'Use our visual editor or rich text editor to craft your tale',
  },
  {
    icon: Sparkles,
    title: 'Create Branches',
    description: 'Add choices, conditions, and multiple story paths',
  },
  {
    icon: Share2,
    title: 'Publish & Earn',
    description: 'Share with readers and earn from premium content',
  },
];

/**
 * How it works section showing steps for readers and writers.
 */
export function HowItWorks() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="grid md:grid-cols-2 gap-12">
      {/* For Readers */}
      <div>
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          For Readers
        </h3>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="space-y-6"
        >
          {readerSteps.map((step, index) => (
            <motion.div
              key={index}
              variants={item}
              className="flex gap-4"
            >
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <step.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-muted-foreground">
                    Step {index + 1}
                  </span>
                </div>
                <h4 className="font-semibold">{step.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* For Writers */}
      <div>
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <PenTool className="h-5 w-5 text-primary" />
          For Writers
        </h3>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="space-y-6"
        >
          {writerSteps.map((step, index) => (
            <motion.div
              key={index}
              variants={item}
              className="flex gap-4"
            >
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <step.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-muted-foreground">
                    Step {index + 1}
                  </span>
                </div>
                <h4 className="font-semibold">{step.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
