import mongoose from 'mongoose';

const elementSchema = new mongoose.Schema({
  sectionId: { type: String, required: true, index: true },
  elementName: { type: String, required: true },
  fieldId: { type: String, required: true, unique: true, index: true },
  content: { type: String, default: '' },
  contentType: { type: String, enum: ['Image', 'Text', 'Textfield', 'Button', 'Cards'], required: true },
  css: { type: String, default: null },
  loop: { type: [mongoose.Schema.Types.Mixed], default: [] },
  projectName: { type: String, default: 'sample-brand' },
  pageName: { type: String, required: true, default: 'Home' },
  isCustom: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Element', elementSchema);
