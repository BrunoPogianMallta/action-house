const validateQuery = (req, res, next) => {
    const { query } = req.query;
  
    if (!query) {
      return res.status(400).json({ error: "O parâmetro 'query' é obrigatório." });
    }
  
    next();
  };
  
  module.exports = validateQuery;
  