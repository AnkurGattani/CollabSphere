'use client'

import { motion, useAnimation } from 'framer-motion'
import { MessageSquare, Edit, Users, Lock } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { AnimationControls } from 'framer-motion'
import chat from "../public/Chat.jpg"
import multiple_people from "../public/multiple_people.jpg"
import rooms from "../public/rooms.jpg"
import Document from "../public/document.jpg"

const features = [
  {
    icon: MessageSquare,
    title: 'Real-Time Chat',
    description: 'Experience seamless communication with our instant messaging feature. Connect with your team in real-time, share ideas, and make decisions faster than ever before.',
    image:chat
  },
  {
    icon: Edit,
    title: 'Collaborative Editing',
    description: 'Work together on documents, spreadsheets, and presentations in real-time. See changes as they happen and never worry about version control again.',
    image: Document
  },
  {
    icon: Users,
    title: 'Multiple Participants',
    description: 'Bring your entire team on board. Our platform supports unlimited participants, making it perfect for small teams and large organizations alike.',
    image: multiple_people
  },
  {
    icon: Lock,
    title: 'Secure Rooms',
    description: 'Your privacy is our priority. Enjoy end-to-end encryption in all your communication rooms, ensuring your data remains confidential and secure.',
    image: rooms
  },
]



function FeatureItem({ feature, index, controls }: { feature: any, index: number, controls: AnimationControls }) {
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          controls.start('visible')
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [controls])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 50 }
      }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center mb-20 gap-8`}
    >
      <motion.div 
        className="w-full md:w-1/2"
        variants={{
          visible: { x: 0, opacity: 1 },
          hidden: { x: index % 2 === 0 ? -50 : 50, opacity: 0 }
        }}
      >
        <h3 className="text-2xl font-semibold mb-4 text-blue-700">
          <feature.icon className="inline-block w-8 h-8 mr-2 text-blue-500" />
          {feature.title}
        </h3>
        <p className="text-gray-600 text-lg">{feature.description}</p>
      </motion.div>
      <motion.div 
        className="w-full md:w-1/2"
        variants={{
          visible: { scale: 1, opacity: 1 },
          hidden: { scale: 0.8, opacity: 0 }
        }}
      >
        <Image
          src={feature.image || "/placeholder.svg"}
          alt={feature.title}
          width={400}
          height={300}
          className="rounded-lg shadow-lg"
        />
      </motion.div>
    </motion.div>
  )
}

export default function Features() {
  const controls = useAnimation()

  return (
    <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32">
        <motion.h2 
          className="text-4xl font-bold text-center mb-16 text-blue-900"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Powerful Features for Seamless Collaboration
        </motion.h2>
        {features.map((feature, index) => (
          <FeatureItem key={index} feature={feature} index={index} controls={controls} />
        ))}
      </div>
    </section>
  )
}

