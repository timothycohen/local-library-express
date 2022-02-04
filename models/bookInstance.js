const mongoose = require('mongoose');

const { Schema } = mongoose;

const BookInstanceSchema = new Schema({
  book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
  imprint: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'],
    default: 'Maintenance',
  },
  dueBack: { type: Date, default: Date.now },
});

BookInstanceSchema.virtual('url').get(function () {
  return `/catalog/bookInstance/${this._id}`;
});

BookInstanceSchema.virtual('dueBackFormatted').get(function () {
  return this.dueBack.toLocaleString();
});

module.exports = mongoose.model('BookInstance', BookInstanceSchema);
