window.app = window.app || {};
(function f() {
    'use strict';
    var app = window.app,
        DEFECT = app.DEFECT = window.app.DEFECT || 1,
        COOPERATE = app.COOPERATE = window.app.COOPERATE || 0;

    app.AllC = function AllC() {
        return COOPERATE;
    };

    app.AllD = function AllD() {
        return DEFECT;
    };

    app.Rand = function Rand() {
        return (Math.random() > 0.5) ? COOPERATE : DEFECT;
    };

    app.Grim = function Grim(opponentHistory) {
        return opponentHistory.some(function (elem) {
            return elem.move === DEFECT;
        }) ? DEFECT : COOPERATE;
    };

    app.Neg = function Neg(opponentHistory) {
        var lastOpponent = opponentHistory.slice(-1)[0];
        return (lastOpponent && lastOpponent.move === COOPERATE) ? DEFECT : COOPERATE;
    };

    app.TFT = function TFT(opponentHistory) {
        var lastOpponent = opponentHistory.slice(-1)[0];
        if (lastOpponent) {
            return lastOpponent.move;
        }
        return COOPERATE;
    };

    app.STFT = function STFT(opponentHistory) {
        var lastOpponent = opponentHistory.slice(-1)[0];
        if (lastOpponent) {
            return lastOpponent.move;
        }
        return DEFECT;
    };

    app.TFTT = function TFTT(opponentHistory) {
        return opponentHistory.length > 1 && opponentHistory[opponentHistory.length - 1].move === DEFECT && opponentHistory[opponentHistory.length - 2].move === DEFECT ? DEFECT : COOPERATE;
    };

    app.Pavlov = function Pavlov(opponentHistory, ownHistory) {
        if (ownHistory.length) {
            var lastOwn = ownHistory.slice(-1)[0];
            return lastOwn.success ? lastOwn.move : lastOwn.move === DEFECT ? COOPERATE : DEFECT;
        }
        return (Math.random() > 0.5) ? COOPERATE : DEFECT;
    };

    app.CD = function CD(opponentHistory, ownHistory) {
        if (ownHistory.length) {
            var lastOwn = ownHistory.slice(-1)[0];
            return lastOwn.move === DEFECT ? COOPERATE : DEFECT;
        }
        return COOPERATE;
    };
    
    app.SoftMajo = function SoftMajo(opponentHistory) {
        var cooperateCount = opponentHistory.filter(function (x) {
            return x.move === COOPERATE;
        }).length;
        return (2 * cooperateCount >= opponentHistory.length) ? COOPERATE : DEFECT;
    };
    app.strategies = [{
        f: app.AllC,
        name: "AllC"
    }, {
        f: app.AllD,
        name: "AllD"
    }, {
        f: app.Rand,
        name: "Rand"
    }, {
        f: app.Grim,
        name: "Grim"
    }, {
        f: app.Neg,
        name: "Neg"
    }, {
        f: app.TFT,
        name: "TFT"
    }, {
        f: app.STFT,
        name: "STFT"
    }, {
        f: app.TFTT,
        name: "TFTT"
    }, {
        f: app.Pavlov,
        name: "Pavlov"
    }, {
        f: app.CD,
        name: "CD"
    }, {
        f: app.SoftMajo,
        name: "SoftMajo"
    }];
}());
