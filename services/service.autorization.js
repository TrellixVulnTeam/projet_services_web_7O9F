function checkAuth(req, res, next) {
  if (!req.headers.authorization) {
    return res
      .status(401)
      .json({ error: "No credentials sent in the header!" });
  }
  if (req.headers.authorization !== "Bearer 8f94826adab8ffebbeadb4f9e161b2dc") {
    return res.status(401).json({ error: "Bad API Key !" });
  }
  next();
}

module.exports = checkAuth;
