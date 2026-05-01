import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';

const galleryItems = [
  { id: 1, src: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600', alt: 'Blood donation camp', category: 'blood', caption: 'Annual Blood Donation Camp – 2024', span: 'md:col-span-2' },
  { id: 2, src: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400', alt: 'Volunteers distributing food', category: 'food', caption: 'Weekend Meal Distribution', span: '' },
  { id: 3, src: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400', alt: 'Charity event', category: 'event', caption: 'Annual Fundraising Gala 2024', span: '' },
  { id: 4, src: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=400', alt: 'Clothes collection drive', category: 'clothes', caption: 'Winter Clothes Drive', span: '' },
  { id: 5, src: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600', alt: 'Community service', category: 'community', caption: 'Community Clean-Up Drive', span: 'md:col-span-2' },
  { id: 6, src: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400', alt: 'Volunteer team', category: 'volunteers', caption: 'Our Amazing Volunteer Team', span: '' },
  { id: 7, src: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400', alt: 'Food preparation', category: 'food', caption: 'Hotel Partnership – Meal Prep', span: '' },
  { id: 8, src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400', alt: 'Event hall', category: 'event', caption: 'Volunteer Recognition Ceremony', span: '' },
  { id: 9, src: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600', alt: 'Helping community', category: 'community', caption: 'Reaching Underserved Communities', span: 'md:col-span-2' },
  { id: 10, src: 'https://images.unsplash.com/photo-1631549916768-4119b4123a21?w=400', alt: 'Health camp', category: 'blood', caption: 'Free Health Checkup Camp', span: '' },
];

const cats = ['all', 'blood', 'food', 'clothes', 'volunteers', 'event', 'community'];

export default function Gallery() {
  const [filter, setFilter] = useState('all');
  const [lightbox, setLightbox] = useState(null);

  const filtered = galleryItems.filter(g => filter === 'all' || g.category === filter);

  return (
    <div className="pt-20 min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <span className="text-purple-500 font-semibold text-sm uppercase tracking-widest">Our Journey</span>
          <h1 className="section-title mt-3 mb-4">Moments of Impact</h1>
          <p className="section-subtitle mx-auto">Every photo tells a story of hope, humanity, and collective action.</p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {cats.map(c => (
            <button key={c} onClick={() => setFilter(c)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${filter === c ? 'bg-crimson-500 text-white shadow-lg' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'}`}>
              {c}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <AnimatePresence>
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
                className={`relative group cursor-pointer overflow-hidden rounded-2xl ${item.span} ${i % 3 === 0 ? 'md:row-span-2' : ''}`}
                onClick={() => setLightbox(item)}
              >
                <img src={item.src} alt={item.alt}
                  className="w-full h-full object-cover aspect-video md:aspect-auto md:min-h-48 transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div>
                    <p className="text-white font-semibold text-sm">{item.caption}</p>
                    <span className="text-white/60 text-xs capitalize">{item.category}</span>
                  </div>
                  <ZoomIn className="absolute top-4 right-4 w-5 h-5 text-white" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl w-full"
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setLightbox(null)} className="absolute -top-10 right-0 text-white hover:text-crimson-400 transition-colors">
                <X className="w-8 h-8" />
              </button>
              <img src={lightbox.src.replace('w=400', 'w=1200').replace('w=600', 'w=1200')} alt={lightbox.alt}
                className="w-full rounded-2xl shadow-2xl" />
              <p className="text-white text-center mt-4 font-medium">{lightbox.caption}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
