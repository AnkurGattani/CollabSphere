'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import man from '../public/man.jpg'
import man2 from '../public/man2.png'

const feedbacks = [
  { name: 'John Doe', role: 'Project Manager', comment: 'ChatCollab has revolutionized our team communication!', avatar: man },
  { name: 'Jane Smith', role: 'Software Developer', comment: 'The real-time editing feature is a game-changer.', avatar: man2 },
  { name: 'Mike Johnson', role: 'IT Security Specialist', comment: 'Secure and efficient. Exactly what we needed.', avatar: man},
  { name: 'Emily Brown', role: 'UX Designer', comment: 'Our productivity has skyrocketed since using ChatCollab.', avatar: man2 },
  { name: 'Alex Lee', role: 'Product Owner', comment: 'The user interface is intuitive and beautiful.', avatar: man },
]

export default function Feedback() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scrollWidth = container.scrollWidth
    const clientWidth = container.clientWidth

    const animate = () => {
      if (container.scrollLeft >= scrollWidth - clientWidth) {
        container.scrollLeft = 0
      } else {
        container.scrollLeft += 1
      }
    }

    const animation = setInterval(animate, 30)

    return () => clearInterval(animation)
  }, [])

  return (
    <section className="py-20 bg-gradient-to-r from-blue-50 to-white overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-4xl font-bold text-center mb-12 text-blue-900"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          What Our Users Say
        </motion.h2>
        <div 
          ref={containerRef}
          className="flex overflow-x-hidden space-x-6 py-4"
        >
          {[...feedbacks, ...feedbacks].map((feedback, index) => (
            <motion.div
              key={index}
              className="flex-shrink-0 w-64 bg-white p-6 rounded-lg shadow-md border border-blue-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-center mb-4">
                <img src={typeof feedback.avatar === 'string' ? feedback.avatar : feedback.avatar.src} alt={feedback.name} className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-700">{feedback.name}</h3>
                  <p className="text-sm text-gray-600">{feedback.role}</p>
                </div>
              </div>
              <p className="text-gray-700 italic">"{feedback.comment}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

