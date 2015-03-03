Prisoner's Dilemma
========
Моделирование поведения команды игроками с разными стратегиями

Для просмотра результатов и изменения параметров моделирования необходимо скопировать все файлы и открыть [index.html](https://github.com/fib0n/newDilemma/blob/dev/index.html) в современном браузере (желательно в chrome - разработка и тестирование проводилась в версии chrome 40.0.2214.94 (64-bit))

Usage:
==
```
git clone https://github.com/fib0n/newDilemma.git && cd dilemma && git checkout dev
npm install
npm test
```

Для тестирования используется [Jasmine](http://jasmine.github.io/). Покрытие кода считается с помощью [Istanbul](https://github.com/gotwarlost/istanbul) и [Karma](https://github.com/karma-runner/karma)

Тестирование и анализ покрытия проводился для файла [strategy.js](https://github.com/fib0n/newDilemma/blob/dev/js/strategy.js). Сгенерированные отчеты о результатах теста лежат в папке /js/test_results/.../index.html). Сгенерированный отчет о покрытии кода в /js/coverage/.../index.html).

В качестве CI используется [Travis](https://travis-ci.org/fib0n/newDilemma/builds), сборка деплоится [npm](https://www.npmjs.com/package/new_prisoner_dilemma)
