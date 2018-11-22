const view = element => {
  const label = element.dataset.label;
  const url = element.dataset.url;

  const viewer = document.createElement('div');

  viewer.classList.add('media__viewer');

  viewer.innerHTML = `
<style>
  /*.fittedWidth { width: calc(100vh * {aspectRatio}); }
  @media (max-aspect-ratio: {Math.floor(aspectRatio*1000)}/1000) {
    .fittedWidth { width: calc(100vw); }
  }*/
</style>

<div class="fittedWidth">
  <img src="${url}">
</div>

<!--Navigation availableWidth={availableWidth}
fittedHeight={fittedHeight}
index={index}
media={media} -->

<div class="media__caption">
  ${label ? label : ''}
</div>
  `;

  document.body.appendChild(viewer);
};

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
