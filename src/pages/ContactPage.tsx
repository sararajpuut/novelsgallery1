import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, MapPin, Phone, MessageSquare } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ContactPage: React.FC = () => {
  const { siteSettings } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setName('');
    setEmail('');
    setMessage('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-2">
        <span className="text-xs uppercase tracking-widest font-semibold text-[#C8A45D]">
          Get in Touch
        </span>
        <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#173F35]">
          Contact & Writer Submissions
        </h1>
        <p className="font-urdu text-base text-[#4A3025] font-semibold">
          ہم سے رابطہ کریں — مصنفین کی تخلیقات اور عام سوالات کا خیر مقدم ہے
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact info cards */}
        <div className="space-y-4 md:col-span-1">
          <div className="p-5 bg-white rounded-xl border border-[#173F35]/15 space-y-2 shadow-xs">
            <Mail className="w-5 h-5 text-[#C8A45D]" />
            <h4 className="font-serif-display font-bold text-[#173F35] text-sm">Editorial Desk</h4>
            <p className="text-xs text-[#6B6B6B]">{siteSettings.contactEmail}</p>
          </div>

          <div className="p-5 bg-white rounded-xl border border-[#173F35]/15 space-y-2 shadow-xs">
            <MessageSquare className="w-5 h-5 text-[#C8A45D]" />
            <h4 className="font-serif-display font-bold text-[#173F35] text-sm">Writer Submissions</h4>
            <p className="text-xs text-[#6B6B6B]">
              Aspiring novelists can submit chapter manuscripts in InPage or Unicode Urdu format.
            </p>
          </div>

          <div className="p-5 bg-white rounded-xl border border-[#173F35]/15 space-y-2 shadow-xs">
            <MapPin className="w-5 h-5 text-[#C8A45D]" />
            <h4 className="font-serif-display font-bold text-[#173F35] text-sm">Location</h4>
            <p className="text-xs text-[#6B6B6B]">Mall Road Literary Quarter, Lahore, Pakistan</p>
          </div>
        </div>

        {/* Form */}
        <div className="md:col-span-2 bg-white p-6 sm:p-8 rounded-xl border border-[#173F35]/15 shadow-xs">
          {submitted && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Thank you for contacting Novels Gallery! Our editorial team will review your message shortly.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#252525] font-semibold mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Asad Rizvi"
                  className="w-full p-2.5 bg-[#F8F4EA] border border-[#173F35]/20 rounded-md text-xs text-[#252525] focus:outline-none focus:ring-1 focus:ring-[#173F35]"
                />
              </div>

              <div>
                <label className="block text-[#252525] font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full p-2.5 bg-[#F8F4EA] border border-[#173F35]/20 rounded-md text-xs text-[#252525] focus:outline-none focus:ring-1 focus:ring-[#173F35]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#252525] font-semibold mb-1">Inquiry Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-2.5 bg-[#F8F4EA] border border-[#173F35]/20 rounded-md text-xs text-[#252525] focus:outline-none focus:ring-1 focus:ring-[#173F35]"
              >
                <option value="General Inquiry">General Inquiry</option>
                <option value="Novel Submission">Novel Submission (Author Manuscript)</option>
                <option value="Copyright or DMCA">Copyright / DMCA License Query</option>
                <option value="Technical Support">Technical Reader Support</option>
              </select>
            </div>

            <div>
              <label className="block text-[#252525] font-semibold mb-1">Your Message or Novel Synopsis</label>
              <textarea
                rows={5}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your inquiry, feedback, or brief novel description..."
                className="w-full p-2.5 bg-[#F8F4EA] border border-[#173F35]/20 rounded-md text-xs text-[#252525] focus:outline-none focus:ring-1 focus:ring-[#173F35]"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-[#173F35] hover:bg-[#12322a] text-[#F8F4EA] font-semibold rounded-md flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Message</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
