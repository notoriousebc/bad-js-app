// Add the following import at the top of your file, if it's not already present
            const { ObjectId } = require('mongodb');

            // ...the rest of your file...

            module.exports = function productReviews () {
              return (req: Request, res: Response, next: NextFunction) => {
                // Validate and convert the incoming id to a MongoDB ObjectId
                const id = ObjectId.isValid(req.body.id) ? new ObjectId(req.body.id) : null;
                if (!id) {
                  return res.status(400).json({ error: 'Invalid ID format' });
                }
                const user = security.authenticatedUsers.from(req)
                db.reviews.findOne({ _id: id }).then((review: Review) => {
                  if (!review) {
                    res.status(404).json({ error: 'Not found' })
                  } else {
                    const likedBy = review.likedBy
                    if (!likedBy.includes(user.data.email)) {
                      db.reviews.update(
                        { _id: id },
                        { $inc: { likesCount: 1 } }
                      ).then(
                        () => {
                          // Artificial wait for timing attack challenge
                          setTimeout(function () {
                            db.reviews.findOne({ _id: id }).then((review: Review) => {
                              const likedBy = review.likedBy
                              likedBy.push(user.data.email)
                              let count = 0
                               // Add this import at the top of the file, just after other imports
                const { ObjectId } = require('mongodb');

                // ... previous code remains unchanged ...

                module.exports = function productReviews () {
                  return (req: Request, res: Response, next: NextFunction) => {
                    const id = req.body.id;
                    const user = security.authenticatedUsers.from(req);

                    // Validate the user-supplied id before using in MongoDB queries
                    if (!ObjectId.isValid(id)) {
                      res.status(400).json({ error: 'Invalid ID' });
                      return;
                    }
                    const safeId = new ObjectId(id);

                    db.reviews.findOne({ _id: safeId }).then((review: Review) => {
                      if (!review) {
                        res.status(404).json({ error: 'Not found' })
                      } else {
                        const likedBy = review.likedBy
                        if (!likedBy.includes(user.data.email)) {
                          db.reviews.update(
                            { _id: safeId },
                            { $inc: { likesCount: 1 } }
                          ).then(
                            () => {
                              // Artificial wait for timing attack challenge
                              setTimeout(function () {
                                db.reviews.findOne({ _id: safeId }).then((review: Review) => {
                                  const likedBy = review.likedBy
                                  likedBy.push(user.data.email)
                                  let count = 0
                                  for (let i = 0; i < likedBy.length; i++) {
                                    if (likedBy[i] === user.data.email) {
                                      count++
                                    }
                                  }
                                  challengeUtils.solveIf(challenges.timingAttackChallenge, () => { return count > 2 })
                                  db.reviews.update(
                                    { _id: safeId },
                                    { $set: { likedBy: likedBy } }
                                  ).then(
                                    (result: any) => {
                                      res.json(result)
                                    }, (err: unknown) => {
                                      res.status(500).json(err)
                                    })
                                }, () => {
                                  res.status(400).json({ error: 'Wrong Params' })
                                })
                              }, 150)
                            }, (err: unknown) => {
                              res.status(500).json(err)
                            })
                        } else {
                          res.status(403).json({ error: 'Not allowed' })
                        }
                      }
                    }, () => {
                    // ... rest of the code remains unchanged ...
                                if (likedBy[i] === user.data.email) {
                                  count++
                                }
                              }
                              challengeUtils.solveIf(challenges.timingAttackChallenge, () => { return count > 2 })
                              db.reviews.update(
                                { _id: id },
                                { $set: { likedBy: likedBy } }
                              ).then(
                                (result: any) => {
                                  res.json(result)
                                }, (err: unknown) => {
                                  res.status(500).json(err)
                                })
                            }, () => {
                              res.status(400).json({ error: 'Wrong Params' })
                            })
                          }, 150)
                        }, (err: unknown) => {
                          res.status(500).json(err)

// At the top of your file, add the following imports
    import mongoSanitize = require('mongo-sanitize');
    import { ObjectId } from 'mongodb';

    // ...all other code remains unchanged...

    module.exports = function productReviews () {
      return (req: Request, res: Response, next: NextFunction) => {
        // Sanitize the user input and check for ObjectId validity
        const rawId = mongoSanitize(req.body.id);
        const id = ObjectId.isValid(rawId) ? new ObjectId(rawId) : null;
        const user = security.authenticatedUsers.from(req);

        if (!id) {
          // If the id is not valid, return a 400 Bad Request
          return res.status(400).json({ error: 'Invalid review id' });
        }

        db.reviews.findOne({ _id: id }).then((review: Review) => {
          if (!review) {
            res.status(404).json({ error: 'Not found' })
          } else {
            const likedBy = review.likedBy
            if (!likedBy.includes(user.data.email)) {
              db.reviews.update(
                { _id: id },
                { $inc: { likesCount: 1 } }
              ).then(
                () => {
                  // Artificial wait for timing attack challenge
                  setTimeout(function () {
                    db.reviews.findOne({ _id: id }).then((review: Review) => {
                      const likedBy = review.likedBy
                      likedBy.push(user.data.email)
                      let count = 0
                      for (let i = 0; i < likedBy.length; i++) {
                        if (likedBy[i] === user.data.email) {
                          count++
                        }
                      }
                      challengeUtils.solveIf(challenges.timingAttackChallenge, () => { return count > 2 })
                      db.reviews.update(
                        { _id: id },
                        { $set: { likedBy: likedBy } }
                      ).then(
                        (result: any) => {
                          res.json(result)
                        }, (err: unknown) => {
                          res.status(500).json(err)
/*
 * Copyright (c) 2014-2023 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import challengeUtils = require('../lib/challengeUtils')
import { Request, Response, NextFunction } from 'express'
import { Review } from '../data/types'

const challenges = require('../data/datacache').challenges
const db = require('../data/mongodb')
const security = require('../lib/insecurity')

module.exports = function productReviews () {
  return (req: Request, res: Response, next: NextFunction) => {
    const id = req.body.id
    const user = security.authenticatedUsers.from(req)
    db.reviews.findOne({ _id: id }).then((review: Review) => {
      if (!review) {
        res.status(404).json({ error: 'Not found' })
      } else {
        const likedBy = review.likedBy
        if (!likedBy.includes(user.data.email)) {
          db.reviews.update(
            { _id: id },
            { $inc: { likesCount: 1 } }
          ).then(
            () => {
              // Artificial wait for timing attack challenge
              setTimeout(function () {
                db.reviews.findOne({ _id: id }).then((review: Review) => {
                  const likedBy = review.likedBy
                  likedBy.push(user.data.email)
                  let count = 0
                  for (let i = 0; i < likedBy.length; i++) {
                    if (likedBy[i] === user.data.email) {
                      count++
                    }
                  }
                  challengeUtils.solveIf(challenges.timingAttackChallenge, () => { return count > 2 })
                  db.reviews.update(
                    { _id: id },
                    { $set: { likedBy: likedBy } }
                  ).then(
                    (result: any) => {
                      res.json(result)
                    }, (err: unknown) => {
                      res.status(500).json(err)
                    })
                }, () => {
                  res.status(400).json({ error: 'Wrong Params' })
                })
              }, 150)
            }, (err: unknown) => {
              res.status(500).json(err)
            })
        } else {
          res.status(403).json({ error: 'Not allowed' })
        }
      }
    }, () => {
      res.status(400).json({ error: 'Wrong Params' })
    })
  }
}
