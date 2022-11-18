import * as React from 'react';
import PropTypes from 'prop-types';
import Label from './Label';

const Labels = (props) => {
  const { nodes } = props;
  const labels = nodes.map((node, index) => (
    <Label key={index.toString()} node={node} />
  ));

  return (
    <g className="labels">
      {labels}
    </g>
  );
};

Labels.propTypes = {
  nodes: PropTypes.arrayOf(PropTypes.any.isRequired).isRequired,
};

export default Labels;
