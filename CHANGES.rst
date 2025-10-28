Changes
=======

1.3 (unreleased)
----------------

- Pin upper versions of dependencies.
  [lenadax]


1.2 (2020-05-30)
----------------

- Add ``generix_required_extractor`` to cron widget extractors.
  [rnix]

- Raise ``ExtractionError`` if no valid cron rule can be built from received
  data.
  [rnix]

- If no cron rule criteria gets selected, widget extraction returns
  empty value.
  [rnix]

- Set ``persist`` to ``False`` on all subwidgets created by
  ``cron_edit_renderer`` for correct auto persistence.
  [rnix]

- No need to call cron widget when creating widget tree for proper extraction.
  [rnix]


1.1 (2018-07-16)
----------------

- Python 3 compatibility.
  [rnix]

- Convert doctests to unittests.
  [rnix]


1.0 (2018-01-27)
----------------

- Initial release.
  [thet, rnix]
