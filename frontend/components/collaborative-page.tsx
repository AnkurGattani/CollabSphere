import React from 'react'
import Header from './Header'

const CollaborativePage = ({ roomId }: { roomId: string }) => {
  return (
    <div className="flex flex-col h-screen bg-white text-gray-800">
      <Header />
      <div className="flex flex-col md:flex-row flex-grow overflow-hidden p-4 sm:p-6 lg:p-8 space-y-4 md:space-y-0 md:space-x-4">
        {/* Editor Section */}
        <div className="w-full md:w-3/4 flex flex-col">
          <div className="bg-gray-100 rounded-lg flex-grow p-4">
            <textarea 
              className="w-full h-full p-3 bg-white border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
              placeholder={`Start collaborating in room ${roomId}...`}
            ></textarea>
          </div>
        </div>

        {/* Chat Section */}
        <div className="w-full md:w-1/4 flex flex-col">
          <div className="flex-grow bg-gray-100 p-4 rounded-lg mb-4 overflow-y-auto">
            {/* Placeholder for chat messages */}
            <div className="mb-2 text-sm">
              <span className="font-bold">User 1:</span> Hello there!
            </div>
            <div className="mb-2 text-sm">
              <span className="font-bold">User 2:</span> Hi! Let's collaborate.
            </div>
          </div>
          <div className="flex">
            <input 
              type="text" 
              className="flex-grow p-2 border border-blue-200 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Type your message..."
            />
            <button className="px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-r-md hover:from-blue-600 hover:to-blue-700 transition duration-300 ease-in-out text-sm">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CollaborativePage

