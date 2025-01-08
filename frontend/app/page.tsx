import Header from '../components/Header'
import Hero from '../components/Hero'
import Features from '../components/Features'
import Feedback from '../components/Feedback'
import FAQs from '../components/FAQs'


export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-blue-50 text-gray-900">
      <Header />
      <Hero />
      <Features />
      <Feedback />
      <FAQs />
    </main>
  )
}

