import React from 'react';
import * as d3 from 'd3';
import { event as currentEvent } from 'd3';
import ReactFauxDOM from 'react-faux-dom';
import PropTypes from 'prop-types';
import style from './styles.scss';
import NetworkLandingResultsType from '../types/NetworkLandingResultsType';

const PI = 22 / 7;

class NetworkGraph extends React.Component {
  state = {
    data: null,
    tooltip: null,
  };

  constructor() {
    super();
    this.onNodeClick = this.onNodeClick.bind(this);
    this.onLinkClick = this.onLinkClick.bind(this);
    this.setNodeTooltip = this.setNodeTooltip.bind(this);
    this.setLinkTooltip = this.setLinkTooltip.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  componentDidMount() {
    const { options, data } = this.props;

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
      { x: 50, y: 50 },
    ];
    const individuals = [];

    const wrapIndividuals = (inputItem) => {
      if (inputItem.customers) {
        inputItem.customers.forEach((ind, index) => {
          individuals.push({
            id:
              ind.iclic_identifier === undefined
                ? `Customer ID - ${ind.individual_identifier}`
                : `Business ID - ${ind.iclic_identifier}`,
            name: ind.full_name,
            count: index > 0 ? inputItem.linkages[index - 1].count : 0,
            totalAccounts:
              ind.accounts_active_count + ind.accounts_cancelled_count,
            active: ind.accounts_active_count,
            cancelled: ind.accounts_cancelled_count,
            type:
              ind.iclic_identifier === undefined ? 'individual' : 'business',
          });
        });
      }
    };
    wrapIndividuals(data);

    const graph = {
      nodes: [],
      links: [],
    };
    graph.nodes = individuals.map((ind, index) => ({
      id: ind.id,
      name: ind.name,
      active: ind.active,
      cancelled: ind.cancelled,
      totalAccounts: ind.totalAccounts,
      x: (positions[index].x * options.width) / 100,
      y: (positions[index].y * options.height) / 100,
      size: 2.4,
      fixed: true,
      childs: [
        { value: 0 },
        { value: 0 },
        { value: (ind.active * 100) / (ind.active + ind.cancelled) },
        { value: (ind.cancelled * 100) / (ind.active + ind.cancelled) },
      ],
      icons: (
        <div
          className={`dls-icon-${
            ind.type === 'individual' ? 'account' : 'business'
          }-filled icon-lg icon-hover ${
            ind.active > 0 ? style.iconsActive : style.iconsCancel
          }`}
        />
      ),
    }));

    graph.links = individuals
      .slice(1, individuals.length)
      .map((ind, index) => ({
        source: 0,
        target: index + 1,
        count: ind.count,
      }));

    const updatePercentages = (inputItem) => {
      const item = inputItem;
      item.total = item.childs.reduce((total, child) => total + child.value, 0);
      item.tempPercent = 100 * item.size;
      item.childs = item.childs.map((a) => {
        const percentage = (a.value * 100 * item.size) / item.total;
        const val = {
          value: a.value,
          percentage,
          offset: item.tempPercent - 100 * item.size,
          dasharray: `${percentage} ${100 * item.size - percentage}`,
        };
        item.tempPercent -= percentage;
        return val;
      });
      delete item.tempPercent;
    };

    graph.nodes.forEach(updatePercentages);

    this.setState({ data: graph });
  }

  onNodeClick(node) {
    const { data } = this.state;
    const { onNodeClick } = this.props;
    const index = data.nodes.indexOf(node);
    this.clearSelection([index], []);
    if (index > -1) {
      data.nodes[index].selected = !data.nodes[index].selected;
    }
    this.setState({ data });
    onNodeClick(node);
  }

  onLinkClick(link) {
    const { data } = this.state;
    const { onLinkClick } = this.props;
    const sourceIndex = data.nodes.indexOf(link.source);
    const targetIndex = data.nodes.indexOf(link.target);
    const linkIndex = data.links.indexOf(link);
    this.clearSelection([sourceIndex, targetIndex], []);
    if (sourceIndex > -1 && targetIndex > -1) {
      if (
        !data.nodes[sourceIndex].selected ||
        !data.nodes[targetIndex].selected
      ) {
        data.nodes[sourceIndex].selected = true;
        data.nodes[targetIndex].selected = true;
        data.links[linkIndex].selected = true;
      } else {
        delete data.nodes[sourceIndex].selected;
        delete data.nodes[targetIndex].selected;
        delete data.links[linkIndex].selected;
      }
    }
    this.setState({ data });
    onLinkClick(link);
  }

  onMouseLeave() {
    this.setState({
      tooltip: undefined,
    });
  }

  setNodeTooltip(node) {
    this.setState({
      tooltip: {
        node,
        nodeTip: true,
        position: {
          x: currentEvent.pageX,
          y: currentEvent.pageY,
        },
      },
    });
  }

  setLinkTooltip(link) {
    this.setState({
      tooltip: {
        link,
        lineTip: true,
        position: {
          x: currentEvent.pageX,
          y: currentEvent.pageY,
        },
      },
    });
  }

  clearSelection(nodeIndexs, linkIndexs) {
    const { data } = this.state;
    if (data === null || data === undefined) {
      return;
    }
    data.nodes.forEach((inode, index) => {
      if (nodeIndexs.indexOf(index) === -1) {
        // debugger;
        const n = inode;
        delete n.selected;
      }
    });
    data.links.forEach((ilink, index) => {
      if (linkIndexs.indexOf(index) === -1) {
        const l = ilink;
        delete l.selected;
      }
    });
  }

  clearAllSelection() {
    const { data } = this.state;
    if (data === null || data === undefined) {
      return;
    }
    data.nodes.forEach((inode) => {
      const n = inode;
      delete n.selected;
    });
    data.links.forEach((ilink) => {
      const l = ilink;
      delete l.selected;
    });
  }

  renderChart(data, options, tooltip) {
    const { width, height, radius, arcColors } = options;

    const selected = data.nodes.some((n) => n.selected);

    const faux = ReactFauxDOM.createElement('div');

    if (tooltip) {
      let tooltipHTML = '';
      if (tooltip.nodeTip) {
        tooltipHTML = (
          <div className="grid-container">
            <div className="item1">
              <h5>{tooltip.node.totalAccounts} Accounts</h5>
            </div>
            <div className="item2">
              <h5 style={{ color: '#3F9C35' }}>{tooltip.node.active} Active</h5>
            </div>
            <div className="item3">
              <h5 style={{ color: '#F0D041' }}>
                {tooltip.node.cancelled} Canceled
              </h5>
            </div>
          </div>
        );
      }
      if (tooltip.lineTip) {
        tooltipHTML = (
          <div className="grid-container">
            <div className="item1">
              <h5>{tooltip.link.count} Linkages</h5>
            </div>
            <div className="item1">
              <h5>8 Attributes</h5>
            </div>
            <div className="item1">
              <h5>Name</h5>
            </div>
            <div className="item2">
              <h5>Phone</h5>
            </div>
            <div className="item3">
              <h5>Address</h5>
            </div>
            <div className="item3">
              <h5>+5 more..</h5>
            </div>
          </div>
        );
      }
      d3.select(faux)
        .append('div')
        .attr('class', 'tooltip tooltip-white')
        .html(tooltipHTML)
        .style('visibility', 'visible')
        .style('opacity', '1')
        .style('padding', '0.1 10px')
        .style('left', `${tooltip.position.x - 50}px`)
        .style('top', `${tooltip.position.y - 110}px`);
    }

    const svg = d3
      .select(faux)
      .append('svg')
      .attr('class', selected ? style.hasSelection : '')
      .attr('width', width)
      .attr('height', height);

    const link = svg.selectAll('.link');
    let node = svg.selectAll('.node');
    const linkText = svg.selectAll('.link');

    // const color = d3.scale.ordinal()
    //   .range(['#65C400', '#2290EE', '#FFC096', '#5e5e5e']);

    const force = d3.layout
      .force()
      .size([width, height])
      .charge(-400)
      .linkDistance(50);

    force.nodes(data.nodes).links(data.links).start();

    link
      .data(data.links)
      .enter()
      .append('line')
      .attr('class', (d) =>
        d.selected ? `${style.selected} ${style.link}` : style.link
      )
      .attr('x1', (d) => d.source.x)
      .attr('y1', (d) => d.source.y)
      .attr('x2', (d) => d.target.x)
      .attr('y2', (d) => d.target.y)
      .on('click', this.onLinkClick)
      .on('mouseover', this.setLinkTooltip)
      .on('mouseleave', this.onMouseLeave);

    linkText
      .data(data.links)
      .enter()
      .append('text')
      .attr('class', style.nodeText)
      .attr('fill', '#aaa')
      .text((d) => d.count)
      .attr('x', (d) => (d.source.x + d.target.x) / 2)
      .attr('y', (d) => (d.source.y + d.target.y) / 2)
      .attr('x', (d) => (d.source.x + d.target.x) / 2)
      .attr('y', (d) => (d.source.y + d.target.y) / 2);

    node = node.data(data.nodes, (d, index) => index);

    node.exit().remove();

    const nodeEnter = node
      .enter()
      .append('g')
      .on('click', this.onNodeClick)
      .on('mouseover', this.setNodeTooltip)
      .on('mouseleave', this.onMouseLeave)
      .attr('class', (d) =>
        d.selected ? `${style.node} ${style.selected}` : style.node
      )
      .attr('transform', (d) => `translate(${d.x},${d.y})`);

    nodeEnter.append('circle').attr('r', (d) => d.size * radius);

    const texts = nodeEnter
      .append('text')
      .attr('class', style.nodeText)
      .attr('fill', '#2a2a2a')
      .attr('text-anchor', 'middle');

    texts
      .append('tspan')
      .attr('dy', 50)
      .attr('x', 0)
      .text((d) => d.name);

    texts
      .append('tspan')
      .attr('dy', 17)
      .attr('x', 0)
      .text((d) => d.id);

    node
      .selectAll('g')
      .data((d) => d.childs)
      .enter()
      .append('circle')
      .attr('fill', 'transparent')
      .attr('r', (d, i, g) => data.nodes[g].size * radius)
      .attr('stroke', (d, i) => arcColors[i])
      .attr('stroke-width', '0.3rem')
      .attr('stroke-dasharray', (d) => d.dasharray)
      .attr('stroke-dashoffset', (d) => d.offset);

    nodeEnter
      .append('foreignObject')
      .attr('x', (d) => d.x - 25)
      .attr('y', (d) => d.y - 25)
      .attr('width', 40)
      .attr('height', 40)
      .html((d) => d.icons);
    return faux.toReact();
  }

  render() {
    const { data, tooltip } = this.state;
    const { options, showAccount, showLink } = this.props;

    if (showAccount === undefined || showLink === undefined) {
      this.clearAllSelection();
    }

    return data && data.nodes ? this.renderChart(data, options, tooltip) : null;
  }
}

NetworkGraph.defaultProps = {
  data: null,
  options: {
    width: 980,
    height: 750,
    radius: 100 / (2 * PI),
    arcColors: ['#9a73cc', '#ffbd3a', '#43bc83', '#F0D041'],
  },
  onLinkClick: () => {},
  onNodeClick: () => {},
};

NetworkGraph.propTypes = {
  data: PropTypes.shape({ NetworkLandingResultsType }),
  showAccount: PropTypes.bool.isRequired,
  showLink: PropTypes.bool.isRequired,
  options: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
    radius: PropTypes.number,
    arcColors: PropTypes.arrayOf(PropTypes.string),
  }),
  onNodeClick: PropTypes.func,
  onLinkClick: PropTypes.func,
};

export default NetworkGraph;
