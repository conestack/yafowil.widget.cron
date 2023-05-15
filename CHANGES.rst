Changes
=======

2.0a2 (unreleased)
------------------

- Nothing changed yet.


2.0a1 (2023-05-15)
------------------

- Add ``webresource`` support.
  [rnix]

- Extend JS by ``cron_on_array_add`` and ``register_array_subscribers``
  functions to enable usage in ``yafowil.widget.array``.
  [lenadax]

- Rewrite JavaScript using ES6.
  [rnix]


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
