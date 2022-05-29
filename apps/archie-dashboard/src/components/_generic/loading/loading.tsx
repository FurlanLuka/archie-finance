import { LoadingStyled } from './loading.styled';

/**
 * A loading indicator.
 * @param {ComponentProps} props
 * @returns {StatelessComponent}
 */
const Loading = () => (
  <LoadingStyled>
    <div className="inner">
      <div className="rect rect1"></div>
      <div className="rect rect2"></div>
      <div className="rect rect3"></div>
      <div className="rect rect4"></div>
      <div className="rect rect5"></div>
    </div>
  </LoadingStyled>
);

export default Loading;
