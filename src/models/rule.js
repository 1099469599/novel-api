import mongoose from 'mongoose';
import CommonPlugin from './plugins/common';

const Schema = mongoose.Schema;

const Rules = new Schema({
  host: { type: String, required: true },
  chapter: { type: String, required: true },
  content: { type: String, required: true },
  encoding: { type: String, required: true, default: 'utf8' },
});

Rules.plugin(CommonPlugin);

export default mongoose.model('Rule', Rules);
