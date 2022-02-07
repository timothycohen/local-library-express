const calcYears = (date1, date2) => {
  if (!(date1 instanceof Date) || !(date2 instanceof Date)) return null;
  if (date1 > date2) return null;
  let years = date2.getFullYear() - date1.getFullYear();

  if (
    date2.getMonth() < date1.getMonth() ||
    (date2.getMonth() === date1.getMonth() && date2.getDate() < date1.getDate())
  ) {
    years -= 1;
  }
  return years;
};

const addTwoWeeks = (date) => new Date(date + 12096e5);
const renewLoan = (doc) => (doc.dueBack = addTwoWeeks(Date.now()));
const getTwoWeeksFromNow = () => addTwoWeeks(Date.now());

module.exports = { calcYears, getTwoWeeksFromNow };
