/*
 * Copyright (c) 2014-2023 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import challengeUtils = require('../lib/challengeUtils')
import { Request, Response, NextFunction } from 'express'

const challenges = require('../data/datacache').challenges
const db = require('../data/mongodb')
const security = require('../lib/insecurity')

// vuln-code-snippet start noSqlReviewsChallenge forgedReviewChallenge
module.exports = function productReviews () {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = security.authenticatedUsers.from(req) // vuln-code-snippet vuln-line forgedReviewChallenge
    db.reviews.update( // vuln-code-snippet neutral-line forgedReviewChallenge
      // Add this import at the very top of the file, after other imports if necessary
      const { ObjectId } = require('mongodb')

      // ...other code remains unchanged...

      module.exports = function productReviews () {
        return (req: Request, res: Response, next: NextFunction) => {
          const user = security.authenticatedUsers.from(req)

          // Validate req.body.id as a valid ObjectId before using it in the query
          if (!ObjectId.isValid(req.body.id)) {
            return res.status(400).json({ error: "Invalid ID" })
          }

          db.reviews.update(
            { _id: new ObjectId(req.body.id) }, // fixed: validate and convert to ObjectId
            { $set: { message: req.body.message } },
            { multi: true }
          ).then(
            (result: { modified: number, original: Array<{ author: any }> }) => {
              challengeUtils.solveIf(challenges.noSqlReviewsChallenge, () => { return result.modified > 1 })
              challengeUtils.solveIf(challenges.forgedReviewChallenge, () => { return user?.data && result.original[0] && result.original[0].author !== user.data.email && result.modified === 1 })
              res.json(result)
            }, (err: unknown) => {
              res.status(500).json(err)
            })
        }
      }
      { $set: { message: req.body.message } },
      { multi: true } // vuln-code-snippet vuln-line noSqlReviewsChallenge
    ).then(
      (result: { modified: number, original: Array<{ author: any }> }) => {
        challengeUtils.solveIf(challenges.noSqlReviewsChallenge, () => { return result.modified > 1 }) // vuln-code-snippet hide-line
        challengeUtils.solveIf(challenges.forgedReviewChallenge, () => { return user?.data && result.original[0] && result.original[0].author !== user.data.email && result.modified === 1 }) // vuln-code-snippet hide-line
        res.json(result)
      }, (err: unknown) => {
        res.status(500).json(err)
      })
  }
}
// vuln-code-snippet end noSqlReviewsChallenge forgedReviewChallenge
