const mongoose = require('mongoose');

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

AuthorSchema.virtual('lifespan').get(function () {
  const birth = this.dateOfBirth ? this.dateOfBirth.getYear() : '';
  const death = this.dateOfDeath ? this.dateOfDeath.getYear() : '';
  return `${birth} - ${death}`;
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

// Export model
module.exports = mongoose.model('Author', AuthorSchema);
