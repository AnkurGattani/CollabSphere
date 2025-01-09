'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    question: "What is CollabSphere?",
    answer: "CollabSphere is a real-time collaboration platform that combines instant messaging with collaborative document editing, designed to enhance team communication and productivity."
  },
  {
    question: "How secure is CollabSphere?",
    answer: "CollabSphere uses end-to-end encryption for all communications and data storage. We prioritize the security and privacy of our users' information."
  },
  {
    question: "Can I use CollabSphere on mobile devices?",
    answer: "Yes, ChatCollab is fully responsive and works on all modern mobile devices. We also offer dedicated mobile apps for iOS and Android for an optimized experience."
  },
  {
    question: "Is there a limit to the number of team members I can add?",
    answer: "Our plans are flexible and can accommodate teams of all sizes. For specific pricing and user limits, please check our pricing page or contact our sales team."
  },
  {
    question: "Do you offer integration with other tools?",
    answer: "Yes, CollabSphere integrates with a wide range of popular tools including project management software, version control systems, and productivity suites. Check our integrations page for a full list."
  }
]

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-20 bg-gradient-to-l from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-4xl font-bold text-center mb-12 text-navy-900"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Frequently Asked Questions
        </motion.h2>
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <button
                className="flex justify-between items-center w-full text-left p-4 bg-white rounded-lg focus:outline-none border border-blue-100 hover:border-blue-300 transition-colors duration-300"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="text-lg font-semibold text-blue-700">{faq.question}</span>
                <ChevronDown
                  className={`transform transition-transform duration-300 text-blue-500 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white p-4 rounded-b-lg"
                  >
                    <p className="text-gray-700">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

