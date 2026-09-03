import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema({
  sectionName: { type: String, default: 'Custom' },
  sectionId: { type: String, required: true, unique: true, index: true },
  variations: { type: String, default: '1' },
  path: { type: String },
  sectionStatus: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  wireframes: { type: String, default: '' },
  platform: { type: String, default: 'Website' },
  pageName: { type: String, required: true, default: 'Home' },
  isGenerated: { type: Boolean, default: true },
  isBuild: { type: Boolean, default: true },
  cardGridColumns: { type: Number, default: 3 },
  cardLayoutMode: { type: String, default: 'grid' },
  cardListBodyGapPx: { type: Number, default: 15 },
  cardClassName: { type: String, default: '' },
  cardCssText: { type: String, default: '' },
  sectionClassName: { type: String, default: '' },
  sectionColor: { type: String, default: '' },
  sectionPaddingTop: { type: String, default: '' },
  sectionPaddingBottom: { type: String, default: '' },
  sectionPaddingLeft: { type: String, default: '' },
  sectionPaddingRight: { type: String, default: '' },
  sectionTextMode: { type: String, default: 'auto' },
  tableClassName: { type: String, default: '' },
  tableCssText: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('Section', sectionSchema);
