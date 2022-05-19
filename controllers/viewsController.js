exports.getOverview = (req, res) => {
  res.status(200).render('overview', {
    title: 'All Tours',
  });
};
exports.getToursView = (req, res) => {
  res.status(200).render('tour', {
    title: 'The Forset Hiker',
  });
};
