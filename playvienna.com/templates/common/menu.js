module.exports = (context, items, mode = 'adaptive', placeholder) => {
  const activeItem = items.find(item => item.active);

  const options = items.map(item => `
    <a class="menu__option" href="${item.url}">
      ${item.label}
    </a>
  `).join('');

  const select = `
    <div class="menu__select ${mode === 'adaptive' ? 'menu__selectAdaptive' : ''}">
      <a class="menu__placeholder">
        ${activeItem ? activeItem.label : placeholder} <span class="icon-dropdown"></span>
      </a>
    </div>
  `;

  let tabs = '';
  if(mode === 'adaptive') {
    tabs = `
      <div class="menu__tabs">
        ${items.map(item => `
          <a class="menu__tab ${item.active ? 'active' : ''}" href="${item.url}">
             ${item.label}
          </a>
        `).join('')}
      </div>
    `;
  }

  const html = `
<div class="menu__container">
  <div class="menu__bar">
    <div class="layout__xPaddingFromRestraint layout__xRestraintFromRestraint">
      ${select}
      ${tabs}
    </div>
  </div>

  <div class="layout__xPaddingFromRestraint layout__xRestraintFromRestraint menu__optionsContainer">
    <div class="menu__options">
      ${options}
    </div>
  </div>
</div>
  `;

  return html;
};
