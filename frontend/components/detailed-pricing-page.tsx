'use client'
import { Check, X } from 'lucide-react'
import Link from 'next/link';

// Stripe plans list
export const plans = [
  {
    link: 'https://buy.stripe.com/test_dRm4gybpH6Oq4cK8EwfEk01',
    priceId: 'price_1RWTYDBBvcyNcUcPihRAB3kn',
    price: 19.99,
  }
];

export default function DetailedPricingPage() {

  const makePayment = async() => {
    const user = JSON.parse(localStorage.getItem("user") || '{}');
    console.log(user);

    const paymentURL = plans[0].link + '?prefilled_email=' + user?.email;

    // window.open(paymentURL, '');
    window.location.replace(paymentURL);

    console.log(localStorage.user);
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto md:p-12 p-6">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-12">Choose Your Collaboration Plan</h1>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Free (Beta/Normal) Version */}
          <div className="border border-blue-200 rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">Free (Beta/Normal) Version</h2>
            <p className="text-3xl font-bold mb-6">$0 / month</p>
            <div className="space-y-6 mb-8">
              <FeatureSection title="Room Features">
                <Feature>Max 10 participants per room</Feature>
                <Feature>Up to 1 hour per session</Feature>
                <Feature>Basic text editing</Feature>
              </FeatureSection>
              <FeatureSection title="Performance">
                <Feature>Standard server response time (up to 1s latency)</Feature>
                <Feature>Limited server bandwidth</Feature>
              </FeatureSection>
              <FeatureSection title="Support">
                <Feature>Community support</Feature>
                <NotFeature>Dedicated customer support</NotFeature>
              </FeatureSection>
            </div>
            <Link href="/">
            <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300">
              Get Started for Free
            </button>
            </Link>
          </div>

          {/* Premium (Upgraded) Version */}
          <div className="border-2 border-blue-500 rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">Premium (Upgraded) Version</h2>
            <p className="text-3xl font-bold mb-6">$19.99 / month</p>
            <div className="space-y-6 mb-8">
              <FeatureSection title="Room Features">
                <Feature>Max 50 participants per room</Feature>
                <Feature>Unlimited session time</Feature>
                <Feature>Real-time updates with advanced editing tools</Feature>
                <Feature>Secure, encrypted rooms</Feature>
              </FeatureSection>
              <FeatureSection title="Performance">
                <Feature>Fast server response time (under 200ms latency)</Feature>
                <Feature>Priority server bandwidth</Feature>
              </FeatureSection>
              <FeatureSection title="Support">
                <Feature>Priority 24/7 customer support</Feature>
                <Feature>Access to premium tutorials and documentation</Feature>
              </FeatureSection>
            </div>
            <button onClick={makePayment} className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300">
              Upgrade to Premium
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function FeatureSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <ul className="space-y-2">{children}</ul>
    </div>
  )
}

function Feature({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start space-x-3">
      <Check className="flex-shrink-0 w-5 h-5 text-green-500 mt-1" />
      <span>{children}</span>
    </li>
  )
}

function NotFeature({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start space-x-3">
      <X className="flex-shrink-0 w-5 h-5 text-red-500 mt-1" />
      <span className="text-gray-500">{children}</span>
    </li>
  )
}

