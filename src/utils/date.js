const monthTitles = [
  ['январь', 'янв', 'января'],
  ['февраль', 'фев', 'февраля'],
  ['март', 'мар', 'марта'],
  ['апрель', 'апр', 'апреля'],
  ['май', 'май', 'мая'],
  ['июнь', 'июн', 'июня'],
  ['июль', 'июл', 'июля'],
  ['август', 'авг', 'августа'],
  ['сентябрь', 'сен', 'сентября'],
  ['октябрь', 'окт', 'октября'],
  ['ноябрь', 'ноя', 'ноября'],
  ['декабрь', 'дек', 'декабря'],
];

export const calendarToIso = date => new Date(date).toISOString();

export const dayMonth = (date) => {
  const parseDate = new Date(date);

  const day = parseDate.getDate();

  const stringMonth = monthTitles[parseDate.getMonth()][2];
  return `${day} ${stringMonth}`;
};

export const getDayShortMonthFullYear = (date) => {
  if (date) {
    const parseDate = new Date(date);

    const day = parseDate.getDate();

    const stringMonth = monthTitles[parseDate.getMonth()][1];

    return `${day} ${stringMonth} ${parseDate.getFullYear()}`;
  }

  return '';
};
