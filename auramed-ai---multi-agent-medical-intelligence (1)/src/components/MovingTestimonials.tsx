import React from 'react';
import { Star, Quote } from 'lucide-react';

export const MovingTestimonials: React.FC = () => {
  const sampleFeedbacks = [
    {
      id: 1,
      name: "Kevin",
      role: "User",
      quote: "Sample feedback: The simplified report makes a complicated medical document much easier to understand.",
      rating: 5
    },
    {
      id: 2,
      name: "Ayush",
      role: "User",
      quote: "Sample feedback: I like how the important results and medications are clearly separated.",
      rating: 5
    },
    {
      id: 3,
      name: "Devansh",
      role: "User",
      quote: "Sample feedback: The easy-to-read report makes it much simpler to understand what my medical report is saying.",
      rating: 5
    }
  ];

  // Repeat for smooth marquee
  const marqueeCards = [...sampleFeedbacks, ...sampleFeedbacks, ...sampleFeedbacks];

  return (
    <section id="testimonials" className="relative py-24 bg-[#fef6f9] border-b border-pink-100/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-pink-200/80 text-[#6b5e7a] text-xs font-mono mb-4 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
          <span className="font-semibold text-pink-700">USER EXPERIENCE · SAMPLE FEEDBACK</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1e1b2e]">
          What Users Say About MedRep AI
        </h2>
        <p className="mt-3 text-sm sm:text-base text-[#6b5e7a]">
          Sample user feedback — demo content.
        </p>
      </div>

      {/* Infinite Horizontal Marquee Moving Cards Container */}
      <div className="relative w-full overflow-hidden py-4">
        {/* Edge gradient masks */}
        <div className="absolute left-0 inset-y-0 w-28 bg-gradient-to-r from-[#fef6f9] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 inset-y-0 w-28 bg-gradient-to-l from-[#fef6f9] to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee flex gap-6 px-4">
          {marqueeCards.map((card, idx) => (
            <div
              key={idx}
              className="w-[340px] sm:w-[380px] shrink-0 bg-white hover:bg-[#fff9fb] rounded-3xl p-6 sm:p-7 border border-pink-100/90 hover:border-pink-300 shadow-xs hover:shadow-lg hover:shadow-pink-100/60 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Quote icon & Star rating */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-9 h-9 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-500">
                    <Quote className="w-4 h-4 fill-current" />
                  </div>

                  <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60 text-xs font-mono text-amber-900 font-bold">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>5.0</span>
                  </div>
                </div>

                {/* Quote */}
                <p className="text-[#1e1b2e] text-sm leading-relaxed">
                  "{card.quote}"
                </p>
              </div>

              {/* Author */}
              <div className="mt-6 pt-4 border-t border-pink-50 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#1e1b2e]">{card.name}</h4>
                  <span className="text-[10px] text-[#a89bb8]">{card.role}</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">Sample Feedback</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
