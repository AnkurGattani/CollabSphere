'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import man from '../public/man.jpg'
import man2 from '../public/man2.png'

const feedbacks = [
  { 
    name: 'Sarah Chen', 
    role: 'Engineering Lead', 
    comment: 'ChatCollab has transformed how our distributed team collaborates. The real-time features and intuitive interface have made remote work feel seamless.', 
    avatar: man 
  },
  { 
    name: 'David Martinez', 
    role: 'Senior Product Manager', 
    comment: 'The integrated AI features and collaborative tools have boosted our team\'s productivity by at least 40%. Best investment in our workflow this year.', 
    avatar: man2 
  },
  { 
    name: 'Rachel Thompson', 
    role: 'DevOps Engineer', 
    comment: 'Finally, a collaboration platform that understands developers. The code sharing and version control integration is exactly what we needed.', 
    avatar: man
  },
  { 
    name: 'James Wilson', 
    role: 'UI/UX Team Lead', 
    comment: 'ChatCollab\'s design system and component library have streamlined our design-to-development workflow significantly.', 
    avatar: man2 
  },
  { 
    name: 'Lisa Patel', 
    role: 'Agile Coach', 
    comment: 'The sprint planning and task management features have made our agile ceremonies much more effective. Our team loves the integrated retrospective tools.', 
    avatar: man 
  },
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
              className="flex-shrink-0 w-64 bg-white p-6 rounded-lg shadow-md border border-blue-100 border-t-4 border-t-blue-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-center mb-4">
                <Image src={feedback.avatar} alt={feedback.name} className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-700">{feedback.name}</h3>
                  <p className="text-sm text-gray-600">{feedback.role}</p>
                </div>
              </div>
              <p className="text-gray-700 italic">&ldquo;{feedback.comment}&rdquo;</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

