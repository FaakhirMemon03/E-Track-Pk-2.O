import React from 'react';
import { Shield, Zap, TrendingDown, MessageCircle } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="container hero animate-fade">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px', alignItems: 'center' }}>
          <div>
            <h1>Stop Losing Money on <span style={{color: 'var(--primary)'}}>COD Returns</span></h1>
            <p>E-Track PK helps online stores identify high-risk customers who repeatedly cancel orders. Save on delivery charges and focus on real customers.</p>
            <div style={{ display: 'flex', gap: '15px' }}>
              <button className="btn-primary">Start Free Trial</button>
              <button className="btn-outline">How it works</button>
            </div>
          </div>
          <div className="glass premium-shadow" style={{ height: '400px', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="/hero.png" alt="Hero" style={{ width: '90%', borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }} onError={(e) => e.target.style.display='none'} />
            <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>[Hero Image Placeholder]</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="about" className="container">
        <h2>Why Choose E-Track PK?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', marginTop: '50px' }}>
          {[
            { icon: <Shield size={32} />, title: "Shared Blacklist", desc: "Access data from thousands of stores to identify problematic buyers." },
            { icon: <TrendingDown size={32} />, title: "Reduce Expenses", desc: "Drastically cut down on wasted delivery charges (DC)." },
            { icon: <Zap size={32} />, title: "Real-time Risk Score", desc: "Get instant Low, Medium, or High risk alerts for every order." },
            { icon: <MessageCircle size={32} />, title: "Direct Admin Chat", desc: "Get support anytime via our private live chat system." }
          ].map((feature, i) => (
            <div key={i} className="glass" style={{ padding: '30px', transition: 'transform 0.3s' }}>
              <div style={{ color: 'var(--primary)', marginBottom: '15px' }}>{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="container">
        <h2>Flexible Plans for Every Store</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', marginTop: '50px' }}>
          {[
            { name: "Free Trial", price: "0", duration: "14 Days", features: ["Full Database Access", "Risk Score Lookup", "Admin Chat"] },
            { name: "1 Month", price: "15,000", duration: "30 Days", features: ["Everything in Trial", "Email Verification", "Priority Support"] },
            { name: "6 Months", price: "25,000", duration: "180 Days", features: ["Best Value", "Advanced Analytics", "Exclusive Blacklist Access"] },
            { name: "1 Year", price: "50,000", duration: "365 Days", features: ["Ultimate Plan", "Dedicated Account Manager", "Early Access to AI Features"] }
          ].map((plan, i) => (
            <div key={i} className="glass premium-shadow" style={{ padding: '40px', textAlign: 'center', border: plan.name === '6 Months' ? '2px solid var(--primary)' : '1px solid var(--glass-border)' }}>
              <h3>{plan.name}</h3>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', margin: '20px 0' }}>Rs {plan.price}</div>
              <p style={{ marginTop: '-20px' }}>{plan.duration}</p>
              <ul style={{ listStyle: 'none', textAlign: 'left', marginBottom: '30px' }}>
                {plan.features.map((f, j) => <li key={j} style={{ marginBottom: '10px' }}>✓ {f}</li>)}
              </ul>
              <button className={plan.name === '6 Months' ? 'btn-primary' : 'btn-outline'} style={{ width: '100%' }}>Select Plan</button>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="container">
        <div className="glass" style={{ maxWidth: '600px', margin: '0 auto', padding: '50px' }}>
          <h2>Contact Us</h2>
          <form>
            <input type="text" placeholder="Your Name" />
            <input type="email" placeholder="Store Email" />
            <textarea placeholder="How can we help?" rows="5"></textarea>
            <button className="btn-primary" style={{ width: '100%' }}>Send Message</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
