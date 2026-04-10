import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, X, ArrowRight, FileText, Brain, Sparkles, Wind } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'archive' | 'kb' | 'inspiration';
  category?: string;
}

interface CommandConsoleProps {
  data: SearchResult[];
}

export const CommandConsole: React.FC<CommandConsoleProps> = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter results based on query
  const filteredResults = useMemo(() => {
    if (!query) return data.slice(0, 5); // Show mental hooks/recent if no query
    const lowerQuery = query.toLowerCase();
    return data
      .filter(item => 
        item.title.toLowerCase().includes(lowerQuery) || 
        item.description.toLowerCase().includes(lowerQuery) ||
        item.category?.toLowerCase().includes(lowerQuery)
      )
      .slice(0, 8);
  }, [query, data]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle Console with Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }

      // Close on Escape
      if (e.key === 'Escape') {
        setIsOpen(false);
      }

      if (isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % filteredResults.length);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + filteredResults.length) % filteredResults.length);
        } else if (e.key === 'Enter' && filteredResults[selectedIndex]) {
          navigate(filteredResults[selectedIndex].url);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredResults, selectedIndex]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const navigate = (url: string) => {
    setIsOpen(false);
    window.location.href = url;
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'archive': return <FileText size={14} className="text-blue-400" />;
      case 'kb': return <Brain size={14} className="text-amber-400" />;
      case 'inspiration': return <Sparkles size={14} className="text-purple-400" />;
      default: return <Wind size={14} />;
    }
  };

  return (
    <>
      {/* Global Shortcut Trigger Info (Subtle hint) */}
      <div className="fixed bottom-8 left-8 z-50 pointer-events-none hidden md:block">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-[9px] uppercase tracking-[0.2em] text-white/20">
          <Command size={10} /> <span>+</span> <span>K</span>
          <span className="ml-2 border-l border-white/10 pl-2">Console</span>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-start justify-center pt-[15vh] px-4"
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/10 backdrop-blur-md" 
              onClick={() => setIsOpen(false)} 
            />

            {/* Modal */}
            <motion.div
              initial={{ scale: 0.98, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.98, opacity: 0, y: 10 }}
              transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
              className="relative w-full max-w-2xl bg-[#0a0a0a]/60 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Search Box */}
              <div className="flex items-center gap-4 px-6 py-5 border-b border-white/5 bg-white/5">
                <Search size={20} className="text-white/40" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="寻找存档、知识片段或灵感..."
                  className="flex-grow bg-transparent border-none outline-none text-lg text-white font-sans placeholder:text-white/20"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button 
                   onClick={() => setIsOpen(false)}
                   className="p-2 hover:bg-white/5 rounded-full text-white/20 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto p-2 scrollbar-hide">
                <div className="px-4 py-3">
                   <p className="text-[9px] uppercase tracking-[0.4em] text-white/20 font-sans mb-2">
                     {query ? '匹配结果' : '最近记录 & 推荐'}
                   </p>
                </div>

                {filteredResults.length === 0 ? (
                  <div className="px-4 py-12 text-center">
                    <p className="text-white/20 font-serif italic">没有找到相关的联结碎片...</p>
                  </div>
                ) : (
                  filteredResults.map((result, index) => (
                    <button
                      key={result.id}
                      onClick={() => navigate(result.url)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 text-left group ${
                        selectedIndex === index ? 'bg-white/10 translate-x-1' : 'opacity-60'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                        selectedIndex === index ? 'bg-white/10' : 'bg-white/5'
                      }`}>
                        {getIcon(result.type)}
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center gap-3 mb-0.5">
                          <h3 className="text-sm font-medium text-white">{result.title}</h3>
                          <span className="text-[8px] uppercase tracking-[0.2em] px-1.5 py-0.5 rounded bg-white/5 text-white/30">
                            {result.type === 'kb' ? result.category || 'Knowledge' : result.type}
                          </span>
                        </div>
                        <p className="text-xs text-white/40 line-clamp-1">{result.description}</p>
                      </div>
                      <ArrowRight 
                        size={14} 
                        className={`text-white/20 transition-all duration-500 ${
                          selectedIndex === index ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'
                        }`} 
                      />
                    </button>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-between text-[8px] uppercase tracking-[0.2em] text-white/20 font-sans">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <span className="px-1 py-0.5 rounded bg-white/10 text-white/40">Enter</span> 选择
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-1 py-0.5 rounded bg-white/10 text-white/40">↑↓</span> 导航
                  </div>
                </div>
                <div>Whisper Console // v1.0</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
