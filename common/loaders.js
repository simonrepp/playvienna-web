const fsExtra = require('fs-extra');
const markdownIt = require('markdown-it')({ html: true });
const path = require('path');
const sharp = require('sharp');
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

    const url = match[1];
    const label = match[2];

    if(url.match(/^https:\/\/www\.youtube-nocookie\.com\/embed\/.+/)) {
      return {
        label,
        type: 'youtube',
        url
      };
    } else if(url.match(/^https:\/\/player\.vimeo\.com\/video\/.+/)) {
      return {
        label,
        type: 'vimeo',
        url
      };
    } else {
      if(!data.media.hasOwnProperty(url))
        throw `Die Datei '${url}' wurde nicht gefunden, eventuell ein Tippfehler im Pfad?`;

      const extension = path.extname(url);

      let compressed;
      let type;
      if(extension.match(/\.(jpg|jpeg|png)/i)) {
        type = 'image';

        const imageData = data.media[url];

        if(!imageData.compressed) {
          const imagePath = path.join(data.contentDir, imageData.url);
          const compressedUrl = imageData.url.replace(/\.[^.]+$/, '.compressed.jpg');
          const compressedPath = path.join(data.buildDir, compressedUrl);

          const operation = fsExtra.ensureDir(path.dirname(compressedPath))
                                   .then(() => sharp(imagePath).resize(2560)
                                                               .withoutEnlargement()
                                                               .toFile(compressedPath));

          data.asyncProcessing.push(operation);

          imageData.compressed = compressedUrl;
        }
      } else if(extension.match(/\.(ogv|mkv|mov|mp4)/i)) {
        type = 'video';
      } else {
        throw `Die Dateiendung '${extension}' wird für Medienangaben (noch) nicht unterstützt - eventuell Machbarkeit erfragen falls benötigt.`;
      }

      return {
        file: data.media[url],
        label,
        type
      };
    }
  };
};

exports.strip = ({ value }) => striptags(markdownIt.render(value));
