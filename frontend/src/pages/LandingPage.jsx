import React from 'react';
import { Shield, Zap, TrendingDown, MessageCircle, AlertCircle, PhoneOff, XCircle, DollarSign, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="landing-wrapper">
      {/* Hero Section */}
      <header className="hero-section">
        <div className="container hero-grid">
          <div className="hero-content animate-fade">
            <div className="badge">Trusted by 500+ Pakistani Stores</div>
            <h1>Stop Losing Money on <span className="gradient-text">COD Returns</span></h1>
            <p className="hero-description">
              Identify high-risk customers who repeatedly cancel orders or refuse calls. 
              Reduce your delivery charges (DC) and boost your profits today.
            </p>
            <div className="hero-cta">
              <Link to="/signup" className="btn-primary">Start 14-Day Free Trial</Link>
              <a href="#about" className="btn-outline">How it works</a>
            </div>
          </div>
          <div className="hero-visual animate-fade">
            <div className="glass visual-container premium-shadow">
              <img src="/hero.png" alt="E-Track Dashboard" className="hero-img" onError={(e) => e.target.style.display='none'} />
              <div className="placeholder-ui">
                <div className="ui-header"></div>
                <div className="ui-stats">
                  <div className="ui-stat"></div>
                  <div className="ui-stat"></div>
                  <div className="ui-stat"></div>
                </div>
                <div className="ui-chart"></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* The Problem Section */}
      <section className="problem-section">
        <div className="container">
          <div className="glass problem-box">
            <div className="section-header">
              <span className="error-badge"><AlertCircle size={16} /> THE REALITY</span>
              <h2>Why Online Stores in Pakistan Struggle</h2>
            </div>
            <div className="problem-grid">
              <div className="problem-card">
                <div className="problem-icon-box"><PhoneOff size={32} /></div>
                <h3>Calls Not Received</h3>
                <p>Customers place orders but disappear during delivery attempts. Every "No Answer" is money out of your pocket.</p>
              </div>
              <div className="problem-card">
                <div className="problem-icon-box"><XCircle size={32} /></div>
                <h3>Doorstep Refusal</h3>
                <p>Orders are cancelled right at the doorstep. You pay for shipping both ways while the customer loses nothing.</p>
              </div>
              <div className="problem-card">
                <div className="problem-icon-box"><DollarSign size={32} /></div>
                <h3>Double DC Costs</h3>
                <p>Returns cost you 2x Delivery Charges. We help you block these customers before you ever ship.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features / About */}
      <section id="about" className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>The E-Track Solution</h2>
            <p>Our shared database works like a credit score for e-commerce customers.</p>
          </div>
          <div className="features-grid">
            {[
              { icon: <Shield />, title: "Community Blacklist", desc: "Access verified data shared by hundreds of other sellers. Shared data means collective protection." },
              { icon: <Zap />, title: "Smart Risk Score", desc: "Get instant risk levels (Low, Medium, High) based on history across the entire network." },
              { icon: <TrendingDown />, title: "DC Protection", desc: "Our system identifies patterns before you ship, saving you up to 70% in delivery losses." },
              { icon: <MessageCircle />, title: "Expert Support", desc: "Need help dealing with a fraud customer? Our team is available 24/7 via live dashboard chat." }
            ].map((feature, i) => (
              <div key={i} className="glass feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="pricing-section">
        <div className="container">
          <div className="section-header">
            <h2>Plans for Every Growth Stage</h2>
            <p>14-day free trial on all plans. No credit card required.</p>
          </div>
          <div className="pricing-grid">
            {[
              { name: "Trial", price: "0", duration: "14 Days", features: ["Database Access", "Risk Lookups", "Support Chat"], btn: "Get Started" },
              { name: "Starter", price: "15,000", duration: "1 Month", features: ["Everything in Trial", "Priority Support", "Email Verify"], btn: "Buy Now" },
              { name: "Professional", price: "25,000", duration: "6 Months", features: ["Everything in Starter", "Advanced Insights", "Bulk Search"], btn: "Most Popular", featured: true },
              { name: "Enterprise", price: "50,000", duration: "1 Year", features: ["Everything in Prof", "Account Manager", "API Access"], btn: "Buy Now" }
            ].map((plan, i) => (
              <div key={i} className={`glass pricing-card ${plan.featured ? 'featured' : ''}`}>
                {plan.featured && <div className="popular-badge">MOST POPULAR</div>}
                <h3>{plan.name}</h3>
                <div className="price">
                  <span className="currency">Rs</span>
                  <span className="amount">{plan.price}</span>
                </div>
                <div className="period">{plan.duration}</div>
                <ul className="plan-list">
                  {plan.features.map((f, j) => <li key={j}><CheckCircle size={14} className="check" /> {f}</li>)}
                </ul>
                <Link to="/signup" className={`btn-${plan.featured ? 'primary' : 'outline'} full-width`}>{plan.btn}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="contact-section">
        <div className="container">
          <div className="glass contact-container">
            <div className="contact-info">
              <h2>Ready to protect your store?</h2>
              <p>Fill out the form and our team will get back to you within 24 hours.</p>
            </div>
            <form className="contact-form">
              <div className="input-row">
                <input type="text" placeholder="Name" required />
                <input type="email" placeholder="Store Email" required />
              </div>
              <textarea placeholder="Tell us about your store's return issues..." rows="4" required></textarea>
              <button className="btn-primary">Send Message</button>
            </form>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2026 E-Track PK. Built for Pakistani Entrepreneurs.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
