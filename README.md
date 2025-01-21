# CollabSphere

CollabSphere is an advanced real-time collaboration platform designed to streamline teamwork and boost productivity. With its robust features and intuitive interface, it empowers remote and hybrid teams to collaborate effectively through real-time chat, document editing, and AI-driven content generation.

---

## Features

- **Real-Time Chat**: Seamless communication within virtual rooms for effective discussions and faster decision-making.
- **Collaborative Document Editing**: Edit documents in real time with multiple users working simultaneously.
- **AI-Assisted Content Creation**: Leverage AI for auto-completion and content generation to enhance productivity.
- **Secure User Authentication**: Token-based authentication ensures only authorized users have access.

---

## Tech Stack

### Frontend
- **Framework**: Next.js
- **Styling**: Tailwind CSS, Shadcn UI

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Real-Time Communication**: WebSocket
- **Encryption**: bcrypt

### Database
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Hosting**: Neon.tech

### Deployment
- **Frontend**: Vercel
- **Backend**: AWS EC2

---

## System Architecture

- **Frontend**: Intuitive user interface for seamless interactions.
- **Backend**: Node.js server managing business logic and real-time operations.
- **Database**: PostgreSQL for efficient and secure data storage.

---

## Future Enhancements

- **File Sharing**: Securely upload and share media and documents.
- **AI-Driven Content Generation**: Enhance document creation with intelligent suggestions.
- **Premium Features**: Subscription-based features like priority support and increased room capacity.

---

## Installation

Follow these steps to run CollabSphere locally:

### Prerequisites

- Node.js (v16+)
- PostgreSQL

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/collabsphere.git
   cd collabsphere
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure the `.env` file:
   ```env
   PORT=1234
   DATABASE_URL=your-postgresql-url
   JWT_SECRET=your-secret
   ```
4. Run the backend:
   ```bash
   npm start
   ```
5. Navigate to the frontend directory, install dependencies, and start the frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
6. Access the app at `http://localhost:1234`.

---

## Deployment

- **Backend**: Deploy on AWS EC2 using PM2 and NGINX for reverse proxy.
- **Frontend**: Deploy on Vercel for quick and scalable hosting.

---

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature description"
   ```
4. Push your branch:
   ```bash
   git push origin feature-name
   ```
5. Open a Pull Request.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

Feel free to raise issues or suggest improvements!
