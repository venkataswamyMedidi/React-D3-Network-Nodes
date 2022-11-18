import * as React from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';

export default class Line extends React.Component {
  ref = null;
  countRef = null;
  componentDidMount() {
    const { link } = this.props;
    d3.select(this.ref).data([link]);
    d3.select(this.countRef).data([link]);
  }

  render() {
    const { link } = this.props;
    return (
      <g>
        <line
          className="link"
          stroke={'blue'}
          ref={ref => this.ref = ref}
          strokeWidth="2"
        />
        <text
            className="count"
            textAnchor="middle"
            ref={ref => this.countRef = ref}>
          10
        </text>
      </g>
    );
  }
}

Line.defaultProps = {
  link: {}
};

Line.propTypes = {
  link: PropTypes.shape(PropTypes.object),
};
