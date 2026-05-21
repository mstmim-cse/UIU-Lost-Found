const items = [
  {
    id: 1,
    title: "Black Leather Wallet",
    description: "Found a black leather wallet near the library entrance. Contains some cards but no ID.",
    type: "found", // lost, found, returned
    category: "Accessories",
    location: "Main Library",
    date: "2026-04-28",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    user: "John Doe"
  },
  {
    id: 2,
    title: "MacBook Pro Charger",
    description: "Lost my Apple 61W USB-C Power Adapter in Room 402, Building A.",
    type: "lost",
    category: "Electronics",
    location: "Building A, Room 402",
    date: "2026-04-29",
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    user: "Sarah Smith"
  },
  {
    id: 3,
    title: "Casio Scientific Calculator",
    description: "Found a Casio calculator on a bench near the cafeteria.",
    type: "found",
    category: "Electronics",
    location: "Cafeteria",
    date: "2026-04-27",
    image: "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    user: "Mike Johnson"
  },
  {
    id: 4,
    title: "Silver Ring",
    description: "Lost a silver ring with a small blue stone. Sentimental value.",
    type: "lost",
    category: "Jewelry",
    location: "Basketball Court",
    date: "2026-04-26",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b2548e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    user: "Emily Chen"
  },
  {
    id: 5,
    title: "Blue Water Bottle",
    description: "Found a blue thermoflask in the gym.",
    type: "returned",
    category: "Others",
    location: "Gym",
    date: "2026-04-25",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    user: "Alex Wong"
  },
  {
    id: 6,
    title: "Keys with UIU Lanyard",
    description: "Lost my keys attached to a UIU lanyard.",
    type: "lost",
    category: "Keys",
    location: "Unknown",
    date: "2026-04-29",
    image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    user: "David Lee"
  },
  {
    id: 7,
    title: "UIU Student ID Card",
    description: "Found a student ID card near the main campus lobby. The name on the card is 'Jane Smith'. Please contact me to verify your ID number and collect it.",
    type: "found",
    category: "Others",
    location: "Main Lobby",
    date: "2026-05-19",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    user: "Mst. Mim"
  },
  {
    id: 8,
    title: "Green Umbrella",
    description: "Lost a green umbrella near the cafeteria during the heavy rain.",
    type: "lost",
    category: "Umbrella",
    location: "Cafeteria",
    date: "2026-03-15",
    image: "https://images.unsplash.com/photo-1559092415-4c0792db87dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    user: "Robert Fox"
  },
  {
    id: 9,
    title: "Wireless Earbuds",
    description: "Found a pair of black wireless earbuds in the library study area.",
    type: "found",
    category: "Earphones",
    location: "Main Library",
    date: "2026-02-28",
    image: "https://images.unsplash.com/photo-1572569533902-3e0f44e0f0a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    user: "Alice Johnson"
  }
];

const notifications = [
  {
    id: 1,
    text: "Someone commented on your post 'MacBook Pro Charger'",
    time: "2 mins ago",
    unread: true
  },
  {
    id: 2,
    text: "A new 'Electronics' item was found near 'Building A'",
    time: "1 hour ago",
    unread: true
  },
  {
    id: 3,
    text: "Your claimed item 'Blue Water Bottle' has been approved",
    time: "1 day ago",
    unread: false
  }
];
