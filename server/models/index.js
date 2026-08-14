const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  showroomName: { type: String, default: "السيد الجزار للسيراميك والبورسلين" },
  tagline: { type: String, default: "" },
  whatsappNumber: { type: String, default: "" },
  phoneNumber: { type: String, default: "" },
  facebookUrl: { type: String, default: "" },
  tiktokUrl: { type: String, default: "" },
  mapUrl: { type: String, default: "" },
  mapUrl1: { type: String, default: "" },
  mapUrl2: { type: String, default: "" },
  address: { type: String, default: "" },
  workingHours: { type: String, default: "" },
  announcement: { type: String, default: "" },
  address1: { type: String, default: "" },
  address2: { type: String, default: "" }
}, { minimize: false });

const CategorySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  icon: { type: String, required: true },
  subcategories: [String]
});

const ProductSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  code: { type: String, required: true, index: true },
  brand: { type: String, index: true },
  category: { type: String, required: true, index: true },
  subcategory: { type: String, index: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number, default: 0 },
  offerEndDate: String,
  offerNote: String,
  priceUnit: { type: String, default: "متر مربع" },
  boxCoverage: { type: Number, default: 1.44 },
  dimensions: String,
  finish: String,
  grade: String,
  origin: String,
  usage: String,
  inStock: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false, index: true },
  description: String,
  image: String
});

const AnalyticsSchema = new mongoose.Schema({
  id: { type: String, default: "main-analytics", unique: true },
  totalVisitors: { type: Number, default: 0 },
  totalPageViews: { type: Number, default: 0 },
  totalTimeSpentSeconds: { type: Number, default: 0 },
  whatsappClicks: { type: Number, default: 0 },
  whatsappClickDetails: {
    floating_badge: { type: Number, default: 0 },
    product_card: { type: Number, default: 0 },
    product_modal: { type: Number, default: 0 },
    tile_calculator: { type: Number, default: 0 }
  },
  productViews: { type: Object, default: {} },
  searchQueries: { type: Object, default: {} },
  mobileCount: { type: Number, default: 0 },
  desktopCount: { type: Number, default: 0 },
  lastActivity: { type: String, default: () => new Date().toISOString() }
}, { minimize: false });

module.exports = {
  SettingsSchema,
  CategorySchema,
  ProductSchema,
  AnalyticsSchema,
  getModels: () => ({
    Settings: mongoose.models.Settings || mongoose.model('Settings', SettingsSchema),
    Category: mongoose.models.Category || mongoose.model('Category', CategorySchema),
    Product: mongoose.models.Product || mongoose.model('Product', ProductSchema),
    Analytics: mongoose.models.Analytics || mongoose.model('Analytics', AnalyticsSchema)
  })
};
