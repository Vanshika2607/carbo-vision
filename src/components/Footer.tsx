//import React from 'react';
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Zap } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-brand-dark text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-3 group w-fit">
              <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm group-hover:bg-brand-secondary/20 transition-colors">
                <Zap className="h-6 w-6 text-brand-secondary fill-brand-secondary" />
              </div>
              <h2 className="text-lg font-extrabold font-display tracking-tight">Carbo Vision</h2>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Reimagining everyday life with smart, sustainable, and customized innovations — built for your needs, powered by creativity.
            </p>
            <div className="flex items-center gap-4">
              {['Twitter', 'Linkedin', 'Instagram', 'Github'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-brand-secondary hover:text-white transition-all duration-300 border border-white/5"
                  aria-label={social}
                >
                  <span className="sr-only">{social}</span>
                  {/* Icons would go here, using lucide equivalents or svgs */}
                  <div className="w-5 h-5 bg-current opacity-20 rounded-full" />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-brand-secondary mb-6">Explore</h3>
            <ul className="space-y-4">
              {[
                { name: 'Products', href: '/products' },
                { name: 'About Us', href: '/about' },
                { name: 'Case Studies', href: '/about#cases' },
                { name: 'Contact', href: '/contact' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm font-medium flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-[2px] bg-brand-secondary mr-0 group-hover:mr-2 transition-all duration-300"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-brand-secondary mb-6">Support</h3>
            <ul className="space-y-4">
              {[
                { name: 'Help Center', href: '#' },
                { name: 'Shipping Info', href: '#' },
                { name: 'Refund Policy', href: '#' },
                { name: 'Privacy Policy', href: '#' },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm font-medium flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-[2px] bg-brand-secondary mr-0 group-hover:mr-2 transition-all duration-300"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-brand-secondary mb-6">Contact</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white/5 rounded-lg">
                  <Mail className="h-4 w-4 text-brand-secondary" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold mb-1">Email Us</p>
                  <span className="text-sm text-gray-300 break-all">carbovision2025@gmail.com</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white/5 rounded-lg">
                  <Phone className="h-4 w-4 text-brand-secondary" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold mb-1">Call Us</p>
                  <span className="text-sm text-gray-300">+91 98157 79477</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white/5 rounded-lg">
                  <MapPin className="h-4 w-4 text-brand-secondary" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold mb-1">Find Us</p>
                  <span className="text-sm text-gray-300">Chitkara University, Punjab</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs font-medium">
            &copy; 2025 Carbo Vision Private Limited. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-[10px] text-gray-600 font-bold uppercase tracking-wider flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-secondary animate-pulse"></div>
              System Status: Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
