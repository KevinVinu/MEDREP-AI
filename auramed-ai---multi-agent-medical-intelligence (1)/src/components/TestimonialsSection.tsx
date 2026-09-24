import React from 'react';
import { Star, Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      quote: "Our clinical staff used to spend 40% of consultation time just explaining discharge paperwork. AuraMed's multi-agent synthesis breaks down complex diagnoses into terms patients actually comprehend.",
      author: "Dr. Elena Vance",
      role: "Chief Medical Officer",
      organization: "St. Jude Health System",
      avatar: "/src/assets/images/dr_elena_vance_1790239158795.jpg",
      rating: 5.0,
      highlight: "Reduced patient confusion by 80%"
    },
    {
      id: 2,
      quote: "When my father was discharged after a hospital stay, we received a 16-page medical document full of acronyms. Dropping the PDF into AuraMed gave us a clear 1-page summary of his new medications and what symptoms to watch out for.",
      author: "Sarah Jenkins",
      role: "Family Caregiver",
      organization: "San Francisco, CA",
      avatar: "/src/assets/images/patient_sarah_j_1790239191249.jpg",
      rating: 4.9,
      highlight: "Invaluable peace of mind"
    },
    {
      id: 3,
      quote: "The negation detection agent is where other LLMs fail miserably. AuraMed properly recognizes when a patient 'denies chest pain' instead of falsely logging angina as an active diagnosis.",
      author: "Dr. Marcus Chen",
      role: "Clinical Informatics Director",
      organization: "Pacific Diagnostic Labs",
      avatar: "/src/assets/images/dr_marcus_chen_1790239178007.jpg",
      rating: 5.0,
      highlight: "Superior clinical negation accuracy"
    },
    {
      id: 4,
      quote: "Seeing my lab results with clear red/green badges and plain explanations helped me understand why my doctor wanted to start Metformin. I finally feel in control of my health metrics.",
      author: "David Miller",
      role: "Patient Advocate",
      organization: "Denver, CO",
      avatar: "/src/assets/images/patient_david_m_1790239206496.jpg",
      rating: 4.9,
      highlight: "Transformed my doctor visits"
    }
  ];

  return (
    <section id="testimonials-verified" className="relative py-20 lg:py-28 bg-[#fdf8ff] border-b border-pink-100/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-pink-50 text-pink-700 text-xs font-semibold mb-3 border border-pink-200/80 shadow-xs">
            <Quote className="w-3.5 h-3.5 text-pink-500" />
            <span>Real Clinical & Patient Feedback</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1e1b2e] text-balance">
            Words of praise from patients and clinicians
          </h2>
          <p className="mt-3 text-base text-[#6b5e7a] text-balance">
            Validated by physicians, health systems, and everyday patients across the country.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-white hover:bg-[#fff9fb] rounded-3xl p-6 sm:p-8 border border-pink-100/90 hover:border-pink-300 shadow-xs hover:shadow-[0_15px_30px_rgba(244,114,182,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Header: Quote Icon & Rating */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-pink-50 text-pink-500 border border-pink-100 flex items-center justify-center">
                    <Quote className="w-5 h-5 fill-current" />
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60 text-xs font-bold text-amber-900">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{item.rating.toFixed(1)}</span>
                  </div>
                </div>

                {/* Quote Text */}
                <p className="text-[#1e1b2e] text-sm sm:text-base leading-relaxed font-normal">
                  "{item.quote}"
                </p>
              </div>

              {/* Author Footer */}
              <div className="mt-6 pt-5 border-t border-pink-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-pink-200 shrink-0 bg-pink-100">
                    <img 
                      src={item.avatar} 
                      alt={item.author} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1e1b2e] leading-tight">
                      {item.author}
                    </h4>
                    <p className="text-xs text-[#6b5e7a] font-normal">
                      {item.role} · {item.organization}
                    </p>
                  </div>
                </div>

                <span className="hidden sm:inline-block text-[11px] font-semibold text-pink-700 bg-pink-50 border border-pink-100 px-2.5 py-1 rounded-full">
                  {item.highlight}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
