import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const counterPath = path.join(__dirname, '../../id-counter.json');

class IdAllocator {
  constructor() {
    this.counters = {
      sectionCounter: 1000000001,
      fieldCounter: 2000000001,
      cardFieldCounter: 3000000001
    };
    this.load();
  }

  load() {
    if (fs.existsSync(counterPath)) {
      this.counters = JSON.parse(fs.readFileSync(counterPath, 'utf8'));
    } else {
      this.save();
    }
  }

  save() {
    fs.writeFileSync(counterPath, JSON.stringify(this.counters, null, 2));
  }

  nextSectionId() {
    const id = this.counters.sectionCounter.toString();
    this.counters.sectionCounter++;
    this.save();
    return id;
  }

  nextFieldId() {
    const id = this.counters.fieldCounter.toString();
    this.counters.fieldCounter++;
    this.save();
    return id;
  }

  nextCardFieldId() {
    const id = this.counters.cardFieldCounter.toString();
    this.counters.cardFieldCounter++;
    this.save();
    return id;
  }

  nextCardFieldIdPair() {
    const fieldId1 = this.nextCardFieldId();
    const fieldId2 = this.nextCardFieldId();
    return { fieldId1, fieldId2 };
  }
}

export default new IdAllocator();
