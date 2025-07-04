import React, { useState } from 'react';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  date: string;
  imageUrl: string;
  blogUrl: string;
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'Exploring Sigiriya: The Lion Rock Fortress',
    content: 'Discover the ancient rock fortress of Sigiriya, a UNESCO World Heritage Site with stunning frescoes and panoramic views.',
    date: '2025-06-01',
    imageUrl: 'https://source.unsplash.com/400x300/?sigiriya',
    blogUrl: 'https://www.theworldtravelguy.com/sigiriya-rock-fortress-sri-lanka/',
  },
  {
    id: 2,
    title: 'Kandy’s Cultural Charm: Temple of the Tooth',
    content: 'Immerse yourself in Kandy’s spiritual heart, home to the sacred Temple of the Tooth and vibrant cultural festivals.',
    date: '2025-06-02',
    imageUrl: 'https://source.unsplash.com/400x300/?kandy',
    blogUrl: 'https://www.nomadicmatt.com/travel-guides/sri-lanka-travel-tips/kandy/',
  },
  {
    id: 3,
    title: 'Galle Fort: A Journey Through History',
    content: 'Explore the colonial charm of Galle Fort, with its cobblestone streets and historic architecture.',
    date: '2025-06-03',
    imageUrl: 'https://source.unsplash.com/400x300/?galle',
    blogUrl: 'https://www.saltinourhair.com/sri-lanka/galle-fort/',
  },
  {
    id: 4,
    title: 'Ella: Scenic Beauty in the Hill Country',
    content: 'Hike through Ella’s lush tea plantations and enjoy breathtaking views at Little Adam’s Peak.',
    date: '2025-06-04',
    imageUrl: 'https://source.unsplash.com/400x300/?ella',
    blogUrl: 'https://www.worldnomads.com/explore/southern-asia/sri-lanka/ella-guide',
  },
  {
    id: 5,
    title: 'Yala National Park: Wildlife Adventures',
    content: 'Embark on a safari in Yala to spot leopards, elephants, and exotic birds in their natural habitat.',
    date: '2025-06-05',
    imageUrl: 'https://source.unsplash.com/400x300/?yala',
    blogUrl: 'https://www.onthegotours.com/us/sri-lanka/guides/yala-national-park',
  },
  {
    id: 6,
    title: 'Mirissa: Whale Watching Paradise',
    content: 'Experience world-class whale watching and relax on the pristine beaches of Mirissa.',
    date: '2025-06-06',
    imageUrl: 'https://source.unsplash.com/400x300/?mirissa',
    blogUrl: 'https://www.theblondeabroad.com/mirissa-sri-lanka-travel-guide/',
  },
  {
    id: 7,
    title: 'Anuradhapura: Ancient City Wonders',
    content: 'Step back in time in Anuradhapura, exploring ancient stupas and sacred sites.',
    date: '2025-06-07',
    imageUrl: 'https://source.unsplash.com/400x300/?anuradhapura',
    blogUrl: 'https://www.roughguides.com/articles/anuradhapura-sri-lanka/',
  },
  {
    id: 8,
    title: 'Polonnaruwa: Ruins of a Medieval Kingdom',
    content: 'Discover the well-preserved ruins of Polonnaruwa, a testament to Sri Lanka’s rich history.',
    date: '2025-06-08',
    imageUrl: 'https://source.unsplash.com/400x300/?polonnaruwa',
    blogUrl: 'https://www.globeguide.ca/destination/polonnaruwa-sri-lanka/',
  },
  {
    id: 9,
    title: 'Nuwara Eliya: Tea Country Retreat',
    content: 'Visit Nuwara Eliya for its cool climate, colonial charm, and sprawling tea estates.',
    date: '2025-06-09',
    imageUrl: 'https://source.unsplash.com/400x300/?nuwara+eliya',
    blogUrl: 'https://www.talesofceylon.com/nuwara-eliya-guide/',
  },
  {
    id: 10,
    title: 'Unawatuna: Tropical Beach Bliss',
    content: 'Relax on Unawatuna’s golden sands and explore vibrant coral reefs.',
    date: '2025-06-10',
    imageUrl: 'https://source.unsplash.com/400x300/?unawatuna',
    blogUrl: 'https://www.neverendingfootsteps.com/unawatuna-sri-lanka-travel-guide/',
  },
];

const BlogSection: React.FC = () => {
  const [search, setSearch] = useState('');

  const filteredPosts = blogPosts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="blog-section py-16 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 text-center tracking-tight animate-[fadeIn_1s_ease-in-out]">
          Travel Blogs
        </h2>
        <div className="mb-8 max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search blog posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-full shadow-sm focus:ring-green-500 focus:border-green-500 transition duration-300"
          />
        </div>
        {filteredPosts.length === 0 ? (
          <p className="text-center text-gray-600 text-lg animate-[fadeIn_0.5s_ease-in-out]">
            No blog posts found. Try a different search term.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <div
                key={post.id}
                className="blog-post bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-[fadeIn_1s_ease-in-out] delay-[${index * 200}ms]"
              >
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found')}
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h3>
                  <p className="text-gray-500 text-sm mb-2">{post.date}</p>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.content}</p>
                  <a
                    href={post.blogUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
                  >
                    Read More
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogSection;