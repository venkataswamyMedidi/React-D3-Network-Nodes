import React, { Fragment } from 'react';

import NetworkGraph from './networkGraph/NetworkGraph.js';

function Graph() {
  const chartData = {
    nodes: [
      { id: 'Myriel', group: 1, icon: '\uEA1A' },
      { id: 'Napoleon', group: 1, icon: '\uEA1A' },
      { id: 'Mlle.Baptistine', group: 1, icon: '\uEA1A' },
      { id: 'Mme.Magloire', group: 1, icon: '\uEAEF' },
      { id: 'CountessdeLo', group: 1, icon: '\uEAEF' },
      { id: 'Geborand', group: 1, icon: '\uEA1A' },
      { id: 'Champtercier', group: 1, icon: '\uEAEF' },
      { id: 'Cravatte', group: 1, icon: '\uEA1A' },
      { id: 'Count', group: 1, icon: '\uEA1A' },
      { id: 'OldMan', group: 1, icon: '\uEAEF' },
    ],
    links: [
      { source: 'Myriel', target: 'Napoleon', value: 1 },
      { source: 'Myriel', target: 'Mlle.Baptistine', value: 1 },
      { source: 'Myriel', target: 'Mme.Magloire', value: 1 },
      { source: 'Myriel', target: 'CountessdeLo', value: 1 },
      { source: 'Myriel', target: 'Geborand', value: 1 },
      { source: 'Myriel', target: 'Champtercier', value: 1 },
      { source: 'Myriel', target: 'Cravatte', value: 1 },
      { source: 'Myriel', target: 'Count', value: 1 },
      { source: 'Myriel', target: 'OldMan', value: 1 },
    ],
  };
  
  const actions = {
    onNodeClick: () => {
      console.log('on node click');
    },
    onLinkClick: () => {
      console.log('on link click');
    }
  }
  return (
    <Fragment>
      <div className="row">
        <NetworkGraph graph={chartData} actions={actions} width={'900'} height={'500'} />
      </div>
    </Fragment>
  );
}

export default Graph;
