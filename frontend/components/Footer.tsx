'use client'

import { motion } from 'framer-motion'
import { Facebook, Twitter, Instagram, Linkedin, Github } from 'lucide-react'
import Link from 'next/link'

const footerLinks = [
  { title: 'Product', links: ['Features', 'Pricing', 'Integrations', 'FAQ'] },
  { title: 'Company', links: ['About Us', 'Careers', 'Press', 'News'] },
  { title: 'Resources', links: ['Blog', 'Newsletter', 'Events', 'Help Center'] },
  { title: 'Legal', links: ['Terms', 'Privacy', 'Cookies', 'Licenses'] },
]

const socialLinks = [
  { icon: Facebook, href: 'https://www.facebook.com' },
  { icon: Twitter, href: 'https://www.twitter.com' },
  { icon: Instagram, href: 'https://www.instagram.com' },
  { icon: Linkedin, href: 'https://www.linkedin.com' },
  { icon: Github, href: 'https://www.github.com' },
]

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 justify-items-center">
          {footerLinks.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
                {column.title}
              </h3>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link}>
                    <Link href="#" className="hover:text-white transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <motion.div 
            className="flex space-x-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {socialLinks.map((social, index) => (
              <a
                key={`${social.icon.name}-${index}`}
                href={social.href}
                target="_blank"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label={`Follow us on ${social.icon.name}`}
              >
                <social.icon className="h-6 w-6" />
              </a>
            ))}
          </motion.div>
          <motion.p 
            className="mt-8 md:mt-0 text-base text-gray-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            &copy; {new Date().getFullYear()} CollabSphere, Inc. All rights reserved.
          </motion.p>
        </div>
      </div>
    </footer>
  )
}
