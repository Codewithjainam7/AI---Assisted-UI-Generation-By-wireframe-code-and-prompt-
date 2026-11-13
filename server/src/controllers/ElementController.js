import { ElementStore } from '../services/dbStore.js';
import { sanitise } from '../services/HtmlSanitiser.js';

export async function listElements(req, res, next) {
  try {
    const query = {};
    if (req.query.sectionId) query.sectionId = req.query.sectionId;
    if (req.query.pageName) query.pageName = req.query.pageName;
    
    const elements = await ElementStore.find(query);
    res.json({ ok: true, elements });
  } catch (err) {
    next(err);
  }
}

export async function updateElement(req, res, next) {
  try {
    const fieldId = req.params.fieldId;
    const { content, css, loop } = req.body;
    
    const updateData = {};
    if (content !== undefined) {
      updateData.content = typeof content === 'string' ? sanitise(content) : content;
      if (Array.isArray(content)) {
        updateData.loop = content;
      }
    }
    if (loop !== undefined && Array.isArray(loop)) {
      updateData.loop = loop;
    }
    if (css !== undefined) updateData.css = css;
    
    let element = await ElementStore.findOneAndUpdate(
      { fieldId },
      { $set: updateData },
      { new: true }
    );
    
    // If not found directly, check if fieldId is inside a card's loop array
    if (!element) {
      const allElements = await ElementStore.find();
      for (const el of allElements) {
        if (el.contentType === 'Cards' && Array.isArray(el.loop)) {
          let found = false;
          const updatedLoop = el.loop.map(c => {
            if (c.fieldId1 === fieldId) {
              found = true;
              return { ...c, field1: typeof content === 'string' ? sanitise(content) : content };
            }
            if (c.fieldId2 === fieldId) {
              found = true;
              return { ...c, field2: typeof content === 'string' ? sanitise(content) : content };
            }
            return c;
          });
          if (found) {
            element = await ElementStore.findOneAndUpdate(
              { fieldId: el.fieldId },
              { $set: { loop: updatedLoop } },
              { new: true }
            );
            break;
          }
        }
      }
    }
    
    if (!element) return res.status(404).json({ ok: false, error: 'Not found' });
    res.json({ ok: true, element });
  } catch (err) {
    next(err);
  }
}
