const injectionChars = /"|'|;|and|or|;|#/i;

module.exports = function searchProducts () {
  return (req: Request, res: Response, next: NextFunction) => {
    let criteria: any = req.query.q === 'undefined' ? '' : req.query.q ?? ''
    criteria = (criteria.length <= 200) ? criteria : criteria.substring(0, 200)
    if (criteria.match(injectionChars)) {
      res.status(400).send()
      return
    }
  // Use parameterized queries to prevent SQL injection
    models.sequelize.query(
      "SELECT * FROM Products WHERE ((name LIKE :likeQ OR description LIKE :likeQ) AND deletedAt IS NULL) ORDER BY name",
      {
        replacements: { likeQ: `%${criteria}%` }
      }
    )
      .then(([products]: any) => {
        const dataString = JSON.stringify(products)
        for (let i = 0; i < products.length; i++) {
          products[i].name = req.__(products[i].name)
          products[i].description = req.__(products[i].description)
        }
        res.json(utils.queryResultToJson(products))
      }).catch((error: ErrorWithParent) => {
        next(error.parent)
      })
  }
}
