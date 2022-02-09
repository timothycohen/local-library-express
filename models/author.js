const mongoose = require('mongoose');
const { calcYears } = require('../utils/calcTime');

const { Schema } = mongoose;

const AuthorSchema = new Schema({
  firstName: { type: String, required: true, maxLength: 100 },
  familyName: { type: String, required: true, maxLength: 100 },
  dateOfBirth: { type: Date },
  dateOfDeath: { type: Date },
});

AuthorSchema.virtual('name').get(function () {
  if (this.firstName && this.familyName) return `${this.familyName}, ${this.firstName}`;
  if (!this.firstName && !this.familyName) return '';
  return this.firstName ? this.firstName : this.familyName;
});

AuthorSchema.virtual('url').get(function () {
  return `/catalog/author/${this._id}`;
});

const format = { year: 'numeric', month: 'long', day: 'numeric' };

AuthorSchema.virtual('dateOfBirthFormatted').get(function () {
  if (!this.dateOfBirth) return '?';
  return this.dateOfBirth.toLocaleDateString('en-us', format);
});

AuthorSchema.virtual('dateOfDeathFormatted').get(function () {
  if (!this.dateOfDeath) return '';
  return this.dateOfDeath.toLocaleDateString('en-us', format);
});

AuthorSchema.virtual('ageAtDeath').get(function () {
  return calcYears(this.dateOfBirth, this.dateOfDeath);
});

AuthorSchema.virtual('lifespan').get(function () {
  if (!this.dateOfDeath) return `${this.dateOfBirthFormatted} - `;
  return `${this.dateOfBirthFormatted} - †${this.dateOfDeathFormatted}`;
});

// Export model
module.exports = mongoose.model('Author', AuthorSchema);
