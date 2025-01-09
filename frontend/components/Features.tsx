'use client'

import { motion } from 'framer-motion'
import { MessageSquare, Edit, Users, Lock } from 'lucide-react'

const features = [
  { icon: MessageSquare, title: 'Real-Time Chat', description: 'Instant messaging with your team' },
  { icon: Edit, title: 'Collaborative Editing', description: 'Edit documents together in real-time' },
  { icon: Users, title: 'Multiple Participants', description: 'Invite as many team members as you need' },
  { icon: Lock, title: 'Secure Rooms', description: 'Private, encrypted communication' },
]

export default function Features() {
  return (
    <section className="py-20 bg-gradient-to-l from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-4xl font-bold text-center mb-12 text-navy-900"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Features
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white p-6 rounded-lg text-center hover:shadow-lg transition-all duration-300 border border-blue-100"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
              >
                <feature.icon className="w-12 h-12 mx-auto mb-4 text-blue-500" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2 text-blue-700">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

