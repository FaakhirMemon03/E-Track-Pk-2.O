import React from 'react';
import { Shield, Zap, TrendingDown, MessageCircle, AlertCircle, PhoneOff, XCircle, DollarSign, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="bg-slate-950 text-white selection:bg-indigo-500/30">
      {/* Hero Section */}
      <header className="relative pt-40 pb-24 overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.1),transparent_50%)] pointer-events-none"></div>
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold tracking-wider mb-8">
              TRUSTED BY 500+ PAKISTANI STORES
            </div>
            <h1 className="text-5xl lg:text-7xl font-black leading-tight mb-8">
              Stop Losing Money on <br/>
              <span className="bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">COD Returns</span>
            </h1>
            <p className="text-xl text-slate-400 mb-10 leading-relaxed max-w-xl">
              Identify high-risk customers who repeatedly cancel orders or refuse calls. 
              Reduce your delivery charges (DC) and boost your profits today.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/signup" className="btn-primary">Start 14-Day Free Trial</Link>
              <a href="#about" className="btn-outline">How it works</a>
            </div>
          </div>
          <div className="relative animate-fade-in group">
            <div className="absolute -inset-4 bg-indigo-500/10 blur-3xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="glass p-4 rounded-3xl relative overflow-hidden">
              <img src="/hero.png" alt="E-Track Dashboard" className="w-full rounded-2xl shadow-2xl" onError={(e) => e.target.style.display='none'} />
              <div className="p-8 space-y-6">
                <div className="h-6 w-1/3 bg-white/5 rounded-lg animate-pulse"></div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-20 bg-white/5 rounded-xl animate-pulse"></div>
                  <div className="h-20 bg-white/5 rounded-xl animate-pulse"></div>
                  <div className="h-20 bg-white/5 rounded-xl animate-pulse"></div>
                </div>
                <div className="h-40 w-full bg-white/5 rounded-xl animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* The Problem Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="glass p-12 lg:p-20 rounded-[40px] border-red-500/10">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="flex items-center justify-center gap-2 text-red-400 text-xs font-black tracking-widest mb-4 uppercase">
                <AlertCircle size={14} /> THE REALITY
              </span>
              <h2 className="text-3xl lg:text-5xl font-black mb-6">Why Online Stores in Pakistan Struggle</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center group">
                <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-500 group-hover:scale-110 transition-transform">
                  <PhoneOff size={32} />
                </div>
                <h3 className="text-xl font-bold mb-4">Calls Not Received</h3>
                <p className="text-slate-400 leading-relaxed">Customers place orders but disappear during delivery attempts. Every "No Answer" is money out of your pocket.</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-500 group-hover:scale-110 transition-transform">
                  <XCircle size={32} />
                </div>
                <h3 className="text-xl font-bold mb-4">Doorstep Refusal</h3>
                <p className="text-slate-400 leading-relaxed">Orders are cancelled right at the doorstep. You pay for shipping both ways while the customer loses nothing.</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-500 group-hover:scale-110 transition-transform">
                  <DollarSign size={32} />
                </div>
                <h3 className="text-xl font-bold mb-4">Double DC Costs</h3>
                <p className="text-slate-400 leading-relaxed">Returns cost you 2x Delivery Charges. We help you block these customers before you ever ship.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features / About */}
      <section id="about" className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl lg:text-5xl font-black mb-6">The E-Track Solution</h2>
            <p className="text-xl text-slate-400">Our shared database works like a credit score for e-commerce customers.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Shield />, title: "Community Blacklist", desc: "Access verified data shared by hundreds of other sellers. Shared data means collective protection." },
              { icon: <Zap />, title: "Smart Risk Score", desc: "Get instant risk levels (Low, Medium, High) based on history across the entire network." },
              { icon: <TrendingDown />, title: "DC Protection", desc: "Our system identifies patterns before you ship, saving you up to 70% in delivery losses." },
              { icon: <MessageCircle />, title: "Expert Support", desc: "Need help dealing with a fraud customer? Our team is available 24/7 via live dashboard chat." }
            ].map((feature, i) => (
              <div key={i} className="glass p-10 rounded-3xl hover:-translate-y-2 transition-all duration-300">
                <div className="text-indigo-400 mb-6">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl lg:text-5xl font-black mb-6">Plans for Every Growth Stage</h2>
            <p className="text-xl text-slate-400">14-day free trial on all plans. No credit card required.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
            {[
              { name: "Trial", price: "0", duration: "14 Days", features: ["Database Access", "Risk Lookups", "Support Chat"], btn: "Get Started" },
              { name: "Starter", price: "15,000", duration: "1 Month", features: ["Everything in Trial", "Priority Support", "Email Verify"], btn: "Buy Now" },
              { name: "Professional", price: "25,000", duration: "6 Months", features: ["Everything in Starter", "Advanced Insights", "Bulk Search"], btn: "Most Popular", featured: true },
              { name: "Enterprise", price: "50,000", duration: "1 Year", features: ["Everything in Prof", "Account Manager", "API Access"], btn: "Buy Now" }
            ].map((plan, i) => (
              <div key={i} className={`glass p-10 rounded-[32px] flex flex-col relative ${plan.featured ? 'border-indigo-500/50 bg-indigo-500/5' : ''}`}>
                {plan.featured && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white px-4 py-1 rounded-full text-[10px] font-black tracking-widest">MOST POPULAR</div>}
                <h3 className="text-lg font-bold mb-8 uppercase tracking-widest text-slate-400">{plan.name}</h3>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-xl font-bold text-slate-400">Rs</span>
                  <span className="text-5xl font-black">{plan.price}</span>
                </div>
                <div className="text-sm text-slate-500 mb-10">{plan.duration}</div>
                <ul className="space-y-4 mb-12 flex-1">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-slate-300 text-sm">
                      <CheckCircle size={16} className="text-emerald-400" /> {f}
                    </li>
                  ))}
                </ul>
                <Link to="/signup" className={`${plan.featured ? 'btn-primary' : 'btn-outline'} w-full`}>{plan.btn}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24">
        <div className="container mx-auto px-6">
          <div className="glass p-12 lg:p-20 rounded-[40px] grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-black mb-6 leading-tight">Ready to protect your store?</h2>
              <p className="text-xl text-slate-400">Fill out the form and our team will get back to you within 24 hours.</p>
            </div>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <input type="text" placeholder="Name" className="input-field" required />
                <input type="email" placeholder="Store Email" className="input-field" required />
              </div>
              <textarea placeholder="Tell us about your store's return issues..." rows="4" className="input-field" required></textarea>
              <button className="btn-primary w-full py-4 text-lg">Send Message</button>
            </form>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-white/5 text-center text-slate-500 text-sm">
        <div className="container mx-auto px-6">
          <p>&copy; 2026 E-Track PK. Built for Pakistani Entrepreneurs.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
