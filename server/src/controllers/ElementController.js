import Element from '../models/Element.js';
import { sanitise } from '../services/HtmlSanitiser.js';

export async function listElements(req, res, next) {
  try {
    const query = {};
    if (req.query.sectionId) query.sectionId = req.query.sectionId;
    if (req.query.pageName) query.pageName = req.query.pageName;
    
    const elements = await Element.find(query).lean();
    res.json({ ok: true, elements });
  } catch (err) {
    next(err);
  }
}

export async function updateElement(req, res, next) {
  try {
    const fieldId = req.params.fieldId;
    const { content, css } = req.body;
    
    const updateData = {};
    if (content !== undefined) updateData.content = sanitise(content);
    if (css !== undefined) updateData.css = css;
    
    const element = await Element.findOneAndUpdate(
      { fieldId },
      { $set: updateData },
      { new: true }
    );
    
    if (!element) return res.status(404).json({ ok: false, error: 'Not found' });
    res.json({ ok: true, element });
  } catch (err) {
    next(err);
  }
}
