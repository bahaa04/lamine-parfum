import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AccordionItem {
  title: string;
  content: string | React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
}

export default function Accordion({ items, allowMultiple = false }: AccordionProps) {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    if (allowMultiple) {
      setOpenItems(prev =>
        prev.includes(index)
          ? prev.filter(i => i !== index)
          : [...prev, index]
      );
    } else {
      setOpenItems(prev => (prev.includes(index) ? [] : [index]));
    }
  };

  return (
    <div className="divide-y divide-taupe/20">
      {items.map((item, index) => {
        const isOpen = openItems.includes(index);

        return (
          <div key={index} className="py-4">
            <button
              onClick={() => toggleItem(index)}
              className="w-full flex items-center justify-between text-left group"
            >
              <span className="font-medium text-ivory group-hover:text-gold transition-colors">
                {item.title}
              </span>
              {isOpen ? (
                <ChevronUp className="text-gold flex-shrink-0" size={20} />
              ) : (
                <ChevronDown className="text-white/70 flex-shrink-0" size={20} />
              )}
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pt-3 text-white/70 text-sm leading-relaxed">
                    {typeof item.content === 'string' ? (
                      <p>{item.content}</p>
                    ) : (
                      item.content
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
