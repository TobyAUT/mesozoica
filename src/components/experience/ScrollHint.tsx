import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { useTr } from '@/i18n';

export function ScrollHint() {
  const { t } = useTr();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.4, duration: 1 }}
      className="pointer-events-none absolute inset-x-0 bottom-10 flex flex-col items-center gap-2 text-muted"
    >
      <span className="type-eyebrow text-[0.58rem]">{t('scrollToBegin')}</span>
      <motion.span
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ChevronDown size={18} />
      </motion.span>
    </motion.div>
  );
}
