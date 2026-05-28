const mongoose = require('mongoose');

const LawSchema = new mongoose.Schema({
  act: {
    type: String,
    required: [true, 'Please provide the Act name (e.g. IPC, CrPC)'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please provide the Act category (e.g. Criminal, Civil)'],
    trim: true
  },
  chapter: {
    type: mongoose.Schema.Types.Mixed, // allows Number or String chapter identifiers
    required: [true, 'Please provide the chapter identifier']
  },
  chapter_title: {
    type: String,
    required: [true, 'Please provide the chapter title'],
    trim: true
  },
  section: {
    type: String,
    required: [true, 'Please provide the section number/identifier'],
    trim: true
  },
  section_title: {
    type: String,
    required: [true, 'Please provide the section title'],
    trim: true
  },
  section_desc: {
    type: String,
    required: [true, 'Please provide the description of the section']
  },
  bailable: {
    type: Boolean,
    default: true
  },
  cognizable: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Enforce unique section lookup within each specific Act
LawSchema.index({ act: 1, section: 1 }, { unique: true });

// Full-Text Search index for keywords across title, description, and chapter titles
LawSchema.index({
  section_title: 'text',
  section_desc: 'text',
  chapter_title: 'text',
  act: 'text'
}, {
  weights: {
    section_title: 10,
    section_desc: 5,
    chapter_title: 2,
    act: 1
  },
  name: 'LawTextIndex'
});

module.exports = mongoose.model('Law', LawSchema);
