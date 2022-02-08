const mongoose = require('mongoose');

const { Schema } = mongoose;

const GenreSchema = new Schema({
  name: { type: String, required: true, max: 100, min: 3 },
});

GenreSchema.virtual('url').get(function () {
  return `/catalog/genre/${this._id}`;
});

GenreSchema.pre('remove', async function () {
  const genre = this;
  await genre
    .model('Book')
    .updateMany({ genres: genre._id }, { $pull: { genres: genre._id } }, { multi: true });
});

module.exports = mongoose.model('Genre', GenreSchema);
