import React from 'react';
import { BookOpen, Feather, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs uppercase tracking-widest font-semibold text-[#C8A45D]">
          About Our Sanctuary
        </span>
        <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#173F35]">
          Novels Gallery
        </h1>
        <p className="font-urdu text-xl text-[#4A3025] font-semibold">
          ناولز گیلری — اردو ادب کی ترویج، تحفظ اور جدید ترین ڈیجیٹل کتب خانہ
        </p>
      </div>

      <div className="bg-white rounded-xl border border-[#173F35]/15 p-6 sm:p-10 shadow-xs space-y-6 text-sm text-[#252525] leading-relaxed">
        <p>
          <strong>Novels Gallery</strong> is a premier digital reading sanctuary created to celebrate the rich, emotive, and profound legacy of Urdu literature. Inspired by the quiet dignity of classical private libraries, we combine traditional literary reverence with modern, distraction-free reading engineering.
        </p>

        <p>
          From contemporary serials by celebrated authors like Nemrah Ahmed and Umera Ahmed to the timeless poetic horizons of Mirza Ghalib, Allama Iqbal, and Saadat Hasan Manto, Novels Gallery brings readers an unblemished, authentic Nastaliq reading experience.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-[#EEE8D8]">
          <div className="space-y-2">
            <Feather className="w-6 h-6 text-[#C8A45D]" />
            <h4 className="font-serif-display font-bold text-[#173F35]">Authentic Urdu Typesetting</h4>
            <p className="text-xs text-[#6B6B6B]">
              Rigorous RTL and Nastaliq font scaling designed specifically for prolonged reading without visual fatigue.
            </p>
          </div>

          <div className="space-y-2">
            <ShieldCheck className="w-6 h-6 text-[#C8A45D]" />
            <h4 className="font-serif-display font-bold text-[#173F35]">Support for Urdu Writers</h4>
            <p className="text-xs text-[#6B6B6B]">
              Every premium subscription and chapter unlock directly respects writer royalties and intellectual property.
            </p>
          </div>

          <div className="space-y-2">
            <BookOpen className="w-6 h-6 text-[#C8A45D]" />
            <h4 className="font-serif-display font-bold text-[#173F35]">Heritage Preservation</h4>
            <p className="text-xs text-[#6B6B6B]">
              Free and open access to historical Urdu literature, afsanay, and poetry in the public domain.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-[#EEE8D8] space-y-4">
          <h3 className="font-serif-display text-lg font-bold text-[#173F35]">
            Copyright & DMCA Notice
          </h3>
          <p className="text-xs text-[#6B6B6B] leading-relaxed">
            Novels Gallery strictly honors the intellectual property rights of writers, translators, and publishers. If you are a copyright holder wishing to inquire about content serialization or claim rights, please contact our editorial desk at <strong className="text-[#173F35]">contact@novelsgallery.com</strong> for swift assistance.
          </p>
        </div>
      </div>
    </div>
  );
};
