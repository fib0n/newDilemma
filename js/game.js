window.app = window.app || {};
window.app.Game = function (payoffMatrix, successPayoff, strategyA, strategyB,
    rounds, penalty, logging) {
    'use strict';
    window.app.DEFECT = 1;
    window.app.COOPERATE = 0;

    var results = {
        a: 0,
        b: 0
    };
    this.play = function () {
        var history = {
                a: [],
                b: []
            },
            curStep = 0;

        for (curStep = 1; curStep <= rounds; curStep += 1) {
            var moveA = strategyA(history.b, history.a),
                moveB = strategyB(history.a, history.b),
                resultA = this.getPayoff(history.a, moveA, moveB),
                resultB = this.getPayoff(history.b, moveB, moveA);

            history.a.push({
                'move': moveA,
                'result': resultA,
                'success': successPayoff.indexOf(resultA) > -1
            });
            history.b.push({
                'move': moveB,
                'result': resultB,
                'success': successPayoff.indexOf(resultB) > -1
            });

            results.a += resultA;
            results.b += resultB;
            if (logging) {
                console.log(strategyA.name + ": " + moveA + ". total: " + results[0]);
                console.log(strategyB.name + ": " + moveB + ". total: " + results[1]);
            }
        }
        return this;
    };

    this.getPayoff = function (ownHistory, moveA, moveB) {
        var fairPayOff = payoffMatrix[moveA][moveB],
            previousMovesCount = ownHistory.length;
        if (previousMovesCount < penalty.movesCountAnalyze) {
            return fairPayOff;
        }

        var sum = 0,
            i;
        for (i = 1; i <= penalty.movesCountAnalyze; i += 1) {
            if (ownHistory[previousMovesCount - i].move === app.COOPERATE) {
                return fairPayOff;
            }

            sum += ownHistory[previousMovesCount - i].result;
        }
        return (Math.random() > penalty.chance) ? -penalty.coeff * sum : payoffMatrix[moveA][moveB];
    };

    this.getResults = function () {
        return [results.a, results.b, results.a + results.b];
    };
};
