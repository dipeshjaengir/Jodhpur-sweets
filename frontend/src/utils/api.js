const API_BASE = 'http://localhost:5000/api';

const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.warn(`API call failed for ${endpoint}. Falling back to simulation. Error:`, error.message);
    return simulateFallback(endpoint, options);
  }
};

// Seed product catalog array
const defaultProducts = [
  {
    id: "mawa-kachori",
    name: "Shahi Mawa Kachori",
    category: "sweets",
    isBestSeller: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 142,
    description: "Crispy golden-fried puff pastry stuffed with a rich, aromatic mixture of Mawa (milk solids), almonds, pistachios, and saffron, bathed in sugar syrup.",
    priceVariants: [
      { weight: "250g (4 Pcs)", price: 220, stock: 45 },
      { weight: "500g (8 Pcs)", price: 420, stock: 30 },
      { weight: "1kg (16 Pcs)", price: 800, stock: 15 }
    ],
    ingredients: ["Mawa (Khoya)", "Refined Wheat Flour", "Pure Ghee", "Almonds", "Pistachios", "Saffron", "Cardamom", "Sugar"],
    nutritionalInfo: { calories: "410 kcal", protein: "6g", carbohydrates: "54g", fat: "19g" },
    allergens: ["Gluten", "Milk", "Nuts"],
    shelfLife: "7 days. Keep in a cool, dry place.",
    image: "assets/images/mawa_kachori.jpg",
    tags: ["Rajasthani Sweets", "Mithai", "Saffron"]
  },
  {
    id: "pyaaz-kachori",
    name: "Jodhpuri Pyaaz Kachori",
    category: "namkeen",
    isBestSeller: true,
    isFeatured: true,
    rating: 4.8,
    reviewCount: 210,
    description: "Crispy outer crust made of refined flour, stuffed with a spicy, caramelized onion filling cooked with toasted fennel, coriander seeds, and local Rajasthani spices.",
    priceVariants: [
      { weight: "250g (4 Pcs)", price: 120, stock: 60 },
      { weight: "500g (8 Pcs)", price: 230, stock: 40 },
      { weight: "1kg (16 Pcs)", price: 440, stock: 20 }
    ],
    ingredients: ["Onions", "Refined Wheat Flour", "Gram Flour", "Spices", "Pure Ghee", "Salt"],
    nutritionalInfo: { calories: "290 kcal", protein: "4.5g", carbohydrates: "38g", fat: "13g" },
    allergens: ["Gluten"],
    shelfLife: "2 days. Reheat before serving.",
    image: "assets/images/pyaaz_kachori.jpg",
    tags: ["Jodhpuri Specials", "Namkeen", "Spicy"]
  },
  {
    id: "kaju-katli",
    name: "Premium Kaju Katli",
    category: "sweets",
    isBestSeller: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 389,
    description: "Crafted from the finest selected cashews, ground and slow-cooked in sugar syrup to create a melt-in-the-mouth texture, topped with edible silver foil (Vark).",
    priceVariants: [
      { weight: "250g", price: 300, stock: 100 },
      { weight: "500g", price: 580, stock: 80 },
      { weight: "1kg", price: 1100, stock: 50 }
    ],
    ingredients: ["Premium Cashew Nuts", "Sugar", "Water", "Pure Ghee", "Edible Silver Foil"],
    nutritionalInfo: { calories: "478 kcal", protein: "9.5g", carbohydrates: "58g", fat: "23g" },
    allergens: ["Nuts"],
    shelfLife: "30 days when stored in an airtight container.",
    image: "assets/images/kaju_katli.jpg",
    tags: ["Kaju Sweets", "Mithai", "Silver Foil"]
  },
  {
    id: "motichoor-ladoo",
    name: "Kesaria Motichoor Ladoo",
    category: "sweets",
    isBestSeller: false,
    isFeatured: true,
    rating: 4.7,
    reviewCount: 115,
    description: "Delicate pearls of gram flour fried in pure Desi Ghee, simmered in a saffron and cardamom syrup, and rolled with melon seeds into golden spheres.",
    priceVariants: [
      { weight: "250g", price: 180, stock: 70 },
      { weight: "500g", price: 340, stock: 50 },
      { weight: "1kg", price: 650, stock: 30 }
    ],
    ingredients: ["Gram Flour (Besan)", "Pure Desi Ghee", "Sugar", "Saffron", "Cardamom", "Melon Seeds"],
    nutritionalInfo: { calories: "385 kcal", protein: "5g", carbohydrates: "62g", fat: "14g" },
    allergens: ["Milk"],
    shelfLife: "10 days at room temperature.",
    image: "assets/images/motichoor_ladoo.jpg",
    tags: ["Rajasthani Sweets", "Mithai", "Ghee"]
  },
  {
    id: "shahi-samosa",
    name: "Shahi Paneer Samosa",
    category: "namkeen",
    isBestSeller: false,
    isFeatured: false,
    rating: 4.6,
    reviewCount: 98,
    description: "Crispy pastry pyramids filled with a royal mix of spiced mashed potatoes, fresh paneer cubes, green peas, raisins, and cashew bits, seasoned with dry mango powder.",
    priceVariants: [
      { weight: "250g (4 Pcs)", price: 100, stock: 80 },
      { weight: "500g (8 Pcs)", price: 190, stock: 50 },
      { weight: "1kg (16 Pcs)", price: 360, stock: 25 }
    ],
    ingredients: ["Refined Wheat Flour", "Potato", "Paneer", "Green Peas", "Cashews", "Raisins", "Spices", "Pure Ghee"],
    nutritionalInfo: { calories: "260 kcal", protein: "5g", carbohydrates: "30g", fat: "12g" },
    allergens: ["Gluten", "Milk", "Nuts"],
    shelfLife: "1 day. Consume fresh.",
    image: "assets/images/shahi_samosa.jpg",
    tags: ["Namkeen", "Samosa", "Spicy"]
  },
  {
    id: "kesar-pedha",
    name: "Royal Kesar Peda",
    category: "sweets",
    isBestSeller: false,
    isFeatured: false,
    rating: 4.8,
    reviewCount: 78,
    description: "Rich, dense sweets crafted from slow-cooked condensed milk (khoya) infused with Kashmiri saffron threads and green cardamom, stamped with traditional patterns.",
    priceVariants: [
      { weight: "250g", price: 200, stock: 60 },
      { weight: "500g", price: 380, stock: 40 },
      { weight: "1kg", price: 720, stock: 20 }
    ],
    ingredients: ["Milk Solids (Khoya)", "Sugar", "Saffron Threads", "Cardamom", "Pistachios"],
    nutritionalInfo: { calories: "415 kcal", protein: "8.2g", carbohydrates: "58g", fat: "17g" },
    allergens: ["Milk", "Nuts"],
    shelfLife: "15 days. Keep in a cool, dry place.",
    image: "assets/images/kesar_pedha.jpg",
    tags: ["Milk Sweets", "Mithai", "Saffron"]
  },
  {
    id: "gulab-jamun",
    name: "Shahi Mawa Gulab Jamun",
    category: "sweets",
    isBestSeller: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 189,
    description: "Plump, golden-brown spheres of soft mawa and paneer dough, deep fried in Desi Ghee and soaked in sugar syrup flavored with rosewater and saffron.",
    priceVariants: [
      { weight: "250g (6 Pcs)", price: 180, stock: 75 },
      { weight: "500g (12 Pcs)", price: 340, stock: 55 },
      { weight: "1kg (24 Pcs)", price: 650, stock: 25 }
    ],
    ingredients: ["Mawa (Khoya)", "Chenna (Cottage Cheese)", "Refined Flour", "Pure Ghee", "Sugar", "Rose Water", "Saffron"],
    nutritionalInfo: { calories: "320 kcal", protein: "5g", carbohydrates: "50g", fat: "11g" },
    allergens: ["Gluten", "Milk"],
    shelfLife: "10 days when refrigerated.",
    image: "assets/images/gulab_jamun.jpg",
    tags: ["Bengali Sweets", "Mithai", "Rosewater"]
  },
  {
    id: "bengali-rasgulla",
    name: "Kesar Bengali Rasgulla",
    category: "sweets",
    isBestSeller: false,
    isFeatured: true,
    rating: 4.8,
    reviewCount: 150,
    description: "Soft, spongy, cottage cheese dumplings, slow boiled in light sugar syrup and garnished with Kashmiri saffron.",
    priceVariants: [
      { weight: "500g (8 Pcs)", price: 200, stock: 50 },
      { weight: "1kg (16 Pcs)", price: 380, stock: 25 }
    ],
    ingredients: ["Chenna", "Sugar", "Saffron", "Cardamom", "Water"],
    nutritionalInfo: { calories: "186 kcal", protein: "4g", carbohydrates: "42g", fat: "1.8g" },
    allergens: ["Milk"],
    shelfLife: "7 days when refrigerated.",
    image: "assets/images/gulab_jamun.jpg",
    tags: ["Bengali Sweets", "Mithai", "Spongy"]
  },
  {
    id: "dryfruit-barfi",
    name: "Royal Dry Fruit Barfi",
    category: "sweets",
    isBestSeller: false,
    isFeatured: false,
    rating: 4.9,
    reviewCount: 85,
    description: "Sugar-free nutritional sweet made with almonds, cashews, pistachios, dates, and dried figs, shaped into bars.",
    priceVariants: [
      { weight: "250g", price: 350, stock: 40 },
      { weight: "500g", price: 680, stock: 30 },
      { weight: "1kg", price: 1300, stock: 15 }
    ],
    ingredients: ["Almonds", "Cashews", "Pistachios", "Dates", "Figs", "Pure Ghee"],
    nutritionalInfo: { calories: "520 kcal", protein: "11g", carbohydrates: "48g", fat: "29g" },
    allergens: ["Nuts"],
    shelfLife: "45 days.",
    image: "assets/images/motichoor_ladoo.jpg",
    tags: ["Dry Fruit Sweets", "Mithai", "Sugar-Free"]
  },
  {
    id: "rajasthani-bhujia",
    name: "Authentic Bikaneri Bhujia",
    category: "namkeen",
    isBestSeller: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 420,
    description: "Crispy savory noodle snack made of moth bean flour, gram flour, and ground spices. The pride of Rajasthan.",
    priceVariants: [
      { weight: "250g", price: 90, stock: 150 },
      { weight: "500g", price: 170, stock: 100 },
      { weight: "1kg", price: 320, stock: 50 }
    ],
    ingredients: ["Moth Bean Flour", "Gram Flour", "Pure Ghee", "Spices", "Salt"],
    nutritionalInfo: { calories: "540 kcal", protein: "12g", carbohydrates: "42g", fat: "36g" },
    allergens: ["Gluten"],
    shelfLife: "90 days.",
    image: "assets/images/shahi_samosa.jpg",
    tags: ["Bhujia", "Namkeen", "Crispy"]
  },
  {
    id: "lasun-sev",
    name: "Jodhpuri Lahsun Sev",
    category: "namkeen",
    isBestSeller: false,
    isFeatured: false,
    rating: 4.7,
    reviewCount: 110,
    description: "Crispy gram flour strings infused with fresh garlic pulp and hot red chili powder.",
    priceVariants: [
      { weight: "250g", price: 80, stock: 120 },
      { weight: "500g", price: 150, stock: 80 }
    ],
    ingredients: ["Gram Flour (Besan)", "Garlic Paste", "Mathania Chili Powder", "Pure Ghee", "Salt"],
    nutritionalInfo: { calories: "520 kcal", protein: "10g", carbohydrates: "44g", fat: "32g" },
    allergens: [],
    shelfLife: "60 days.",
    image: "assets/images/shahi_samosa.jpg",
    tags: ["Sev", "Namkeen", "Garlic"]
  },
  {
    id: "shahi-mixture",
    name: "Royal Shahi Mixture",
    category: "namkeen",
    isBestSeller: true,
    isFeatured: true,
    rating: 4.8,
    reviewCount: 195,
    description: "A sweet and savory mix of potato sticks, gram flour sev, roasted cashews, almonds, and raisins.",
    priceVariants: [
      { weight: "250g", price: 110, stock: 100 },
      { weight: "500g", price: 200, stock: 80 },
      { weight: "1kg", price: 380, stock: 40 }
    ],
    ingredients: ["Gram Flour", "Potato", "Cashews", "Almonds", "Raisins", "Pure Ghee", "Spices", "Salt"],
    nutritionalInfo: { calories: "535 kcal", protein: "9g", carbohydrates: "46g", fat: "33g" },
    allergens: ["Gluten", "Nuts"],
    shelfLife: "60 days.",
    image: "assets/images/shahi_samosa.jpg",
    tags: ["Mixture", "Namkeen", "Sweet & Savory"]
  },
  {
    id: "masala-papdi",
    name: "Crispy Masala Papdi",
    category: "namkeen",
    isBestSeller: false,
    isFeatured: false,
    rating: 4.6,
    reviewCount: 85,
    description: "Crispy, flat discs of spiced gram flour seasoned with carom seeds (Ajwain) and turmeric. Perfect teatime snack.",
    priceVariants: [
      { weight: "250g", price: 85, stock: 90 },
      { weight: "500g", price: 160, stock: 60 }
    ],
    ingredients: ["Gram Flour", "Pure Ghee", "Ajwain (Carom)", "Turmeric", "Salt", "Spices"],
    nutritionalInfo: { calories: "490 kcal", protein: "9.2g", carbohydrates: "48g", fat: "27g" },
    allergens: [],
    shelfLife: "45 days.",
    image: "assets/images/shahi_samosa.jpg",
    tags: ["Papdi", "Namkeen", "Teatime"]
  },
  {
    id: "methi-mathri",
    name: "Rajasthani Methi Mathri",
    category: "namkeen",
    isBestSeller: false,
    isFeatured: true,
    rating: 4.7,
    reviewCount: 130,
    description: "Flaky, deep-fried flour discs flavored with dried fenugreek leaves (Kasuri Methi) and crushed black pepper.",
    priceVariants: [
      { weight: "250g", price: 90, stock: 100 },
      { weight: "500g", price: 170, stock: 70 },
      { weight: "1kg", price: 320, stock: 40 }
    ],
    ingredients: ["Refined Wheat Flour", "Pure Ghee", "Kasuri Methi", "Black Pepper", "Ajwain", "Salt"],
    nutritionalInfo: { calories: "512 kcal", protein: "8.5g", carbohydrates: "50g", fat: "29g" },
    allergens: ["Gluten"],
    shelfLife: "60 days.",
    image: "assets/images/shahi_samosa.jpg",
    tags: ["Mathri", "Namkeen", "Methi"]
  },
  {
    id: "rajputana-hamper",
    name: "Royal Rajputana Gifting Hamper",
    category: "hampers",
    isBestSeller: true,
    isFeatured: true,
    rating: 5.0,
    reviewCount: 65,
    description: "Includes 250g Premium Kaju Katli, 250g Shahi Mawa Kachori, 200g Roasted Salted Cashews, and 200g Iranian Pistachios in a silk-gold box.",
    priceVariants: [
      { weight: "Standard Luxury Size", price: 1850, stock: 25 }
    ],
    ingredients: ["Assorted Sweets (Cashews, Milk, Ghee, Sugar)", "Salted Cashews", "Iranian Pistachios"],
    nutritionalInfo: { calories: "Variable", protein: "Variable", carbohydrates: "Variable", fat: "Variable" },
    allergens: ["Gluten", "Milk", "Nuts"],
    shelfLife: "15 days.",
    image: "assets/images/rajputana_hamper.jpg",
    tags: ["Wedding Hampers", "Gift Hampers", "Festivals"]
  },
  {
    id: "diwali-hamper",
    name: "Diwali Utsav Celebration Box",
    category: "hampers",
    isBestSeller: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 180,
    description: "Celebration box containing Kaju Katli, Kesar Peda, Bhujia, and two traditional terracotta diyas.",
    priceVariants: [
      { weight: "Festive Standard Box", price: 950, stock: 200 }
    ],
    ingredients: ["Cashews", "Milk Solids", "Gram Flour", "Spices", "Pure Ghee"],
    nutritionalInfo: { calories: "Variable", protein: "Variable", carbohydrates: "Variable", fat: "Variable" },
    allergens: ["Milk", "Nuts", "Gluten"],
    shelfLife: "15 days.",
    image: "assets/images/rajputana_hamper.jpg",
    tags: ["Festival Hampers", "Gift Hampers", "Diwali"]
  },
  {
    id: "corporate-hamper",
    name: "Elite Corporate Gratitude Hamper",
    category: "hampers",
    isBestSeller: false,
    isFeatured: false,
    rating: 4.8,
    reviewCount: 75,
    description: "Sophisticated corporate gift basket presenting dry fruit barfi, roasted salted almonds, and vacuum-packed spiced pistachios.",
    priceVariants: [
      { weight: "Corporate Box", price: 1450, stock: 150 }
    ],
    ingredients: ["Almonds", "Cashews", "Dates", "Pistachios", "Spices"],
    nutritionalInfo: { calories: "Variable", protein: "Variable", carbohydrates: "Variable", fat: "Variable" },
    allergens: ["Nuts"],
    shelfLife: "30 days.",
    image: "assets/images/rajputana_hamper.jpg",
    tags: ["Corporate Gifts", "Gift Hampers"]
  },
  {
    id: "gond-laddu",
    name: "Winter Special Gond Laddu",
    category: "hampers",
    isBestSeller: false,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 94,
    description: "Edible gum resin (Gond), wheat flour, Desi Ghee, dry fruits, and ginger powder winter wellness sweet spheres.",
    priceVariants: [
      { weight: "500g", price: 450, stock: 60 },
      { weight: "1kg", price: 850, stock: 30 }
    ],
    ingredients: ["Edible Gum", "Wheat Flour", "Desi Ghee", "Almonds", "Ginger", "Sugar"],
    nutritionalInfo: { calories: "485 kcal", protein: "6.8g", carbohydrates: "56g", fat: "24g" },
    allergens: ["Gluten", "Nuts"],
    shelfLife: "60 days.",
    image: "assets/images/motichoor_ladoo.jpg",
    tags: ["Seasonal Specials", "Mithai", "Gond"]
  },
  {
    id: "red-velvet-cake",
    name: "Royal Red Velvet Cake",
    category: "party",
    isBestSeller: true,
    isFeatured: true,
    rating: 4.8,
    reviewCount: 112,
    description: "Soft red cocoa sponge layers topped with cream cheese frosting, designed for birthday events.",
    priceVariants: [
      { weight: "500g (Half Kg)", price: 550, stock: 20 },
      { weight: "1kg (One Kg)", price: 1000, stock: 10 }
    ],
    ingredients: ["Cocoa Powder", "Wheat Flour", "Cream Cheese", "Butter", "Sugar"],
    nutritionalInfo: { calories: "367 kcal", protein: "5g", carbohydrates: "48g", fat: "18g" },
    allergens: ["Gluten", "Milk"],
    shelfLife: "2 days. Keep refrigerated.",
    image: "assets/images/banner.jpg",
    tags: ["Birthday Cakes", "Pastries"]
  },
  {
    id: "choco-pastry",
    name: "Shahi Dark Chocolate Pastry",
    category: "party",
    isBestSeller: false,
    isFeatured: false,
    rating: 4.7,
    reviewCount: 64,
    description: "Belgian chocolate cake pastry slice with rich dark chocolate ganache and chocolate curls.",
    priceVariants: [
      { weight: "Single Slice", price: 90, stock: 40 }
    ],
    ingredients: ["Dark Chocolate", "Wheat Flour", "Cream", "Butter", "Sugar"],
    nutritionalInfo: { calories: "340 kcal", protein: "4.2g", carbohydrates: "40g", fat: "19g" },
    allergens: ["Gluten", "Milk"],
    shelfLife: "2 days. Keep refrigerated.",
    image: "assets/images/banner.jpg",
    tags: ["Pastries"]
  },
  {
    id: "pistachio-cupcake",
    name: "Kesar Pistachio Cupcake",
    category: "party",
    isBestSeller: false,
    isFeatured: false,
    rating: 4.6,
    reviewCount: 42,
    description: "Delicious cupcakes flavored with ground pistachios, topped with a saffron buttercream frosting swirl.",
    priceVariants: [
      { weight: "Pack of 2 Pcs", price: 120, stock: 30 },
      { weight: "Pack of 4 Pcs", price: 220, stock: 15 }
    ],
    ingredients: ["Pistachios", "Wheat Flour", "Butter", "Saffron", "Sugar"],
    nutritionalInfo: { calories: "285 kcal", protein: "3.8g", carbohydrates: "36g", fat: "14g" },
    allergens: ["Gluten", "Milk", "Nuts"],
    shelfLife: "30 days.",
    image: "assets/images/banner.jpg",
    tags: ["Cup Cakes"]
  },
  {
    id: "cashew-cookies",
    name: "Desi Ghee Cashew Cookies",
    category: "party",
    isBestSeller: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 185,
    description: "Crispy cookies baked with refined wheat flour, Desi Ghee, sugar, and crunchy cashew nut bits.",
    priceVariants: [
      { weight: "250g Pack", price: 150, stock: 100 },
      { weight: "500g Pack", price: 280, stock: 65 }
    ],
    ingredients: ["Wheat Flour", "Desi Ghee", "Sugar", "Cashews"],
    nutritionalInfo: { calories: "512 kcal", protein: "7.5g", carbohydrates: "58g", fat: "28g" },
    allergens: ["Gluten", "Nuts"],
    shelfLife: "45 days.",
    image: "assets/images/gift_box.jpg",
    tags: ["Cookies"]
  },
  {
    id: "chocolate-gift",
    name: "Assorted Handmade Truffles",
    category: "party",
    isBestSeller: false,
    isFeatured: false,
    rating: 4.8,
    reviewCount: 54,
    description: "Luxury box of handmade chocolates, including caramel and dry fruit filled dark chocolate truffles.",
    priceVariants: [
      { weight: "Box of 12 Pcs", price: 450, stock: 40 }
    ],
    ingredients: ["Cocoa Butter", "Milk Solids", "Nuts", "Sugar"],
    nutritionalInfo: { calories: "530 kcal", protein: "6g", carbohydrates: "52g", fat: "32g" },
    allergens: ["Milk", "Nuts"],
    shelfLife: "60 days.",
    image: "assets/images/gift_box.jpg",
    tags: ["Chocolate Gifts"]
  },
  {
    id: "birthday-decor",
    name: "Royal Birthday Celebration Combo",
    category: "party",
    isBestSeller: false,
    isFeatured: false,
    rating: 4.7,
    reviewCount: 38,
    description: "Party set containing 10 birthday caps, 30 golden balloons, and 1 Happy Birthday banner.",
    priceVariants: [
      { weight: "Standard Party Set", price: 350, stock: 50 }
    ],
    ingredients: ["Paper Caps", "Latex Balloons", "Ribbons"],
    nutritionalInfo: { calories: "N/A", protein: "N/A", carbohydrates: "N/A", fat: "N/A" },
    allergens: [],
    shelfLife: "Indefinite.",
    image: "assets/images/banner.jpg",
    tags: ["Birthday Caps", "Birthday Balloons", "Party Decorations"]
  },
  {
    id: "return-gift",
    name: "Imperial Sweets Return Gift Box",
    category: "party",
    isBestSeller: false,
    isFeatured: false,
    rating: 4.9,
    reviewCount: 92,
    description: "Tin box packed with Kaju Katli and Kesar Peda, perfect as event return gifts.",
    priceVariants: [
      { weight: "Single Gift Box", price: 250, stock: 200 }
    ],
    ingredients: ["Cashews", "Milk Solids", "Sugar", "Saffron"],
    nutritionalInfo: { calories: "Variable", protein: "Variable", carbohydrates: "Variable", fat: "Variable" },
    allergens: ["Milk", "Nuts"],
    shelfLife: "15 days.",
    image: "assets/images/gift_box.jpg",
    tags: ["Return Gifts"]
  }
];

const simulateFallback = (endpoint, options = {}) => {
  const body = options.body ? JSON.parse(options.body) : {};
  const method = options.method || 'GET';

  const getStored = (key, defaultVal) => {
    const val = localStorage.getItem(`sim_${key}`);
    return val ? JSON.parse(val) : defaultVal;
  };
  
  const setStored = (key, val) => {
    localStorage.setItem(`sim_${key}`, JSON.stringify(val));
  };

  // Lazy initialize sim products in storage
  if (!localStorage.getItem('sim_products')) {
    setStored('products', defaultProducts);
  }

  if (endpoint === '/auth/login') {
    const { email, password } = body;
    const devAdminEmail = import.meta.env.VITE_DEV_ADMIN_EMAIL || 'admin@example.com';
    const devAdminPassword = import.meta.env.VITE_DEV_ADMIN_PASSWORD || 'DevPassword123!';
    
    if (email === devAdminEmail && password === devAdminPassword) {
      const user = { id: 'admin-1', name: 'Royal Admin', email: devAdminEmail, role: 'admin', phone: '+9199999 44444' };
      localStorage.setItem('token', 'sim_jwt_token_admin');
      return { token: 'sim_jwt_token_admin', user };
    }
    const user = { id: 'user-sim', name: 'Dipesh', email, role: 'customer', phone: '+9198765 43210' };
    localStorage.setItem('token', 'sim_jwt_token_user');
    return { token: 'sim_jwt_token_user', user };
  }

  if (endpoint === '/auth/register') {
    const user = { id: 'user-' + Date.now(), name: body.name, email: body.email, role: 'customer', phone: body.phone };
    localStorage.setItem('token', 'sim_jwt_token_user');
    return { token: 'sim_jwt_token_user', user };
  }

  if (endpoint === '/auth/otp/request') {
    const devOtp = import.meta.env.VITE_DEV_OTP || '123456';
    console.log(`[SIMULATION OTP] code: ${devOtp}`);
    return { message: 'OTP sent (Simulated)', phone: body.phone };
  }

  if (endpoint === '/auth/otp/verify') {
    const devOtp = import.meta.env.VITE_DEV_OTP || '123456';
    if (body.otp === devOtp) {
      const user = { id: 'user-sim', name: 'Dipesh', email: 'dipesh@temp.com', role: 'customer', phone: body.phone };
      localStorage.setItem('token', 'sim_jwt_token_user');
      return { token: 'sim_jwt_token_user', user };
    }
    throw new Error(`Invalid OTP code. Use ${devOtp}`);
  }

  if (endpoint === '/bookings' && method === 'POST') {
    const bookings = getStored('bookings', []);
    const newBooking = { id: 'booking-' + Date.now(), ...body, status: 'confirmed', createdAt: new Date().toISOString() };
    bookings.push(newBooking);
    setStored('bookings', bookings);
    return { message: 'Table reservation confirmed (Simulated)', booking: newBooking };
  }

  if (endpoint === '/catering' && method === 'POST') {
    const catering = getStored('catering', []);
    const newInquiry = { id: 'catering-' + Date.now(), ...body, status: 'pending', createdAt: new Date().toISOString() };
    catering.push(newInquiry);
    setStored('catering', catering);
    return { message: 'Catering inquiry submitted (Simulated)', inquiry: newInquiry };
  }

  if (endpoint === '/reviews') {
    if (method === 'POST') {
      const reviews = getStored('reviews', []);
      const newReview = { id: 'review-' + Date.now(), ...body, approved: false, createdAt: new Date().toISOString() };
      reviews.push(newReview);
      setStored('reviews', reviews);
      return { message: 'Review submitted for moderation (Simulated)', review: newReview };
    }
    const reviews = getStored('reviews', []);
    const seedReviews = [
      { id: 'seed-1', name: 'Aishwarya Singh', rating: 5, comment: 'The Shahi Mawa Kachori is simply divine! It takes me back to my childhood in Jodhpur. Absolute royal taste.', createdAt: '2026-06-15T12:00:00Z', approved: true },
      { id: 'seed-2', name: 'Rajesh Sharma', rating: 5, comment: 'Amazing Pyaaz Kachoris! Crispy, perfectly spiced. The visual box builder is so fun to use.', createdAt: '2026-07-02T14:30:00Z', approved: true },
      { id: 'seed-3', name: 'Meera Shekhawat', rating: 5, comment: 'Ordered customized wedding favors. The team did a fantastic job with silk boxes. All our guests were delighted.', createdAt: '2026-07-10T10:15:00Z', approved: true }
    ];
    return [...seedReviews, ...reviews.filter(r => r.approved)];
  }

  if (endpoint === '/orders' && method === 'POST') {
    const orders = getStored('orders', []);
    const subtotal = body.items.reduce((s, i) => s + (i.price * i.quantity), 0);
    const discount = (body.couponCode?.toUpperCase() === 'ROYAL10' ? subtotal * 0.1 : 0) + (body.couponCode?.toUpperCase() === 'MANDAWA20' ? subtotal * 0.2 : 0);
    const total = subtotal - discount;
    
    const year = new Date().getFullYear();
    const orderIndex = String(orders.length + 1).padStart(4, '0');
    const orderNum = `NJSH-${year}-${orderIndex}`;
    const invoiceNum = `INV-${year}-${orderIndex}`;

    const newOrder = {
      id: orderNum,
      invoiceNumber: invoiceNum,
      userId: body.userId || 'user-sim',
      items: body.items,
      subtotal,
      discount,
      shippingCharge: 0,
      total,
      pickupDate: body.pickupDate,
      pickupTime: body.pickupTime,
      pickupNotes: body.pickupNotes || '',
      advancePayment: parseFloat(body.advancePayment) || 0,
      contactInfo: body.contactInfo,
      paymentMethod: body.paymentMethod,
      paymentStatus: body.paymentMethod === 'COD' ? 'pending' : 'paid',
      status: 'placed',
      createdAt: new Date().toISOString()
    };
    orders.push(newOrder);
    setStored('orders', orders);

    // Sync product stocks locally in storage
    const currentProds = getStored('products', defaultProducts);
    const updatedProds = currentProds.map(p => {
      const orderItem = body.items.find(i => i.productId === p.id);
      if (orderItem) {
        return {
          ...p,
          priceVariants: p.priceVariants.map(v => 
            v.weight === orderItem.weight ? { ...v, stock: Math.max(0, v.stock - orderItem.quantity) } : v
          )
        };
      }
      return p;
    });
    setStored('products', updatedProds);

    return { message: 'Order booking placed successfully', order: newOrder };
  }

  if (endpoint.startsWith('/orders/') && endpoint.endsWith('/track')) {
    const orderId = endpoint.split('/')[2];
    const orders = getStored('orders', []);
    const order = orders.find(o => o.id === orderId) || { id: orderId, createdAt: new Date().toISOString(), status: 'placed', pickupDate: 'Today', pickupTime: '12:00 PM' };
    
    const elapsedMinutes = (Date.now() - new Date(order.createdAt).getTime()) / 60000;
    let currentStatus = order.status;
    if (order.status !== 'canceled' && order.status !== 'rejected' && order.status !== 'completed' && order.status !== 'ready-for-pickup') {
      if (elapsedMinutes >= 5) currentStatus = 'ready-for-pickup';
      else if (elapsedMinutes >= 2) currentStatus = 'preparing';
      else if (elapsedMinutes >= 1) currentStatus = 'accepted';
    }

    return {
      orderId: order.id,
      status: currentStatus,
      elapsedMinutes: Math.round(elapsedMinutes * 10) / 10,
      createdAt: order.createdAt,
      pickupDate: order.pickupDate,
      pickupTime: order.pickupTime,
      stages: [
        { key: 'placed', label: 'Order Booked', completed: true, timestamp: order.createdAt },
        { key: 'accepted', label: 'Accepted by Kitchen', completed: ['accepted', 'preparing', 'ready-for-pickup', 'completed'].includes(currentStatus), timestamp: order.createdAt },
        { key: 'preparing', label: 'Preparing', completed: ['preparing', 'ready-for-pickup', 'completed'].includes(currentStatus), timestamp: order.createdAt },
        { key: 'ready-for-pickup', label: 'Ready for Pickup', completed: ['ready-for-pickup', 'completed'].includes(currentStatus), timestamp: order.createdAt },
        { key: 'completed', label: 'Completed / Picked Up', completed: currentStatus === 'completed', timestamp: order.createdAt }
      ]
    };
  }

  // --- ADMIN SIMULATIONS ---
  if (endpoint === '/admin/stats') {
    const orders = getStored('orders', []);
    const bookings = getStored('bookings', []);
    const catering = getStored('catering', []);
    
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const totalOrders = orders.length;
    const pendingCatering = catering.filter(c => c.status === 'pending').length;
    const activeBookings = bookings.filter(b => b.status === 'confirmed').length;

    return {
      metrics: { totalRevenue, totalOrders, pendingCatering, activeBookings },
      salesByCategory: { sweets: totalRevenue * 0.6, namkeen: totalRevenue * 0.25, hampers: totalRevenue * 0.1, custom: totalRevenue * 0.05 },
      lowStockAlerts: getStored('products', defaultProducts)
        .flatMap(p => p.priceVariants.map(v => ({ id: p.id, name: p.name, weight: v.weight, stock: v.stock })))
        .filter(v => v.stock < 15),
      recentOrders: orders.slice(-5).reverse()
    };
  }

  if (endpoint === '/admin/orders') {
    return getStored('orders', []);
  }

  if (endpoint === '/admin/orders/status' && method === 'POST') {
    const orders = getStored('orders', []);
    const { orderId, status, paymentStatus } = body;
    const updated = orders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: status || o.status,
          paymentStatus: paymentStatus || o.paymentStatus
        };
      }
      return o;
    });
    setStored('orders', updated);
    return { message: 'Order status updated successfully' };
  }

  if (endpoint === '/admin/products/stock' && method === 'POST') {
    const productsList = getStored('products', defaultProducts);
    const { productId, weight, newStock } = body;
    const updated = productsList.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          priceVariants: p.priceVariants.map(v => 
            v.weight === weight ? { ...v, stock: parseInt(newStock) } : v
          )
        };
      }
      return p;
    });
    setStored('products', updated);
    return { message: 'Stock level updated' };
  }

  if (endpoint === '/admin/products/create' && method === 'POST') {
    const productsList = getStored('products', defaultProducts);
    const newProd = {
      id: body.id || 'prod-' + Date.now(),
      rating: 5.0,
      reviewCount: 0,
      ...body
    };
    productsList.push(newProd);
    setStored('products', productsList);
    return { message: 'Product created successfully', product: newProd };
  }

  if (endpoint === '/admin/products/edit' && method === 'POST') {
    const productsList = getStored('products', defaultProducts);
    const updated = productsList.map(p => p.id === body.id ? { ...p, ...body } : p);
    setStored('products', updated);
    return { message: 'Product edited successfully' };
  }

  if (endpoint === '/admin/products/delete' && method === 'POST') {
    const productsList = getStored('products', defaultProducts);
    const updated = productsList.filter(p => p.id !== body.productId);
    setStored('products', updated);
    return { message: 'Product deleted successfully' };
  }

  if (endpoint === '/admin/customers') {
    const users = getStored('users', [
      { id: 'admin-1', name: 'Royal Admin', email: 'admin@jodhpur.com', role: 'admin', phone: '+9199999 44444' },
      { id: 'user-sim', name: 'Dipesh', email: 'dipesh@temp.com', role: 'customer', phone: '+9198765 43210' }
    ]);
    const orders = getStored('orders', []);
    
    // Map order stats onto simulated user records
    return users.map(user => {
      const userOrders = orders.filter(o => o.userId === user.id);
      const totalSpending = userOrders.reduce((sum, o) => sum + o.total, 0);
      const lastOrder = userOrders.length > 0 ? userOrders[userOrders.length - 1].createdAt : 'N/A';
      return {
        ...user,
        joined: user.joined || '2026-07-01',
        totalOrders: userOrders.length,
        totalSpending,
        lastOrder,
        status: 'Active'
      };
    });
  }

  if (endpoint === '/admin/catering') {
    return getStored('catering', []);
  }

  if (endpoint === '/admin/bookings') {
    return getStored('bookings', []);
  }

  if (endpoint === '/admin/reviews') {
    return getStored('reviews', []);
  }

  if (endpoint === '/admin/reviews/moderate' && method === 'POST') {
    const reviews = getStored('reviews', []);
    const updated = reviews.map(r => r.id === body.reviewId ? { ...r, approved: body.approved } : r);
    setStored('reviews', updated);
    return { message: 'Review moderated successfully' };
  }

  if (endpoint === '/products') {
    return getStored('products', defaultProducts);
  }

  return { message: 'Method simulated' };
};

export const api = {
  getProducts: () => apiRequest('/products'),
  getProductById: (id) => apiRequest(`/products/${id}`),
  
  login: (email, password) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }),
  register: (name, email, phone, password) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, phone, password })
  }),
  requestOTP: (phone) => apiRequest('/auth/otp/request', {
    method: 'POST',
    body: JSON.stringify({ phone })
  }),
  verifyOTP: (phone, otp) => apiRequest('/auth/otp/verify', {
    method: 'POST',
    body: JSON.stringify({ phone, otp })
  }),

  createBooking: (bookingData) => apiRequest('/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData)
  }),
  createCatering: (cateringData) => apiRequest('/catering', {
    method: 'POST',
    body: JSON.stringify(cateringData)
  }),
  
  submitReview: (reviewData) => apiRequest('/reviews', {
    method: 'POST',
    body: JSON.stringify(reviewData)
  }),
  getReviews: () => apiRequest('/reviews'),

  createOrder: (orderData) => apiRequest('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData)
  }),
  getOrderById: (id) => apiRequest(`/orders/${id}`),
  trackOrder: (id) => apiRequest(`/orders/${id}/track`),
  getInvoiceUrl: (id) => `${API_BASE}/orders/${id}/invoice`,

  getAdminStats: () => apiRequest('/admin/stats'),
  getAdminOrders: () => apiRequest('/admin/orders'),
  updateOrderStatus: (orderId, status, paymentStatus) => apiRequest('/admin/orders/status', {
    method: 'POST',
    body: JSON.stringify({ orderId, status, paymentStatus })
  }),
  updateProductStock: (productId, weight, newStock) => apiRequest('/admin/products/stock', {
    method: 'POST',
    body: JSON.stringify({ productId, weight, newStock })
  }),
  getAdminCatering: () => apiRequest('/admin/catering'),
  updateCateringStatus: (inquiryId, status) => apiRequest('/admin/catering/status', {
    method: 'POST',
    body: JSON.stringify({ inquiryId, status })
  }),
  getAdminBookings: () => apiRequest('/admin/bookings'),
  getAdminReviews: () => apiRequest('/admin/reviews'),
  moderateReview: (reviewId, approved) => apiRequest('/admin/reviews/moderate', {
    method: 'POST',
    body: JSON.stringify({ reviewId, approved })
  }),

  createProduct: (productData) => apiRequest('/admin/products/create', {
    method: 'POST',
    body: JSON.stringify(productData)
  }),
  editProduct: (productData) => apiRequest('/admin/products/edit', {
    method: 'POST',
    body: JSON.stringify(productData)
  }),
  deleteProduct: (productId) => apiRequest('/admin/products/delete', {
    method: 'POST',
    body: JSON.stringify({ productId })
  }),
  getAdminCustomers: () => apiRequest('/admin/customers')
};
