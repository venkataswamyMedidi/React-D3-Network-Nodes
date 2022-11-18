import * as React from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';

export default class Label extends React.Component {
  ref = null;

  componentDidMount() {
    const { node } = this.props;
    d3.select(this.ref).data([node]);
  }

  render() {
    const { node } = this.props;
    return (
      <text className="label" ref={(ref => this.ref = ref)}>
        {node.id}
      </text>
    );
  }
}

Label.propTypes = {
  node: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};
