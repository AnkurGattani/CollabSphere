import Header from '../components/Header'
import Hero from '../components/Hero'
import Features from '../components/Features'
import Feedback from '../components/Feedback'
import FAQs from '../components/FAQs'
import Footer from '../components/Footer'

export default function Home() {
  return (

      <main className="min-h-screen bg-gradient-to-br from-white to-blue-50 text-gray-900 font-serif">
        <Header />
        <Hero />
        <Features />
        <Feedback />
        <FAQs />
        <Footer/>
      </main>

  )
}

