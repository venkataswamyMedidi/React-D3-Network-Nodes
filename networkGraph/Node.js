import * as React from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';

const PIE = 22/7;
const RADIUS = PIE * 6.05;
const SIZE = 2;

export default class Node extends React.Component {
  ref = null;

  children = [];

  componentDidMount() {
    const { node } = this.props;

    d3.select(this.ref).data([node]);

    const children = [{ value: 50 }, { value: 50 }];

    node.total = children.reduce((total, i) => total + i.value, 0);

    let tempPercent = 100 * SIZE;

    this.children = children.map((a) => {
      const percentage = (a.value * 100 * SIZE) / node.total;
      const val = {
        percentage,
        value: a.value,
        offset: tempPercent - (100 * SIZE),
        dasharray: `${percentage} ${((100 * SIZE) - percentage)}`,
      };
      tempPercent -= percentage;
      return val;
    });
    this.forceUpdate();
  }

  render() {
    const arcColors =  ['#43bc83', '#ffbd3a', '#9a73cc', '#ffbd3a'];
    const radius = SIZE * RADIUS;
    const circles = (this.children || []).map((child, index) => (
      <circle key={index.toString()} r={radius} fill="transparent" strokeWidth={'0.3rem'} stroke={arcColors[index]} strokeDasharray={child.dasharray} strokeDashoffset={child.offset} />
    ));

    return (
      <g className="node" ref={(ref) => { this.ref = ref; }}>
        <circle r={radius} fill="#fff" strokeWidth="1" stroke="#f11" />
        <text
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="dls-icons"
          fontSize="20"
        />
        {circles}
      </g>
    );
  }
}

Node.propTypes = {
  node: PropTypes.shape().isRequired,
};
