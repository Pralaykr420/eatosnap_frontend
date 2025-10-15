import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiTruck, FiVideo, FiZap, FiMessageCircle } from 'react-icons/fi';

const Home = () => {
  const features = [
    { icon: FiTruck, title: 'Fast Delivery', desc: 'Get your food in 30 mins or less' },
    { icon: FiVideo, title: 'Food Reels', desc: 'Discover dishes through short videos' },
    { icon: FiZap, title: 'AI Recommendations', desc: 'Personalized food suggestions' },
    { icon: FiMessageCircle, title: 'Live Chat', desc: 'Connect with restaurants directly' },
  ];

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-dark mb-6">
              Order Food & Groceries
              <br />
              <span className="text-primary">All in One Place</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover restaurants, watch food reels, and get personalized recommendations powered
              by AI
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/restaurants" className="btn-primary text-lg">
                Explore Restaurants
              </Link>
              <Link to="/reels" className="btn-outline text-lg">
                Watch Reels
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose EATO?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="card p-6 text-center"
              >
                <feature.icon className="text-5xl text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8">Join thousands of food lovers on EATO</p>
          <Link to="/register" className="bg-white text-primary px-8 py-4 rounded-lg font-bold text-lg hover:shadow-2xl transition">
            Create Account
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
