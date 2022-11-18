import * as React from "react";
import * as d3 from "d3";
import PropTypes from "prop-types";
import Lines from "./Lines";
import Nodes from "./Nodes";
import Labels from "./Labels";

export default class NetworkGraph extends React.Component {
  simulation = null;

  constructor(props) {
    super(props);
    const simulation = d3
      .forceSimulation()
      .force("link", d3.forceLink().id(d => d.id))
      .force(
        "charge",
        d3
          .forceManyBody()
          .strength(-props.width)
          .distanceMin(0)
          .distanceMax(1000)
      )
      .force("center", d3.forceCenter(props.width / 2, props.height / 2))
      .nodes(props.graph.nodes);

    simulation.force("link").links(props.graph.links);
    this.simulation = simulation;

    this.showTooltip = this.showTooltip.bind(this);
    this.hideTooltip = this.hideTooltip.bind(this);
  }

  componentDidMount() {
    const { graph, width, height, actions } = this.props;
    const positions = [
      { x: 50, y: 50 },
      { x: 20, y: 45 },
      { x: 80, y: 50 },
      { x: 50, y: 20 },
      { x: 50, y: 80 },
      { x: 75, y: 75 },
      { x: 75, y: 25 },
      { x: 35, y: 75 },
      { x: 25, y: 25 },
      { x: 70, y: 90 },
      { x: 22.5, y: 62.5 },
      { x: 62.5, y: 22.5 },
      { x: 50, y: 50 }
    ];
    graph.nodes.forEach((item, index) => {
      const element = item;
      element.x = (positions[index].x * width) / 100;
      element.y = (positions[index].y * height) / 100;
    });

    const node = d3.selectAll(".node");
    const link = d3.selectAll(".link");
    const count = d3.selectAll(".count");
    const label = d3.selectAll(".label");

    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y)
      .on("click", d => (actions.onLinkClick ? actions.onLinkClick(d) : null))
      .on("mouseenter", d => this.showTooltip(d, "link"))
      .on("mouseleave", d => this.hideTooltip(d, "link"));

    count
      .attr("dx", d => (d.source.x + d.target.x) / 2)
      .attr("dy", d => (d.source.y + d.target.y) / 2);

    node
      .attr("transform", d => `translate(${d.x},${d.y})`)
      .on("click", d => (actions.onNodeClick ? actions.onNodeClick(d) : null))
      .on("mousemove", d => this.showTooltip(d, "node"))
      .on("mouseleave", d => this.hideTooltip(d, "node"));

    label
      .attr("x", d => d.x)
      .attr("y", d => d.y + 40)
      .attr("text-anchor", "middle");

    node.select("text").text(d => d.icon);
  }

  showTooltip(data, type) {
    console.log(data, type, d3.event.pageX, d3.event.pageY);
  }

  hideTooltip(data, type) {
    console.log(data, type, d3.event.pageX, d3.event.pageY);
  }

  render() {
    const { width, height, graph, actions } = this.props;
    return (
      <svg className="container" width={width} height={height}>
        <Lines links={graph.links} actions={actions} />
        <Nodes
          nodes={graph.nodes}
          actions={actions}
          simulation={this.simulation}
        />
        <Labels nodes={graph.nodes} actions={actions} />
        <div className="chart-tooltip" />
      </svg>
    );
  }
}
NetworkGraph.defaultProps = {
  actions: {
    onNodeClick: () => {},
    onLinkClick: () => {}
  }
};

NetworkGraph.propTypes = {
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  actions: PropTypes.shape({
    onNodeClick: PropTypes.func,
    onLinkClick: PropTypes.func
  }),
  graph: PropTypes.shape({
    nodes: PropTypes.any.isRequired,
    links: PropTypes.any.isRequired
  }).isRequired
};
