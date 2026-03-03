import React, { useState, useEffect } from 'react';
import axios from 'axios';

// The interface remains the same
interface Testimonial {
  id: number;
  name: string;
  quote: string;
  rating: number;
  avatar?: string;
}

const TestimonialSection: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // This function fetches the data from your backend
    const fetchTestimonials = async () => {
      try {
        // We'll simulate a call to an API endpoint.
        // Replace '/api/testimonials' with your actual backend endpoint later.
        // const response = await axios.get('/api/testimonials');
        // setTestimonials(response.data);

        // For now, let's simulate the API response with a delay
        setTimeout(() => {
          const mockData: Testimonial[] = [
            {
              id: 1,
              name: 'Emma Thompson',
              quote: 'Exploring Sri Lanka with this platform was a breeze! The Activity Map helped us discover Sigiriya, and the booking process was seamless.',
              rating: 5,
              avatar: '/assets/avatar-1.jpg', // Using local assets now
            },
            {
              id: 2,
              name: 'Ravi Patel',
              quote: 'The ChatBot was a lifesaver, suggesting a perfect itinerary for Kandy and Ella. Highly recommend for first-time visitors!',
              rating: 4,
              avatar: '/assets/avatar-1.jpg',
            },
            {
              id: 3,
              name: 'Sophie Nguyen',
              quote: 'Booking our stay at Cinnamon Grand Colombo was so easy, and the Blog Section inspired our Galle Fort visit. Amazing experience!',
              rating: 5,
              avatar: '/assets/avatar-1.jpg',
            },
            {
              id: 4,
              name: 'Liam Brown',
              quote: 'The Activity Map made it simple to plan our Yala safari. The interface is user-friendly, and the visuals are stunning!',
              rating: 4,
              avatar: '/assets/avatar-1.jpg',
            },
          ];
          setTestimonials(mockData);
          setLoading(false);
        }, 1000); // 1-second delay to simulate network request
      } catch (err) {
        setError('Failed to load testimonials. Please try again later.');
        setLoading(false);
        console.error(err);
      }
    };

    fetchTestimonials();
  }, []); // The empty array [] ensures this runs only once when the component mounts

  if (loading) {
    return (
      <section className="testimonial-section py-16 bg-gradient-to-b from-white to-gray-50 text-center">
        <p className="text-gray-600">Loading testimonials...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="testimonial-section py-16 bg-gradient-to-b from-white to-gray-50 text-center">
        <p className="text-red-500">{error}</p>
      </section>
    );
  }

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
              className="testimonial-card bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-[fadeIn_1s_ease-in-out]"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  {testimonial.avatar && (
                    <img
                      src={testimonial.avatar}
                      alt={`${testimonial.name}'s avatar`}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                      onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/100x100?text=User')}
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