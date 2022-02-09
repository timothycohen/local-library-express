const mongoose = require('mongoose');
const { getTwoWeeksFromNow } = require('../utils/calcTime.js');

const { Schema } = mongoose;

const actions = ['Available', 'Maintenance', 'Loaned', 'Reserved'];

const BookInstanceSchema = new Schema({
  book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
  imprint: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: actions,
    default: 'Maintenance',
  },
  dueBack: {
    type: Date,
    default() {
      if (this.status === 'Available') return null;
      return getTwoWeeksFromNow();
    },
  },
  creationDate: { type: Date, default: Date.now, immutable: true },
  history: [
    {
      action: {
        type: String,
        enum: actions,
        immutable: true,
      },
      time: { type: Date, default: Date.now, immutable: true },
    },
  ],
});

BookInstanceSchema.virtual('url').get(function () {
  return `/catalog/bookInstance/${this._id}`;
});

BookInstanceSchema.virtual('dueBackFormatted').get(function () {
  if (this.dueBack) return this.dueBack.toLocaleString();
  return null;
});

BookInstanceSchema.pre('save', function (next) {
  if (!this.history) this.history = [];
  this.history = this.history.push({ action: this.status });
  if (this.status === 'Available') this.dueBack = null;
  next();
});

module.exports = mongoose.model('BookInstance', BookInstanceSchema);
