import React from 'react';
import { Shield, Zap, TrendingDown, MessageCircle, AlertCircle, PhoneOff, XCircle, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="container hero animate-fade">
        <div className="hero-grid">
          <div className="hero-content">
            <h1>Stop Losing Money on <span style={{color: 'var(--primary)'}}>COD Returns</span></h1>
            <p>E-Track PK helps online stores identify high-risk customers who repeatedly cancel orders or refuse calls. Save on delivery charges (DC) and focus on real customers.</p>
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              <Link to="/signup" className="btn-primary">Start 14-Day Free Trial</Link>
              <a href="#about" className="btn-outline">How it works</a>
            </div>
          </div>
          <div className="hero-image-container glass premium-shadow">
            <img src="/hero.png" alt="E-Track Dashboard" className="hero-img" onError={(e) => e.target.style.display='none'} />
            <div className="placeholder-text">[Hero Image Placeholder]</div>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="container problem-section">
        <div className="glass" style={{ padding: '60px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          <h2 style={{ textAlign: 'left', marginBottom: '40px' }}><AlertCircle style={{ color: 'var(--danger)', verticalAlign: 'middle', marginRight: '10px' }} /> The Problem with COD in Pakistan</h2>
          <div className="problem-grid">
            <div className="problem-card">
              <PhoneOff size={40} color="var(--danger)" />
              <h3>Calls Not Received</h3>
              <p>Customers place orders but never pick up the rider's call during delivery, leading to failed attempts.</p>
            </div>
            <div className="problem-card">
              <XCircle size={40} color="var(--danger)" />
              <h3>Sudden Cancellations</h3>
              <p>Orders are cancelled at the doorstep without any valid reason, wasting your time and efforts.</p>
            </div>
            <div className="problem-card">
              <DollarSign size={40} color="var(--danger)" />
              <h3>High DC Expenses</h3>
              <p>Every return costs you Double Delivery Charges (DC). E-Track PK helps you cut these unnecessary costs by 80%.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features / About */}
      <section id="about" className="container features-section">
        <h2>How E-Track PK Solves This</h2>
        <div className="features-grid">
          {[
            { icon: <Shield size={32} />, title: "Shared Blacklist", desc: "Access a massive database of blacklisted numbers from thousands of Pakistani stores. If a customer frauded someone else, you'll know before shipping." },
            { icon: <Zap size={32} />, title: "Real-time Risk Score", desc: "Instantly see if a customer is Low, Medium, or High risk. Make informed decisions whether to ship or cancel." },
            { icon: <TrendingDown size={32} />, title: "DC Optimization", desc: "By filtering out high-risk orders, your delivery success rate increases, saving you thousands in delivery charges every month." },
            { icon: <MessageCircle size={32} />, title: "Direct Admin Support", desc: "Have questions? Chat directly with our support team via the private live chat integrated into your dashboard." }
          ].map((feature, i) => (
            <div key={i} className="glass feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="container pricing-section">
        <h2>Flexible Plans for Every Store</h2>
        <p style={{ textAlign: 'center' }}>Choose the plan that fits your store's volume.</p>
        <div className="pricing-grid">
          {[
            { name: "Free Trial", price: "0", duration: "14 Days", features: ["Full Database Access", "Risk Score Lookup", "Live Support Chat", "Blacklist Customers"], btnClass: "btn-outline" },
            { name: "1 Month", price: "15,000", duration: "30 Days", features: ["Full Database Access", "Risk Score Lookup", "Live Support Chat", "Priority Support", "Store Profile customization"], btnClass: "btn-outline" },
            { name: "6 Months", price: "25,000", duration: "180 Days", features: ["Everything in 1 Month", "Best Value for Money", "Advanced Analytics", "Exclusive Blacklist Data"], btnClass: "btn-primary", featured: true },
            { name: "1 Year", price: "50,000", duration: "365 Days", features: ["Complete Protection", "Dedicated Account Manager", "Early Access to AI Features", "Bulk Search Support"], btnClass: "btn-outline" }
          ].map((plan, i) => (
            <div key={i} className={`glass pricing-card ${plan.featured ? 'featured' : ''}`}>
              <h3>{plan.name}</h3>
              <div className="price-tag">Rs {plan.price}</div>
              <p className="duration">{plan.duration}</p>
              <ul className="plan-features">
                {plan.features.map((f, j) => <li key={j}>✓ {f}</li>)}
              </ul>
              <Link to="/signup" className={plan.btnClass} style={{ width: '100%', textAlign: 'center', display: 'block', textDecoration: 'none' }}>Select Plan</Link>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="container contact-section">
        <div className="glass contact-form-container">
          <h2>Get in Touch</h2>
          <p style={{ textAlign: 'center' }}>Have questions about our shared blacklist? Contact us today.</p>
          <form className="contact-form">
            <div className="form-group">
              <input type="text" placeholder="Your Name" required />
            </div>
            <div className="form-group">
              <input type="email" placeholder="Store Email" required />
            </div>
            <div className="form-group">
              <textarea placeholder="Tell us about your store's return issues..." rows="5" required></textarea>
            </div>
            <button className="btn-primary" style={{ width: '100%' }}>Send Message</button>
          </form>
        </div>
      </section>

      <footer className="container" style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', borderTop: '1px solid var(--glass-border)' }}>
        <p>&copy; 2026 E-Track PK. Protecting Pakistani E-Commerce.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
