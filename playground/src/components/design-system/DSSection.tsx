'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { forwardRef, useEffect } from 'react';
import { motionDuration, motionEase, motionOffset } from '@ai-created/ui';

interface DSSectionProps {
  id: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onInView?: (id: string) => void;
}

const DSSection = forwardRef<HTMLElement, DSSectionProps>(
  function DSSection({ id, title, subtitle, children, onInView }, ref) {
    const { ref: inViewRef, inView } = useInView({
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0,
    });

    useEffect(() => {
      if (inView && onInView) {
        onInView(id);
      }
    }, [inView, onInView, id]);

    return (
      <section
        id={id}
        ref={(node) => {
          inViewRef(node);
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        className="scroll-mt-28"
      >
        <motion.div
          initial={{ opacity: 0, y: motionOffset.lg }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: motionDuration.section, ease: motionEase.standard }}
        >
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-display text-text tracking-wide">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-3 text-text2 text-base leading-relaxed max-w-2xl">
                {subtitle}
              </p>
            )}
          </div>
          {children}
        </motion.div>
      </section>
    );
  }
);

export default DSSection;
