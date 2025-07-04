import React from 'react';

interface Testimonial {
  id: number;
  name: string;
  quote: string;
  rating: number;
  avatar?: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Emma Thompson',
    quote: 'Exploring Sri Lanka with this platform was a breeze! The Activity Map helped us discover Sigiriya, and the booking process was seamless.',
    rating: 5,
    avatar: 'https://source.unsplash.com/100x100/?portrait,traveler',
  },
  {
    id: 2,
    name: 'Ravi Patel',
    quote: 'The ChatBot was a lifesaver, suggesting a perfect itinerary for Kandy and Ella. Highly recommend for first-time visitors!',
    rating: 4,
    avatar: 'https://source.unsplash.com/100x100/?portrait,man',
  },
  {
    id: 3,
    name: 'Sophie Nguyen',
    quote: 'Booking our stay at Cinnamon Grand Colombo was so easy, and the Blog Section inspired our Galle Fort visit. Amazing experience!',
    rating: 5,
    avatar: 'https://source.unsplash.com/100x100/?portrait,woman',
  },
  {
    id: 4,
    name: 'Liam Brown',
    quote: 'The Activity Map made it simple to plan our Yala safari. The interface is user-friendly, and the visuals are stunning!',
    rating: 4,
    avatar: 'https://source.unsplash.com/100x100/?portrait,adventure',
  },
  {
    id: 5,
    name: 'Anika Sharma',
    quote: 'Loved the cultural tips from the ChatBot for Anuradhapura. The platform made our trip unforgettable!',
    rating: 5,
    avatar: 'https://source.unsplash.com/100x100/?portrait,indian',
  },
  {
    id: 6,
    name: 'Carlos Mendes',
    quote: 'From Mirissa’s beaches to Nuwara Eliya’s tea estates, this app guided us perfectly. The testimonials section is a great touch!',
    rating: 5,
    avatar: 'https://source.unsplash.com/100x100/?portrait,traveler',
  },
];

const TestimonialSection: React.FC = () => {
  return (
    <section className="testimonial-section py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 text-center tracking-tight animate-[fadeIn_1s_ease-in-out]">
          What Our Travelers Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="testimonial-card bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-[fadeIn_1s_ease-in-out] delay-[${index * 200}ms]"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  {testimonial.avatar && (
                    <img
                      src={testimonial.avatar}
                      alt={`${testimonial.name}'s avatar`}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                      onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/100x100?text=Avatar')}
                    />
                  )}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{testimonial.name}</h3>
                    <div className="flex mt-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0L12.74 7.89l5.614.818c.882.129 1.236 1.213.596 1.832l-4.066 3.96.96 5.583c.151.879-.758 1.548-1.514 1.132L10 17.587l-5.014 2.636c-.756.416-1.665-.253-1.514-1.132l.96-5.583-4.066-3.96c-.64-.619-.286-1.703.596-1.832l5.614-.818L9.049 2.927z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm italic">"{testimonial.quote}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;