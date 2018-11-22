exports.handleClick = event => {
  const placeholder = document.querySelector('.menu__placeholder');

  if(placeholder && placeholder.contains(event.target)) {
    const container = document.querySelector('.menu__container');

    container.classList.toggle('open');

    return true;
  }

  return false;
};
