// Backend/models/productModel.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxLength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
    maxLength: [1000, 'Product description cannot exceed 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0.01, 'Price must be greater than 0']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    trim: true,
    maxLength: [50, 'Category cannot exceed 50 characters']
  },
  subCategory: {
    type: String,
    trim: true,
    maxLength: [50, 'Subcategory cannot exceed 50 characters']
  },
  brand: {
    type: String,
    trim: true,
    maxLength: [50, 'Brand cannot exceed 50 characters']
  },
  model: {
    type: String,
    trim: true,
    maxLength: [50, 'Model cannot exceed 50 characters']
  },
  sku: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    maxLength: [50, 'SKU cannot exceed 50 characters']
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'Stock cannot be negative']
  },
  minStock: {
    type: Number,
    default: 5,
    min: [0, 'Minimum stock cannot be negative']
  },
  maxStock: {
    type: Number,
    default: 1000,
    min: [1, 'Maximum stock must be at least 1']
  },
  image: {
    type: String,
    default: ''
  },
  images: [{
    type: String
  }],
  features: [{
    type: String,
    trim: true,
    maxLength: [200, 'Feature cannot exceed 200 characters']
  }],
  specifications: {
    type: Map,
    of: String
  },
  downloads: [{
    label: {
      type: String,
      required: true,
      trim: true
    },
    // Backward compatibility - support both old 'link' and new 'url'
    link: {
      type: String,
      trim: true
    },
    url: {
      type: String,
      trim: true
    },
    directDownloadUrl: {
      type: String,
      trim: true
    },
    publicId: {
      type: String,
      trim: true
    },
    type: {
      type: String,
      enum: ['manual', 'datasheet', 'software', 'driver', 'guide', 'other'],
      default: 'manual'
    },
    originalName: String,
    fileSize: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    weight: Number,
    unit: {
      type: String,
      enum: ['cm', 'inch', 'mm'],
      default: 'cm'
    }
  },
  warranty: {
    duration: Number,
    unit: {
      type: String,
      enum: ['days', 'months', 'years'],
      default: 'months'
    },
    description: String
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isOnSale: {
    type: Boolean,
    default: false
  },
  saleStartDate: Date,
  saleEndDate: Date,
  discount: {
    type: Number,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%'],
    default: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot exceed 5']
    },
    count: {
      type: Number,
      default: 0,
      min: [0, 'Rating count cannot be negative']
    }
  },
  reviews: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0,
    min: [0, 'Views cannot be negative']
  },
  salesCount: {
    type: Number,
    default: 0,
    min: [0, 'Sales count cannot be negative']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  seoTitle: {
    type: String,
    trim: true,
    maxLength: [60, 'SEO title cannot exceed 60 characters']
  },
  seoDescription: {
    type: String,
    trim: true,
    maxLength: [160, 'SEO description cannot exceed 160 characters']
  },
  seoKeywords: [{
    type: String,
    trim: true,
    lowercase: true
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for final price after discount
productSchema.virtual('finalPrice').get(function() {
  if (this.isOnSale && this.discount > 0) {
    return Math.round(this.price * (1 - this.discount / 100) * 100) / 100;
  }
  return this.price;
});

// Virtual for stock status
productSchema.virtual('stockStatus').get(function() {
  if (this.stock === 0) return 'out_of_stock';
  if (this.stock <= this.minStock) return 'low_stock';
  return 'in_stock';
});

// Index for search functionality
productSchema.index({
  name: 'text',
  description: 'text',
  category: 'text',
  brand: 'text',
  tags: 'text'
}, {
  weights: {
    name: 10,
    category: 5,
    brand: 3,
    description: 1,
    tags: 2
  }
});

// Compound indexes for common queries
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ isActive: 1, isFeatured: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });

// Pre-save middleware to generate SKU if not provided
productSchema.pre('save', function(next) {
  if (!this.sku && this.isNew) {
    // Generate SKU: SE-CATEGORY-TIMESTAMP
    const timestamp = Date.now().toString().slice(-6);
    this.sku = `SE-${this.category.toUpperCase().slice(0, 3)}-${timestamp}`;
  }
  next();
});

// Method to increment view count
productSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save({ validateBeforeSave: false });
};

// Static method to get products by category
productSchema.statics.getByCategory = function(category, options = {}) {
  const {
    limit = 10,
    skip = 0,
    sort = { createdAt: -1 },
    includeInactive = false
  } = options;
  
  const filter = { category };
  if (!includeInactive) {
    filter.isActive = true;
  }
  
  return this.find(filter)
    .sort(sort)
    .limit(limit)
    .skip(skip);
};

// Static method to get featured products
productSchema.statics.getFeatured = function(limit = 10) {
  return this.find({ isActive: true, isFeatured: true })
    .sort({ createdAt: -1 })
    .limit(limit);
};

module.exports = mongoose.model('Product', productSchema);
