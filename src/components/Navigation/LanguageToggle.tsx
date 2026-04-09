import { motion } from "framer-motion";

interface Props {
  currentLang: "zh" | "en";
  currentPath: string;
}

export const LanguageToggle = ({ currentLang, currentPath }: Props) => {
  const nextLang = currentLang === "zh" ? "en" : "zh";

  const getTargetUrl = () => {
    // Strip current language prefix if exists (e.g., /en/resume -> /resume)
    const baseP = currentPath.replace(/^\/(en|zh)/, '') || '/';
    // Ensure leading slash
    const cleanPath = baseP.startsWith('/') ? baseP : `/${baseP}`;
    
    // Default language (zh) has no prefix
    if (nextLang === 'zh') {
      return cleanPath;
    } else {
      // English has /en/ prefix
      return `/en${cleanPath === '/' ? '' : cleanPath}`;
    }
  };

  return (
    <motion.a
      href={getTargetUrl()}
      className="text-[9px] uppercase tracking-[0.4em] text-accent hover:text-text-main transition-colors duration-500 font-sans cursor-pointer whitespace-nowrap"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        // Save preference for automatic detection later
        if (typeof window !== 'undefined') {
          localStorage.setItem('preferred-lang', nextLang);
        }
      }}
    >
      <span className={currentLang === 'zh' ? 'text-text-main font-medium' : 'opacity-40'}>ZH</span>
      <span className="mx-2 opacity-10">/</span>
      <span className={currentLang === 'en' ? 'text-text-main font-medium' : 'opacity-40'}>EN</span>
    </motion.a>
  );
};
