import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, Instagram, Twitter, Facebook, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300 pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-crimson-500 to-ocean-600 flex items-center justify-center">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="font-display font-bold text-xl text-white">Helping<span className="text-crimson-400">Hands</span></span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">Connecting compassionate hearts with lives that need a helping hand. Building a stronger India, one act of kindness at a time.</p>
            <div className="flex gap-3">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-crimson-600 flex items-center justify-center transition-colors duration-200"><Icon className="w-4 h-4" /></a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {[{to:'/about',label:'About Us'},{to:'/donate',label:'Donate Now'},{to:'/volunteer',label:'Become a Volunteer'},{to:'/events',label:'Upcoming Events'},{to:'/leaderboard',label:'Leaderboard'},{to:'/gallery',label:'Our Gallery'},{to:'/dashboard',label:'My Dashboard'}].map(link => (
                <li key={link.to}><Link to={link.to} className="text-sm text-gray-400 hover:text-crimson-400 transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Our Programs</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>🩸 Blood Donation Drives</li><li>🍱 Hotel Food Partnership</li><li>👕 Clothes Collection</li><li>📚 Education Support</li><li>🌱 Environmental Drives</li><li>👴 Elder Care Program</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2.5"><MapPin className="w-4 h-4 text-crimson-400 mt-0.5 shrink-0" />Vignan's University, Guntur, Andhra Pradesh</li>
              <li className="flex items-center gap-2.5"><Phone className="w-4 h-4 text-ocean-400 shrink-0" />+91 7989444394</li>
              <li className="flex items-center gap-2.5"><Mail className="w-4 h-4 text-yellow-400 shrink-0" />hello@helpinghands.org.in</li>
            </ul>
            <div className="mt-5 p-3.5 bg-gray-800/60 rounded-xl">
              <p className="text-xs text-gray-400">📋 Registered NGO — Helping Hands Foundation</p>
              <p className="text-xs text-gray-500 font-mono mt-1">Vignan's University, Guntur, AP</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">© 2025 Helping Hands Foundation. All rights reserved.</p>
          <p className="text-sm text-gray-500 flex items-center gap-1">Made with <Heart className="w-3.5 h-3.5 text-crimson-400 fill-crimson-400" /> for a better India</p>
        </div>
      </div>
    </footer>
  );
}
