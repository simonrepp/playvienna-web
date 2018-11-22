exports.handleClick = event => {
  const toggle = document.querySelector('.header__sidebar_toggle');

  if(toggle && toggle.contains(event.target)) {
    const wrapper = document.querySelector('.layout__wrapper');

    wrapper.classList.toggle('displaced');

    return true;
  }

  return false;
};
