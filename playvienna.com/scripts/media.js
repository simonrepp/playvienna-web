const view = element => {
  const label = element.dataset.label;
  const type = element.dataset.type;
  const url = element.dataset.url;

  const viewer = document.createElement('div');

  viewer.classList.add('media__viewer');

  let media;
  if(type === 'image') {
    media = `<img src="${url}">`;
  } else if(type === 'video') {
    media = `<video controls src="${url}"></video>`;
  } else if(type === 'vimeo') {
    media = `
      <iframe allow="autoplay; encrypted-media"
              allowfullscreen
              frameborder="0"
              onload="this.classList.add('loaded')"
              src="${url}"></iframe>
    `;
  } else if(type === 'youtube') {
    media = `
      <iframe allowfullscreen
              frameborder="0"
              onload="this.classList.add('loaded')"
              src="${url}"></iframe>
    `;
  }

  viewer.innerHTML = `
${media}
<div class="media__caption">${label ? label : ''}</div>
  `;

  document.body.appendChild(viewer);
};

// <Navigation availableWidth={availableWidth}
//             fittedHeight={fittedHeight}
//             index={index}
//             media={media} >

exports.handleClick = event => {
  const viewer = document.querySelector('.media__viewer');

  if(viewer && viewer.contains(event.target)) {
    document.body.removeChild(viewer);
    return true;
  }

  const links = document.querySelectorAll('.media__thumbnailLink');

  for(let link of links) {
    if(link.contains(event.target)) {
      event.preventDefault();

      view(link);

      return true;
    }
  }

  return false;
};
