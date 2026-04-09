import { motion } from "framer-motion";
import { GithubIcon, LinkedinIcon, Mail, FileText, ExternalLink } from "../../../components/Common/Icons";

const socialLinks = [
  { name: "GitHub", href: "https://github.com/EHOzg", icon: GithubIcon },
  { name: "LinkedIn", href: "#", icon: LinkedinIcon },
  { name: "Read.cv", href: "#", icon: FileText },
];

export const SocialLinks = () => {
  return (
    <div className="flex flex-wrap gap-8 md:gap-12">
      {socialLinks.map((link) => {
        const Icon = link.icon;
        return (
          <motion.a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 text-xs uppercase tracking-[0.2em] transition-colors hover:text-accent"
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <div className="p-2 rounded-full bg-text-main/5 group-hover:bg-text-main/10 transition-colors duration-500">
              {Icon && <Icon size={14} />}
            </div>
            <span>{link.name}</span>
            <ExternalLink size={10} className="opacity-0 group-hover:opacity-40 transition-opacity" />
          </motion.a>
        );
      })}
    </div>
  );
};

export const ContactLink = ({ email }: { email: string }) => {
  return (
    <motion.a
      href={`mailto:${email}`}
      className="group inline-flex items-center gap-4 text-xs uppercase tracking-[0.2em] hover:text-accent transition-colors underline underline-offset-8 decoration-text-main/10 hover:decoration-accent/30"
      whileHover={{ x: 5 }}
    >
      <div className="p-2 rounded-full bg-text-main/5 group-hover:bg-text-main/10 transition-colors duration-500">
        <Mail size={14} />
      </div>
      <span>{email}</span>
    </motion.a>
  );
};
