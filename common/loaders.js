const markdownIt = require('markdown-it')({ html: true });
const striptags = require('striptags');

const EVENT_TYPES = [
  'Fair Booth',
  'Festival',
  'Lecture',
  'Meet',
  'Panel Discussion',
  'Play',
  'Playtest',
  'Talk',
  'Workshop'
];

exports.download = data => {
  return ({ value }) => {
    const match = value.match(/^([^ ]+)(?: +\( *(.+)? *\))?$/);

    if(!match)
      throw `Downloadangaben sind nur in den folgenden zwei Formaten erlaubt: 'media/folder/example.jpg' oder 'media/folder/example.jpg (Titel)'`

    const file = match[1];
    const label = match[2];

    if(!data.media.hasOwnProperty(file))
      throw `Die Datei ${file} wurde nicht gefunden, eventuell ein Tippfehler im Pfad?`;

    return { file: data.media[file], label: label };
  };
};

exports.eventType = ({ value }) => {
  return value.split(',').map(type => {
    const trimmed = type.trim();

    if(!EVENT_TYPES.includes(trimmed))
      throw `Unbekannter Event Typ '${trimmed}' gefunden, erlaubt sind: ${EVENT_TYPES.map(type => `'${type}'`).join(', ')}`

    return trimmed;
  });
};

exports.link = ({ value }) => {
  const match = value.match(/^(https?:\/\/[^ ]+)(?: +\( *(.+)? *\))?$/);

  if(!match)
    throw `Linkangaben sind nur in den folgenden zwei Formaten erlaubt: 'https://example.com' oder 'https://example.com (Titel)'`

  return { label: match[2] ? match[2] : null, url: match[1] };

};

exports.markdown = ({ value }) => markdownIt.render(value);

exports.media = data => {
  return ({ value }) => {
    const match = value.match(/^([^ ]+)(?: +\( *(.+)? *\))?$/);

    if(!match)
      throw `Medienangaben sind nur in den folgenden zwei Formaten erlaubt: 'media/folder/example.jpg' oder 'media/folder/example.jpg (Titel)'`

    const file = match[1];
    const label = match[2];

    if(!data.media.hasOwnProperty(file))
      throw `Die Datei ${file} wurde nicht gefunden, eventuell ein Tippfehler im Pfad?`;

    return { file: data.media[file], label: label };
  };
};

exports.strip = ({ value }) => striptags(markdownIt.render(value));
