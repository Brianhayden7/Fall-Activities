import { useState } from 'react';
import { Search, Leaf, MapPin, Star, ArrowRight } from 'lucide-react';
import { fallActivities } from './data/activities';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Outdoor', 'Event', 'Food & Drink', 'Arts & Culture', 'Scenic Drive'];

  const filteredActivities = fallActivities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || activity.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-pumpkin to-squash text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">100 Fall Adventures</h1>
          <p className="text-xl md:text-2xl mb-8">Discover amazing fall activities across the country</p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search activities..."
                className="w-full px-4 py-3 pl-12 pr-4 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
          </div>
        </div>
      </header>

      {/* Category Filter */}
      <div className="bg-amber-100 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-pumpkin text-white'
                    : 'bg-white text-gray-800 hover:bg-amber-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 flex items-center">
          <Leaf className="mr-2 text-leaf" />
          {selectedCategory === 'All' ? 'All Fall Activities' : `${selectedCategory} Activities`}
        </h2>

        {filteredActivities.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No activities found. Try a different search term or category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredActivities.map((activity) => (
              <div key={activity.id} className="activity-card">
                <img 
                  src={activity.image} 
                  alt={activity.title} 
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://placehold.co/800x600/f59e0b/ffffff?text=${encodeURIComponent(activity.title)}`;
                  }}
                />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">{activity.title}</h3>
                    <div className="flex items-center bg-amber-100 text-amber-800 px-2 py-1 rounded text-sm">
                      <Star className="w-4 h-4 mr-1 fill-current" />
                      {activity.rating}
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-600 text-sm mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    {activity.location}
                  </div>
                  
                  <p className="text-gray-700 mb-4">{activity.description}</p>
                  
                  <div className="flex flex-wrap mb-4">
                    {activity.tags.map((tag) => (
                      <span key={tag} className="activity-tag">
                        {tag.replace('-', ' ')}
                      </span>
                    ))}
                  </div>
                  
                  <button className="btn btn-primary flex items-center">
                    View Details <ArrowRight className="ml-2 w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">100 Fall Adventures</h3>
              <p className="text-gray-400">Discover the best of fall across America</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-pumpkin transition-colors">About</a>
              <a href="#" className="hover:text-pumpkin transition-colors">Contact</a>
              <a href="#" className="hover:text-pumpkin transition-colors">Privacy Policy</a>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-800 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} 100 Fall Adventures. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
