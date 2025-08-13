/*
 * Copyright (c) 2014-2023 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import utils = require('../lib/utils')
import challengeUtils = require('../lib/challengeUtils')
import { Request, Response, NextFunction } from 'express'
import { Review } from 'data/types'

const challenges = require('../data/datacache').challenges
const security = require('../lib/insecurity')
const db = require('../data/mongodb')

// Blocking sleep function as in native MongoDB
// @ts-expect-error
global.sleep = (time: number) => {
  // Ensure that users don't accidentally dos their servers for too long
  if (time > 2000) {
    time = 2000
  }
  const stop = new Date().getTime()
  while (new Date().getTime() < stop + time) {
    ;
  }
}

module.exports = function productReviews () {
  return (req: Request, res: Response, next: NextFunction) => {
    const id = utils.disableOnContainerEnv() ? Number(req.params.id) : req.params.id

    // Measure how long the query takes, to check if there was a nosql dos attack
    const t0 = new Date().getTime()
    // Validate and sanitize the id before using it in the MongoDB query
    let query: any;

    if (utils.disableOnContainerEnv()) {
      // id is expected to be a number
      const numericId = Number(req.params.id);
      if (isNaN(numericId)) {
        return res.status(400).json({ error: 'Invalid ID' });
      }
      query = { product: numericId };
    } else {
      // id is expected to be a string (e.g., ObjectId or string identifier)
      // If using MongoDB ObjectId, validate and cast using ObjectId from 'mongodb'
      // For this example, we'll do a basic string check; adjust as needed for your schema
      if (typeof req.params.id !== 'string' || req.params.id.trim() === '') {
        return res.status(400).json({ error: 'Invalid ID' });
      }
      // If IDs should be in ObjectId format, you can add validation here
      query = { product: req.params.id };
    }

    // Use a field-based, type-checked query instead of $where
    db.reviews.find(query).then((reviews: Review[]) => {
      const t1 = new Date().getTime();
      challengeUtils.solveIf(challenges.noSqlCommandChallenge, () => { return (t1 - t0) > 2000 });
      const user = security.authenticatedUsers.from(req);
      for (let i = 0; i < reviews.length; i++) {
        if (user === undefined || reviews[i].likedBy.includes(user.data.email)) {
          reviews[i].liked = true;
        }
      }
      res.json(utils.queryResultToJson(reviews));
    }, () => {
      res.status(400).json({ error: 'Wrong Params' });
    });
      const t1 = new Date().getTime()
      challengeUtils.solveIf(challenges.noSqlCommandChallenge, () => { return (t1 - t0) > 2000 })
      const user = security.authenticatedUsers.from(req)
      for (let i = 0; i < reviews.length; i++) {
        if (user === undefined || reviews[i].likedBy.includes(user.data.email)) {
          reviews[i].liked = true
        }
      }
      res.json(utils.queryResultToJson(reviews))
    }, () => {
      res.status(400).json({ error: 'Wrong Params' })
    })
  }
}
