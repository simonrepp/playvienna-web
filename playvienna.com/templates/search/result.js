const match = ({ field, match, post, pre }) => `
  <div class="search__match theme__text">
    <i>
      ${pre || ''}
      <mark class="search__matchHighlight">
        ${match}
      </mark>
      ${post || ''}
    </i>
    &nbsp;(${field})
  </div>
`;

module.exports = ({ matches, title, url }) => `
  <div class="theme__block2x">
    <a class="theme__link" href="${url}">
      ${title}
    </a>

    ${matches.map(match).join('')}
  </div>
`;
