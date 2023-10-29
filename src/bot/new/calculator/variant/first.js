import {
  Priority, // Selector
  Sequence,
  // Failer,
  Inverter
} from 'behavior3js';

import * as NODES from '../nodes';

import AI from '../core';

import { newChildObject } from '../../utils';

const First = function(...params) {
  AI.apply(this, [...params]);
};

First.prototype = newChildObject(AI.prototype);

First.prototype.buildTree = function() {
  return new Sequence({
    children:[
      // new FilterEvent(this),
      new NODES.SequenceAlwaysSuccess({
        name: 'pre-processing',
        children: [
          new NODES.SyncData(this),
          new NODES.UpdateLastResult(this),
          new NODES.UpdateFlame(this),
          // need implement guest path of virus/human more precision. Currently, ignore Hazard from virus/human
          // new NODES.UpdateVirus(this),
          // new NODES.UpdateHuman(this),
          // need implement update enemy grid in future
          new NODES.CalculateBombDelay(this),
          new NODES.CalculateEmpty(this),
          new NODES.UpdateEnemy(this),
          new NODES.UpdateGrid(this),
        ]
      }),
      new NODES.SequenceAlwaysSuccess({
        children: [
          new NODES.FindCandidate(this),
          // new NODES.FindSafePlace(this),
          // new NODES.FindBombCandidate(this),
          // new NODES.FindBonusCandidate(this),
          new NODES.IsNearTeleport(this),
          new NODES.IsNotSafe(this),
        ]
      }),
      new Priority({
        children: [
          new Sequence({
            name: 'Eat',
            children: [
              new Priority({
                children: [
                  new Sequence({
                    name: 'keep old target if you can',
                    children: [
                      new NODES.HasTarget(this),
                      new Priority({
                        children: [
                          new Sequence({
                            children: [
                              new NODES.HasBonusCandidate(this),
                              new NODES.TargetBonusStillGood(this),
                            ]
                          }),
                          new NODES.TargetSafeStillGood(this)
                        ]
                      }),
                      new Priority({
                        children: [
                          new Sequence({
                            children: [
                              new NODES.HasBombCandidate(this),
                              new NODES.VoteTargetToCompareWithBomb(this)
                            ]
                          }),
                          new NODES.KeepOldTarget(this)
                        ]
                      })
                    ]
                  }),
                  new Sequence({
                    children: [
                      new NODES.HasBonusCandidate(this),
                      new Priority({
                        children: [
                          new Sequence({
                            children: [
                              new NODES.HasBombCandidate(this),
                              new NODES.VoteBonusToCompareWithBomb(this)
                            ]
                          }),
                          new Sequence({
                            children: [
                              new NODES.VoteBonus(this),
                              new NODES.MoveToBonus(this)
                            ]
                          })
                        ]
                      })
                    ]
                  })
                ]
              }),
              new Inverter({
                child: new NODES.HasTargetToCompareWithBomb(this)
              })
            ]
          }),
          new Sequence({
            children: [
              new NODES.HasBombCandidate(this),
              new Priority({
                children: [
                  new Sequence({
                    children: [
                      new NODES.HasTargetToCompareWithBomb(this),
                      new Priority({
                        children: [
                          new Sequence({
                            children: [
                              new NODES.IsOldTarget(this),
                              new NODES.VoteBombWithTargetCompare(this)
                            ]
                          }),
                          new Sequence({
                            children: [
                              new NODES.VoteBombWithBonusCompare(this),
                              new Priority({
                                children: [
                                  new Sequence({
                                    children: [
                                      new NODES.CheckWinner(this, 'bonusWinner'),
                                      new NODES.MoveToBonus(this),
                                    ]
                                  }),
                                  new Sequence({
                                    children: [
                                      new NODES.CheckWinner(this, 'bombWinner'),
                                      new NODES.MoveToDropBomb(this)
                                    ]
                                  })
                                ]
                              })
                            ]
                          })
                        ]
                      })
                    ]
                  }),
                  new Sequence({
                    children: [
                      new NODES.TargetSuitableWithBomb(this),
                      new NODES.VoteBombWithTarget(this),
                      new NODES.MoveToDropBombWithTarget(this)
                    ]
                  }),
                  new Sequence({
                    children: [
                      new NODES.VoteBomb(this),
                      new NODES.MoveToDropBomb(this)
                    ]
                  })
                ]
              })
            ]
          }),
          new Sequence({
            name: 'Safe',
            children: [
              new NODES.SequenceAlwaysSuccess({
                children: [
                  new NODES.IsBombPrefix(this),
                  new NODES.CleanGrid(this),
                  new NODES.CalculateBombDelay(this), // drop virtual bomb in next step, so re-update map... my lost
                  new NODES.UpdateGrid(this),
                  new NODES.FindSafePlace(this, true)
                ]
              }),
              new NODES.IsNotSafe(this),
              new Priority({
                children: [
                  new NODES.HasSafeCandidate(this),
                  new NODES.FindSafePlace(this)
                  // dead or alive. implement case all place are not safe -> find best place in that context
                ]
              }),
              new Priority({
                children: [
                  new Sequence({
                    children: [
                      new NODES.TargetSuitableWithSafe(this),
                      new NODES.VoteSafePlaceWithTarget(this),
                      new NODES.MoveToSafeWithTarget(this)
                    ]
                  }),
                  new Sequence({
                    children: [
                      new NODES.VoteSafePlace(this),
                      new NODES.MoveToSafe(this)
                    ]
                  })
                ]
              })
            ]
          }),
          new Sequence({
            children: [
              new NODES.StopIfNeeded(this)
            ]
          })
        ]
      })
    ]
  });
};

export default First;
