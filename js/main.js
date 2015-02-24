var start = function (gamesCount, roundsCount) {
    'use strict';
    var app = window.app,
        payoffMatrix = [
            [3, 0],
            [5, 1]
        ],
        successPayoff = [payoffMatrix[0][0], payoffMatrix[0][1], payoffMatrix[1][0], payoffMatrix[1][1]].sort().slice(-2),
        maxSum = 2 * payoffMatrix[0][0] * roundsCount,
        penalty = {
            movesCountAnalyze: 5,
            chance: 0.7,
            coeff: 0.2
        },
        play = function (StrategyA, StrategyB, enableLogging) {
            var acc = [0, 0, 0],
                i;
            for (i = 0; i < gamesCount; i += 1) {
                new app.Game(
                    payoffMatrix,
                    successPayoff,
                    StrategyA,
                    StrategyB,
                    roundsCount,
                    penalty,
                    enableLogging
                ).play().getResults().forEach(function (el, index) {
                    acc[index] += el;
                });
            }
            return acc.map(function (num) {
                return Math.round(num / gamesCount * 100) / 100;
            });
        },
        getOptimalResults = function (matrix) {
            var optimalResult = [],
                row,
                rowsCount,
                column,
                columnsCount;
            for (row = 0, rowsCount = matrix.length; row < rowsCount; row += 1) {
                var maxColumnValue = 0,
                    maxColumnIndexes = [];
                for (column = 0, columnsCount = matrix[row].length; column < columnsCount; column += 1) {
                    if (maxColumnValue < matrix[row][column][1]) {
                        maxColumnValue = matrix[row][column][1];
                        maxColumnIndexes = [column];
                    } else if (maxColumnValue === matrix[row][column][1]) {
                        maxColumnIndexes.push(column);
                    }
                }
                maxColumnIndexes.forEach(function (column) {
                    var isOptimalInColumn = true,
                        i;

                    for (i = 0; i < rowsCount; i += 1) {
                        if (matrix[row][column][0] < matrix[i][column][0]) {
                            isOptimalInColumn = false;
                            break;
                        }
                    }
                    if (isOptimalInColumn) {
                        optimalResult.push({
                            'value': matrix[row][column],
                            'row': row + 1,
                            'column': column + 1
                        });
                    }
                });
            }
            return optimalResult;
        },
        getMaxOptimalResults = function (optimalResults) {
            var result = [optimalResults[0]],
                i;
            for (i = 1; i < optimalResults.length; i += 1) {
                if (result[0].value[2] < optimalResults[i].value[2]) {
                    result = [optimalResults[i]];
                } else if (result[0].value[2] === optimalResults[i].value[2]) {
                    result.push(optimalResults[i]);
                }
            }
            return result;
        },
        renderChart = function (matrix) {
            var rows, columns,
                $charts = $('.charts li');
            for (rows = 0; rows < matrix.length; rows += 1) {
                var data = [];
                for (columns = 0; columns < matrix[rows].length; columns += 1) {
                    var el = matrix[rows][columns];
                    data.push({
                        name: el[4],
                        a: el[0],
                        b: el[1],
                        sum: el[2]
                    });
                }
                Morris.Bar({
                    element: $('<div/>', {
                        class: 'chart'
                    }).appendTo($charts.eq(rows)),
                    data: data,
                    xkey: 'name',
                    ykeys: ['a', 'b', 'sum'],
                    //labels: ['Игрок A', 'Игрок B', 'Сумма'],
                    ymax: maxSum,
                    hideHover: 'always'
                });
            }
        },
        renderOptimalResults = function (result, renderToSelector) {
            var $ol = $('<ol/>');
            result.forEach(function (el) {
                var val = el.value;
                $('<li/>', {
                    text: val[3] + ' / ' + val[4] + ': ' + val.slice(0, 3).join(', ')
                }).appendTo($ol);
            });
            $(renderToSelector).append($ol);
        };
    var matrixResult = [],
        tableResult = {};

    app.strategies.forEach(function (StrategyA) {
        var rowTable = {},
            rowMatrix = [],
            nameA = StrategyA.name;
        app.strategies.forEach(function (StrategyB) {
            var nameB = StrategyB.name,
                avgResult = play(StrategyA.f, StrategyB.f);
            rowTable[nameB] = "[" + avgResult.reduce(function (a, b) {
                return a + ", " + b;
            }) + "]";
            rowMatrix.push(avgResult.concat([nameA, nameB]));
        });
        tableResult[nameA] = rowTable;
        matrixResult.push(rowMatrix);
    });
    renderChart(matrixResult);
    if (console.table)
        console.table(tableResult);

    var optimalResults = getOptimalResults(matrixResult);
    renderOptimalResults(optimalResults, '.nash');
    console.log(optimalResults);
    var maxOptimalResult = getMaxOptimalResults(optimalResults);
    renderOptimalResults(maxOptimalResult, '.pareto');
    console.log(maxOptimalResult);
}

$(function () {
    start($('#gamesCount').val(), $('#roundsCount').val());
    var resetUI = function () {
        $('.chart').remove();
        $('.equilibrium li').remove();
    }
    $('#restart').click(function () {
        var gamesCount = $('#gamesCount').val() >> 0,
            roundsCount = $('#roundsCount').val() >> 0,
            $parent = $(this).parent();

        //primitive validation
        $parent.find('.status').remove();
        if (Number.isInteger(gamesCount) && Number.isInteger(roundsCount) && gamesCount > 0 && roundsCount > 1) {
            resetUI();
            start(gamesCount, roundsCount);
            $('html, body').animate({
                scrollTop: $(".charts").offset().top
            }, 500);
            $parent.append('<div class="status success">Готово<div>');
        } else {
            $parent.append('<div class="status error">Некорректные данные<div>');
        }
    });
});
