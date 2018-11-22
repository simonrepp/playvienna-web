const translate = require('../../lib/translate.js');

module.exports = (context, media, mode = 'wide') => media.length > 0 ? `
<div class="${mode === 'wide' ? 'media__wide' : 'media__compact'} theme__margin">
  ${mode === 'compact' ? `
    <strong class="theme__strong">
      ${translate(context, 'Media')}
    </strong>
  `:''}

  <div class="media__thumbnails">
    ${media.map((source, index) => `
      <a class="media__thumbnailLink"
         ${source.label ? `data-label="${source.label}"` : ''}
         data-url="${source.file.url}"
         href="${source.file.url}">
        <img alt="${source.label ? source.label : source.file.name}"
             class="media__thumbnailImage"
             src="${source.file.url}"
             ${source.label ? `title="${source.label}"` : ''}>
      </a>
    `).join('')}
  </div>
</div>
`:'';

// TODO
// const Navigation = ({ availableWidth, index, media, setIndex }) => {
//   if(media.length === 1) { return null; }
//
//   let navFrom = 0;
//   let navTo = media.length;
//
//   const neighborsShown = Math.floor(2 + Math.max(0, availableWidth - 280) / 60) * 2;
//   if(media.length > 1 + neighborsShown) {
//     if(index - (neighborsShown / 2)  <= 0) {
//       navFrom = 0;
//       navTo = neighborsShown;
//     } else if(index + (neighborsShown / 2) >= media.length - 1) {
//       navTo = media.length - 1;
//       navFrom = navTo - neighborsShown;
//     } else {
//       navFrom = index - (neighborsShown / 2);
//       navTo = index + (neighborsShown / 2);
//     }
//   }
//
//   return(
//     <div class="media__navigation">
//     {media.map((image, iterIndex) =>
//       <a class="media__navigationLink, iterIndex === index ? media__navigationLinkActive : null)}
//          onClick={(event) => { event.stopPropagation(); setIndex(iterIndex); }}
//          style={(iterIndex < navFrom || iterIndex > navTo) ? { display: 'none' } : {}">
//
//         {/*(iterIndex === navFrom || iterIndex === navTo) &&
//           iterIndex !== 0 &&
//           iterIndex !== media.length - 1 ? '...' : iterIndex + 1*/}
//       </a>
//     )}
//     </div>
//   );
// };
//
// class Viewer extends React.Component {
//   handleKeypress = (event) => {
//     const { index, media, setIndex } = this.props;
//
//     event.preventDefault();
//
//     if(event.key === 'Escape') {
//       setIndex(null);
//     } else if(event.key === 'ArrowLeft' && index > 0) {
//       setIndex(index - 1);
//     } else if(event.key === 'ArrowRight' && index + 1 < media.length) {
//       setIndex(index + 1);
//     }
//   }
//
//   updateAvailableSpace = () => {
//     const { index, media } = this.props;
//     const { innerHeight, innerWidth } = window;
//
//     const padding = Math.min(innerHeight, innerWidth) / 10;
//
//     this.setState({
//       availableWidth: innerWidth - padding
//     });
//   }
//
//   componentDidMount() {
//     this.updateAvailableSpace();
//
//     document.addEventListener('keypress', this.handleKeypress);
//     window.addEventListener('resize', this.updateAvailableSpace);
//   }
//
//   componentWillUnmount() {
//     document.removeEventListener('keypress', this.handleKeypress);
//     window.removeEventListener('resize', this.updateAvailableSpace);
//   }
//
//   render() {
//     const { index, media, setIndex } = this.props;
//     const { availableHeight, availableWidth } = this.state;
//     const image = media[index];
//
//     const aspectRatio = image.file.fullsize.sizes.aspectRatio;
//     let fittedWidth = availableWidth;
//     let fittedHeight = availableHeight;
//     if(aspectRatio < availableWidth / availableHeight) {
//       fittedWidth = availableHeight * aspectRatio;
//     } else {
//       fittedHeight = availableWidth / aspectRatio;
//     }
//
// class Media extends React.Component {
//   constructor(props) {
//     super(props);
//
//     this.state = { viewing: null };
//   }
//
//   setIndex = (index) => {
//     this.setState({ viewing: index });
//   }
//
//   render() {
//     let viewer = null;
//     if(this.state.viewing !== null) {
//       viewer = <Viewer index={this.state.viewing}
//                        media={this.props.media}
//                        setIndex={this.setIndex} />
//     }
