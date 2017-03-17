

- [x] Buttonfarbe,
- [x] 7er block bei dom
- [x] month: 6er block (oder 3)
- [x] year: alles vor aktuellem jahr weg.

- [x] inputs schmäler, label davor, edit hinten
- [x] inputs inaktiv?

- [x] buttons weniger minesweeper, mehr bootstrap (eventuell wegen active class?)
- [x] bootstrap basis style, hintergrundfarbe



obsolete:

- bootstrap btn (yafowil.plone) via fatcory defaults...

nice to have:

- JavaScript: do not use a global value, which prevents support for multiple widgets on one side.
  this is at least a problem for the summary.

- widget auflösen?
- ranges,...?
... touchup ?
... extractor + render value translator


- document the 4 test cases from widgets.rst in yafowil main docs:
  - extraction without preset value and request form set,
  - extraction without preset value but request form set,
  - extraction with preset value but no request form set,
  - extraction with preset value and request form set.


- verify:
  "This causes the callable chains of each blueprint beeing executed in order. Extractors are executed from right to left while all others are executed left to right."
  it seems to be the other way around.
  http://docs.yafowil.info/architecture.html

