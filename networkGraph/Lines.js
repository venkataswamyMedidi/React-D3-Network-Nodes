import * as React from 'react';
import PropTypes from 'prop-types';
import Line from './Line';

const Lines = (props) => {
  const { links } = props;

  return (
    <g className="links">
      {
        links.map((link, index) => (
          <Line key={index.toString()} link={link} />
        ))
      }
    </g>
  );
};

Lines.defaultProps = {
  links: [],
};

Lines.propTypes = {
  links: PropTypes.arrayOf(PropTypes.any.isRequired),
};

export default Lines;
