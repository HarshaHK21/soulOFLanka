import React, { useState, useRef, useEffect } from 'react';

interface ChatBotProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ isOpen, setIsOpen }) => {
  const [messages, setMessages] = useState<{ sender: 'user' | 'bot'; text: string }[]>([
    { sender: 'bot', text: 'Welcome to Soul of Sri Lanka! 🌴 I’m your tour planning assistant. Ask me about destinations, activities, food, culture, or transport!' },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Keyword-based response mapping (100 keywords)
  const keywordResponses: { [key: string]: string } = {
    // Destinations (30)
    sigiriya: 'Sigiriya’s Lion Rock is a UNESCO site with ancient frescoes. Climb early to avoid crowds! Want a day trip itinerary?',
    kandy: 'Kandy is home to the Temple of the Tooth and vibrant festivals. Interested in a cultural tour or nearby hikes?',
    galle: 'Galle Fort offers colonial charm and stunning sunsets. Shall I suggest beach activities nearby?',
    ella: 'Ella’s lush hills are perfect for hiking Little Adam’s Peak or visiting tea plantations. Need a nature itinerary?',
    yala: 'Yala National Park is famous for leopard safaris. Want tips for the best safari tours?',
    mirissa: 'Mirissa is ideal for whale watching and beach relaxation. Interested in water sports or nightlife?',
    anuradhapura: 'Anuradhapura’s ancient stupas are a must-see. Want a historical tour plan?',
    polonnaruwa: 'Polonnaruwa’s ruins showcase medieval Sri Lanka. Shall I include it in a cultural itinerary?',
    nuwaraeliya: 'Nuwara Eliya’s tea estates and cool climate are delightful. Interested in tea factory tours?',
    unawatuna: 'Unawatuna’s beaches are perfect for snorkeling. Want recommendations for beachside dining?',
    dambulla: 'Dambulla’s cave temples are a spiritual gem. Combine it with Sigiriya for a day trip?',
    arugambay: 'Arugam Bay is a surfing paradise. Need tips for surf schools or local stays?',
    trincomalee: 'Trincomalee’s beaches and temples are stunning. Interested in diving or cultural sites?',
    hortonplains: 'Horton Plains offers World’s End views. Want a hiking itinerary?',
    adamspeak: 'Adam’s Peak is a sacred pilgrimage site. Planning to climb during pilgrimage season?',
    hikkaduwa: 'Hikkaduwa’s coral reefs and nightlife are vibrant. Interested in snorkeling or party spots?',
    bentota: 'Bentota is great for water sports and river safaris. Want a beach adventure plan?',
    jaffna: 'Jaffna’s Tamil culture and islands are unique. Shall I suggest a northern tour?',
    colombo: 'Colombo blends urban vibes with history. Interested in markets or museums?',
    negombo: 'Negombo’s fish markets and beaches are near the airport. Need a quick stopover plan?',
    ratnapura: 'Ratnapura is the gem city. Want to explore gem mines or waterfalls?',
    matara: 'Matara’s coastal charm includes historic forts. Interested in southern beaches?',
    tangalle: 'Tangalle’s serene beaches are perfect for relaxation. Need a quiet getaway plan?',
    haputale: 'Haputale’s tea estates offer stunning views. Want a hill country itinerary?',
    badulla: 'Badulla’s waterfalls and history are captivating. Shall I include it in a tour?',
    ampara: 'Ampara’s wildlife and ancient sites are off the beaten path. Interested?',
    batticaloa: 'Batticaloa’s lagoons and singing fish are unique. Want a coastal tour?',
    kilinochchi: 'Kilinochchi offers northern cultural insights. Shall I plan a visit?',
    mannar: 'Mannar’s baobab trees and birdlife are fascinating. Interested in a tour?',
    pasikudah: 'Pasikudah’s shallow beaches are great for families. Need a beach plan?',

    // Activities (20)
    surfing: 'Arugam Bay and Hikkaduwa are top surfing spots. Want recommendations for surf schools?',
    hiking: 'Try Ella’s Little Adam’s Peak or Horton Plains for hiking. Need trail details?',
    safari: 'Yala and Udawalawe offer thrilling safaris. Interested in leopard or elephant spotting?',
    whale: 'Mirissa and Trincomalee are best for whale watching. Want seasonal tips?',
    snorkeling: 'Hikkaduwa and Unawatuna have vibrant coral reefs. Need snorkeling tour suggestions?',
    diving: 'Trincomalee and Hikkaduwa offer great dive sites. Interested in dive schools?',
    trekking: 'Knuckles Range or Adam’s Peak are trekking gems. Want a trekking itinerary?',
    cycling: 'Cycle through Polonnaruwa’s ruins or Ella’s hills. Need bike tour ideas?',
    birdwatching: 'Sinharaja Forest and Kumana are birdwatching havens. Interested?',
    kayaking: 'Bentota River or Kalpitiya lagoons are perfect for kayaking. Want a plan?',
    rafting: 'Kitulgala offers white-water rafting. Need adventure tour details?',
    camping: 'Camp in Yala or Horton Plains for a nature escape. Want camping tips?',
    yoga: 'Join yoga retreats in Mirissa or Bentota. Interested in wellness programs?',
    fishing: 'Negombo and Batticaloa are great for fishing. Need local guide suggestions?',
    photography: 'Ella and Sigiriya are photography hotspots. Want a photo tour plan?',
    kitesurfing: 'Kalpitiya is ideal for kitesurfing. Interested in lessons?',
    rockclimbing: 'Rock climbing in Ella or Knuckles is thrilling. Need a guide?',
    hotairballoon: 'Hot air ballooning over Dambulla is magical. Want booking tips?',
    caving: 'Explore caves in Ella or Ratnapura. Interested in a caving adventure?',
    wildlife: 'Spot wildlife in Wilpattu or Yala. Want a safari itinerary?',

    // Culture (20)
    culture: 'Sri Lanka’s culture shines in Kandy and Anuradhapura. Want a cultural tour?',
    temple: 'Visit the Temple of the Tooth or Dambulla caves. Need temple tour ideas?',
    festival: 'Kandy’s Esala Perahera is a must-see festival. Interested in dates?',
    heritage: 'Explore UNESCO sites like Sigiriya and Polonnaruwa. Want a heritage itinerary?',
    history: 'Anuradhapura and Polonnaruwa are rich in history. Need a historical tour?',
    buddhism: 'Visit sacred Buddhist sites in Kandy or Mihintale. Interested?',
    hinduism: 'Jjffna’s Nallur Kandaswamy Temple is vibrant. Want a cultural plan?',
    dance: 'Experience Kandyan dance in Kandy. Need performance schedules?',
    music: 'Traditional music is lively at cultural shows. Want event suggestions?',
    art: 'See local art in Colombo’s galleries. Interested in art tours?',
    architecture: 'Galle Fort’s colonial architecture is stunning. Want a tour?',
    rituals: 'Witness Buddhist rituals at Anuradhapura. Need a cultural guide?',
    crafts: 'Explore handicrafts in Kandy markets. Want shopping tips?',
    traditions: 'Learn about Sinhala traditions in Kandy. Interested in festivals?',
    vesak: 'Vesak’s lantern festivals are magical. Want to plan a visit?',
    perahera: 'The Esala Perahera in Kandy is iconic. Need details?',
    tamil: 'Jaffna’s Tamil culture is unique. Want a northern tour?',
    sinhala: 'Sinhala New Year celebrations are vibrant. Interested?',
    ayurveda: 'Try Ayurvedic treatments in Bentota. Need spa recommendations?',
    meditation: 'Join meditation retreats in Kandy. Interested in wellness?',

    // Food (15)
    food: 'Sri Lankan cuisine is spicy and diverse. Try rice and curry! Want food tour ideas?',
    curry: 'Rice and curry is a staple. Need restaurant recommendations?',
    kottu: 'Kottu roti is a street food favorite. Want to find the best spots?',
    hoppers: 'Hoppers are crispy pancakes. Try them in Colombo! Interested?',
    seafood: 'Fresh seafood in Negombo and Mirissa is delicious. Want dining tips?',
    tea: 'Nuwara Eliya’s Ceylon tea is world-famous. Need tea-tasting tours?',
    coconut: 'Coconut-based dishes are everywhere. Want recipe ideas?',
    spices: 'Sri Lanka’s spices are vibrant. Interested in a spice garden tour?',
    polos: 'Polos curry (jackfruit) is a must-try. Need vegetarian food spots?',
    sambol: 'Coconut sambol adds spice to meals. Want local dining suggestions?',
    roti: 'Paratha roti is a street food gem. Interested in food stalls?',
    kiribath: 'Kiribath (milk rice) is a festive dish. Want to try it?',
    watalappan: 'Watalappan is a sweet dessert. Need dessert recommendations?',
    pittu: 'Pittu is a steamed rice dish. Interested in breakfast spots?',
    stringhoppers: 'String hoppers are a breakfast favorite. Want recipes?',

    // Transport (15)
    transport: 'Tuk-tuks, trains, and buses are popular. Need transport tips?',
    train: 'The Ella to Kandy train ride is scenic. Want booking advice?',
    tuktuk: 'Tuk-tuks are fun for short trips. Need driver contacts?',
    bus: 'Buses are affordable for intercity travel. Want routes?',
    taxi: 'Taxis are convenient in Colombo. Need reliable services?',
    car: 'Renting a car offers flexibility. Interested in car rentals?',
    bike: 'Bikes are great for exploring Ella. Want rental tips?',
    scooter: 'Scooters are popular in coastal areas. Need suggestions?',
    ferry: 'Ferries connect Mannar and Jaffna. Interested in schedules?',
    flight: 'Domestic flights link Colombo to Ratnapura. Need info?',
    walking: 'Walking tours in Galle Fort are charming. Want a guide?',
    driver: 'Hire a driver for a custom tour. Interested in contacts?',
    publictransport: 'Public transport is budget-friendly. Need tips?',
    airport: 'Colombo’s airport is the main hub. Need transfer options?',
    trainstation: 'Kandy and Colombo have major stations. Want schedules?',

    // Fallback
    default: 'I’m here to help plan your Sri Lanka adventure! Try asking about destinations (e.g., Sigiriya), activities (e.g., surfing), food (e.g., kottu), or transport (e.g., train). You said: "{input}".',
  };

  // Comprehensive list of keywords (100 total)
  const keywords = Object.keys(keywordResponses).filter((key) => key !== 'default');

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase().trim();
    
    // Find the first matching keyword
    const matchedKeyword = keywords.find((keyword) => input.includes(keyword));
    
    if (matchedKeyword) {
      return keywordResponses[matchedKeyword].replace('{input}', input);
    }

    // Fallback response
    return keywordResponses.default.replace('{input}', input);
  };

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { sender: 'user', text: input }]);
      setMessages((prev) => [...prev, { sender: 'bot', text: getBotResponse(input) }]);
      setInput('');
    }
  };

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-500 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex flex-col h-full bg-gradient-to-b from-green-50 to-white">
        {/* ChatBot Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <h3 className="text-lg font-bold tracking-tight">Sri Lanka Tour Assistant</h3>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-yellow-300 focus:outline-none transition-colors duration-200"
            aria-label="Close ChatBot"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-[fadeIn_0.5s_ease-in-out]`}
            >
              <div
                className={`max-w-[75%] p-3 rounded-lg shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-green-100 text-gray-900 border border-green-200'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 border-gray-300 rounded-full p-3 focus:ring-green-500 focus:border-green-500 transition duration-200"
              placeholder="Ask about destinations, activities, food, or more..."
            />
            <button
              onClick={handleSend}
              className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-full hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;