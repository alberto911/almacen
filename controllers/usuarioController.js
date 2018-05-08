exports.login = (req, res, next) => {
  res.json({ id: req.user.id, username: req.user.username });
};

exports.logout = (req, res, next) => {
  req.session.destroy(function (err) {
    if (err) return next(err);
    res.json('Logout');
  });
};

exports.loggedIn = (req, res, next) => {
  if (req.user)
    next();
  else
    res.json({ error: 'User is not authenticated', authenticated: false });
};

exports.sendUser = (req, res, next) => {
	res.json({
		user: { id: req.user.id, username: req.user.username },
		authenticated: true
	});
};
