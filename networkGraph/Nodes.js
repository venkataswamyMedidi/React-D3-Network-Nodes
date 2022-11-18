import * as React from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import Node from './Node';

export default class Nodes extends React.Component {
  componentDidMount() {
    const { simulation } = this.props;

    const onDragStart = (id) => {
      const d = id;
      if (!d3.event.active) {
        simulation.alphaTarget(0.3).restart();
      }
      d.fx = d.x;
      d.fy = d.y;
    };

    const onDrag = (id) => {
      const d = id;
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    };

    const onDragEnd = (id) => {
      const d = id;
      if (!d3.event.active) {
        simulation.alphaTarget(0);
      }
      d.fx = null;
      d.fy = null;
    };

    d3.selectAll('.node')
      .call(d3.drag()
        .on('start', onDragStart)
        .on('drag', onDrag)
        .on('end', onDragEnd));
  }

  render() {
    const { nodes } = this.props;
    return (
      <g className="nodes">
        {
          nodes.map((node, index) => (
            <Node key={index.toString()} node={node} />
          ))
        }
      </g>
    );
  }
}

Nodes.propTypes = {
  simulation: PropTypes.shape(PropTypes.any.isRequired).isRequired,
  nodes: PropTypes.arrayOf(PropTypes.any.isRequired).isRequired,
};
