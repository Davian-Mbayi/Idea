// Default mock categories
export const MOCK_CATEGORIES = [
  "Electronics",
  "Beverages",
  "Snacks",
  "Apparel",
  "Home Goods"
];

// Default mock products
export const MOCK_PRODUCTS = [
  {
    id: "11111111-1111-4111-a111-111111111111",
    sku: "ELEC-001",
    name: "Wireless Phone Charger",
    description: "15W Fast charging pad compatible with all Qi-enabled devices.",
    category: "Electronics",
    costPrice: 8.50,
    retailPrice: 19.99,
    quantity: 15,
    minQuantity: 5
  },
  {
    id: "22222222-2222-4222-a222-222222222222",
    sku: "ELEC-002",
    name: "Bluetooth Earbuds",
    description: "Noise cancelling in-ear headphones with charging case.",
    category: "Electronics",
    costPrice: 22.00,
    retailPrice: 49.99,
    quantity: 3, // Low stock!
    minQuantity: 6
  },
  {
    id: "33333333-3333-4333-a333-333333333333",
    sku: "BEV-101",
    name: "Organic Green Tea (24 Pack)",
    description: "Unsweetened organic green tea bottles.",
    category: "Beverages",
    costPrice: 14.50,
    retailPrice: 24.99,
    quantity: 25,
    minQuantity: 8
  },
  {
    id: "44444444-4444-4444-a444-444444444444",
    sku: "SNK-201",
    name: "Salted Almonds (500g)",
    description: "Premium roasted and salted California almonds.",
    category: "Snacks",
    costPrice: 4.20,
    retailPrice: 8.99,
    quantity: 40,
    minQuantity: 10
  },
  {
    id: "55555555-5555-4555-a555-555555555555",
    sku: "APP-301",
    name: "Cotton Crewneck T-Shirt (M)",
    description: "Classic fit 100% organic cotton white t-shirt.",
    category: "Apparel",
    costPrice: 6.00,
    retailPrice: 15.00,
    quantity: 12,
    minQuantity: 5
  },
  {
    id: "66666666-6666-4666-a666-666666666666",
    sku: "HOM-401",
    name: "Scented Soy Candle",
    description: "Lavender & Vanilla hand-poured soy wax candle.",
    category: "Home Goods",
    costPrice: 5.50,
    retailPrice: 12.99,
    quantity: 2, // Low stock!
    minQuantity: 5
  }
];

// Default mock transactions log
export const MOCK_TRANSACTIONS = [
  {
    id: "a1111111-1111-4111-b111-111111111111",
    productId: "11111111-1111-4111-a111-111111111111",
    productName: "Wireless Phone Charger",
    type: "in",
    quantity: 20,
    reason: "New supplier shipment received",
    date: "2026-06-20T10:30:00.000Z"
  },
  {
    id: "a2222222-2222-4222-b222-222222222222",
    productId: "11111111-1111-4111-a111-111111111111",
    productName: "Wireless Phone Charger",
    type: "out",
    quantity: -5,
    reason: "Store sale",
    date: "2026-06-22T14:15:00.000Z"
  },
  {
    id: "a3333333-3333-4333-b333-333333333333",
    productId: "22222222-2222-4222-a222-222222222222",
    productName: "Bluetooth Earbuds",
    type: "out",
    quantity: -3,
    reason: "Store sale",
    date: "2026-06-23T11:05:00.000Z"
  },
  {
    id: "a4444444-4444-4444-b444-444444444444",
    productId: "33333333-3333-4333-a333-333333333333",
    productName: "Organic Green Tea (24 Pack)",
    type: "in",
    quantity: 10,
    reason: "Restocked from local warehouse",
    date: "2026-06-24T09:00:00.000Z"
  },
  {
    id: "a5555555-5555-4555-b555-555555555555",
    productId: "66666666-6666-4666-a666-666666666666",
    productName: "Scented Soy Candle",
    type: "adjustment",
    quantity: -1,
    reason: "Damaged item written off",
    date: "2026-06-24T16:45:00.000Z"
  }
];
