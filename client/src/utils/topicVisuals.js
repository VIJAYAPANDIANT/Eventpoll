export const TOPIC_VISUALS = {
  Technology: {
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&q=80",
    color: "blue",
    icon: "💻"
  },
  Food: {
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=80",
    color: "orange",
    icon: "🍔"
  },
  Sports: {
    image: "https://images.unsplash.com/photo-1461896756970-49673447983d?w=500&q=80",
    color: "green",
    icon: "⚽"
  },
  Politics: {
    image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=500&q=80",
    color: "red",
    icon: "⚖️"
  },
  Music: {
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&q=80",
    color: "purple",
    icon: "🎵"
  },
  Work: {
    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=500&q=80",
    color: "cyan",
    icon: "💼"
  },
  Health: {
    image: "https://images.unsplash.com/photo-1505751172177-51ad18610432?w=500&q=80",
    color: "teal",
    icon: "🏥"
  },
  Education: {
    image: "https://images.unsplash.com/photo-1523050335392-93851179ae2c?w=500&q=80",
    color: "yellow",
    icon: "🎓"
  },
  Art: {
    image: "https://images.unsplash.com/photo-1460661419201-fd4cecea8f82?w=500&q=80",
    color: "pink",
    icon: "🎨"
  },
  Travel: {
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&q=80",
    color: "blue",
    icon: "✈️"
  },
  Science: {
    image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=500&q=80",
    color: "blue",
    icon: "🔬"
  },
  Business: {
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&q=80",
    color: "gray",
    icon: "🏢"
  },
  Fashion: {
    image: "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=500&q=80",
    color: "pink",
    icon: "👗"
  },
  Movies: {
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500&q=80",
    color: "orange",
    icon: "🎬"
  },
  Gaming: {
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&q=80",
    color: "purple",
    icon: "🎮"
  },
  Finance: {
    image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=500&q=80",
    color: "green",
    icon: "💰"
  },
  Default: {
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&q=80",
    color: "gray",
    icon: "📝"
  }
};

export const getTopicVisual = (topicName) => {
  if (!topicName) return TOPIC_VISUALS.Default;
  const normalized = topicName.charAt(0).toUpperCase() + topicName.slice(1).toLowerCase();
  return TOPIC_VISUALS[normalized] || TOPIC_VISUALS.Default;
};

export const SUGGESTED_TOPICS = Object.keys(TOPIC_VISUALS).filter(t => t !== "Default");
