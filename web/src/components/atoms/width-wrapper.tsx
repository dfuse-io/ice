import { styled, STANDARD_PADDING, MEDIA_QUERIES } from "../../theme"

export const WidthWrapper = styled.div`
  max-width: 1900px;
  width: 100%;
  margin: 0px auto;
  padding: ${STANDARD_PADDING};
  position: relative;

  ${MEDIA_QUERIES.smallOnly} {
    padding: 0px;
  }
`
