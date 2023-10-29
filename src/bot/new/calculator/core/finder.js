import AI from './ai';
import _ from 'lodash';

AI.prototype.conditionSafeFn = function(node, grid, passive, scare, faster = true) {
  const {
    travelCost,
    flameRemain = []
  } = node;

  if (travelCost > 0) {
    const acceptFlame = flameRemain.length <= 0;

    if (faster) {
      var acceptFaster = this.fasterEnemy(node, travelCost, 0);
    } else {
      acceptFaster = true;
    }

    return {
      acceptFlame,
      acceptFaster
    }
  } else {
    return {
      acceptFlame: false,
      acceptFaster: false
    }
  }
};

AI.prototype.interviewSafe = function(candidates, passive) {
  let interview = true;

  if (interview && candidates.length > 0) {
    const temp = _.filter(candidates, candidate => {
      const { scare } = candidate;
      return this.filterSafeScareLevel0(passive, scare);
    });

    if (temp.length > 0) {
      candidates = temp;
    } else {
      interview = false;
    }
  }

  if (interview && candidates.length > 0) {
    const temp = _.filter(candidates, candidate => {
      const { scare } = candidate;
      return this.filterSafeScareLevel1(passive, scare);
    });

    if (temp.length > 0) {
      candidates = temp;
    } else {
      interview = false;
    }
  }

  if (interview && candidates.length > 0) {
    const temp = _.filter(candidates, candidate => {
      const { scare } = candidate;
      return this.filterSafeScareLevel2(passive, scare);
    });

    if (temp.length > 0) {
      candidates = temp;
    } else {
      interview = false;
    }
  }

  if (interview && candidates.length > 0) {
    const temp = _.filter(candidates, candidate => {
      const { scare } = candidate;
      return this.filterSafeScareLevel3(passive, scare);
    });

    if (temp.length > 0) {
      candidates = temp;
    } else {
      interview = false;
    }
  }

  return candidates;
};

AI.prototype.filterSafeScareLevel0 = function(scare, passive) {
  const filtered = _(scare)
    .uniqBy(o => `${o.type}-${o.index}`)
    .filter(o => o.main && (o.dx == 0 || o.dy == 0) && o.distance <= 1 && o.step >= 0 && o.step <= 3)
    .value();

  return passive >= filtered.length
};

AI.prototype.filterSafeScareLevel1 = function(scare, passive) {
  const filtered = _(scare)
    .uniqBy(o => `${o.type}-${o.index}`)
    .filter(o => o.main && (o.dx == 0 || o.dy == 0) && o.step >= 0 && o.step <= 3)
    .value();

  return passive >= filtered.length
};

AI.prototype.filterSafeScareLevel2 = function(scare, passive) {
  const filtered = _(scare)
    .uniqBy(o => `${o.type}-${o.index}`)
    .filter(o => o.main && o.step >= 0)
    .value();

  return passive >= filtered.length;
};

AI.prototype.filterSafeScareLevel3 = function(scare, passive) {
  const filtered = _(scare)
    .uniqBy(o => `${o.type}-${o.index}`)
    .filter(o => (o.main && o.step >= 0) || o.step <= 3)
    .value();

  return passive >= filtered.length;
};

AI.prototype.conditionBombFn = function(node, tpc, remain) {
  const {
    travelCost,
    value,
    bombProfit,
    flameRemain = []
  } = node;

  if (travelCost == undefined || travelCost == null || travelCost < 0) {
    return false;
  }
  if (!bombProfit) {
    return false;
  }

  const { box, enemy, enemy_egg, safe } = bombProfit;

  const hasBenefit = travelCost >= 0 && safe == true && (this.countingScore({ box, enemy, enemy_egg }) > 0);

  if (!hasBenefit) {
    return false;
  }

  const travelTime = tpc * travelCost;

  const ff = _(flameRemain)
    .map(f => f + 400 + tpc/2 + 300 - travelTime)
    .filter(f => f > 0)
    .value();

  if (ff.length > 0/* && travelTime < remain + 50*/) {
    // that pos not safe and move to that pos can not drop bomb immediately
    return false;
  }

  return true;
};

AI.prototype.interviewBomb = function(candidates) {
  return candidates;
};

AI.prototype.conditionBonusFn = function(node) {
  const {
    travelCost,
    value,
    scoreProfit = {}
  } = node;

  const { gifts, spoils, virus, human } = scoreProfit;

  return travelCost >= 0 && (this.countingScore({ gifts, spoils, virus, human }) > 0);
};

AI.prototype.interviewBonus = function(candidates) {
  return candidates;
};

export default AI;
