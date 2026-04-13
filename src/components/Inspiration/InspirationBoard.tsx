import React from 'react';
import { motion } from 'framer-motion';

interface Inspiration {
  id: string;
  data: {
    type: 'thought' | 'snippet' | 'quote';
    content: string;
    author?: string;
    date?: Date | string;
  }
}

interface InspirationBoardProps {
  inspirations: Inspiration[];
}

const typeStyles = {
  thought: 'bg-accent/5 border-accent/20 text-text-main',
  snippet: 'bg-bg-base border-border-muted text-text-main font-mono text-sm',
  quote: 'bg-accent-gold/10 border-accent-gold/30 text-text-main italic',
};

const typeLabels = {
  thought: '// thought',
  snippet: '/* snippet */',
  quote: '“ quote ”',
};

export const InspirationBoard: React.FC<InspirationBoardProps> = ({ inspirations }) => {
  return (
    <div className="w-full min-h-screen bg-bg-base px-6 py-32 md:py-48 max-w-2xl mx-auto">
      {/* Header */}
      <header className="mb-32 text-left">
        <div className="inline-flex items-center gap-2 mb-8 opacity-40">
          <div className="w-8 h-[1px] bg-text-main"></div>
          <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-text-main">Whisper Stream</span>
        </div>
        <h1 className="text-6xl md:text-8xl font-serif font-medium tracking-tighter mb-8 text-text-main italic">
           片段.
        </h1>
        <p className="text-text-muted text-lg md:text-xl leading-relaxed opacity-60">
           剥落视觉的装饰，只留下思绪的纹理。
        </p>
      </header>

      {/* Whisper Stream (Single Column, No Cards) */}
      <div className="space-y-32">
        {inspirations.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative"
          >
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <span className="text-[10px] uppercase tracking-[0.4em] opacity-20 font-medium">
                  {typeLabels[item.data.type]}
                </span>
                <div className="flex-1 h-[1px] bg-text-main/5"></div>
              </div>

              <div className="relative pl-0 md:pl-8">
                {item.data.type === 'quote' && (
                  <div className="absolute top-0 -left-6 w-1 h-full bg-accent/20"></div>
                )}
                
                <p className={`whitespace-pre-wrap leading-relaxed text-text-main ${item.data.type === 'quote' ? 'text-2xl font-serif italic' : 'text-lg font-sans opacity-80'}`}>
                  {item.data.content}
                </p>
              </div>

              {item.data.author && (
                <div className="pl-0 md:pl-8 text-xs font-serif italic text-text-muted opacity-40">
                  — {item.data.author}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer Decoration */}
      <footer className="mt-64 text-center pb-24 opacity-20">
        <div className="w-px h-24 bg-gradient-to-b from-text-main to-transparent mx-auto"></div>
        <p className="text-[10px] uppercase tracking-[1em] mt-8">End of Stream</p>
      </footer>
    </div>
  );
};
