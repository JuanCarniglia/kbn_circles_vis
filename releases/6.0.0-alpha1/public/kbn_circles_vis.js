import 'ui/agg_table';
import 'ui/agg_table/agg_table_group';

import 'plugins/kbn_circles_vis/kbn_circles_vis.less';
import 'plugins/kbn_circles_vis/kbn_circles_vis_controller';
import TemplateVisTypeTemplateVisTypeProvider from 'ui/template_vis_type/template_vis_type';
import VisSchemasProvider from 'ui/vis/schemas';
import kbnCirclesVisTemplate from 'plugins/kbn_circles_vis/kbn_circles_vis.html';

require('ui/registry/vis_types').register(KbnCirclesVisProvider);

function KbnCirclesVisProvider(Private) {
  const TemplateVisType = Private(TemplateVisTypeTemplateVisTypeProvider);
  const Schemas = Private(VisSchemasProvider);

  return new TemplateVisType({
    name: 'kbn_circles',
    title: 'Circles Diagram',
    icon: 'fa-bullseye',
    description: 'Cool D3 Circles',
    template: require('plugins/kbn_circles_vis/kbn_circles_vis.html'),
    params: {
      defaults: {
        showMetricsAtAllLevels: false
      },
      editor: require('plugins/kbn_circles_vis/kbn_circles_vis_params.html')
    },
    hierarchicalData: function (vis) {
      return Boolean(vis.params.showPartialRows || vis.params.showMetricsAtAllLevels);
    },
    schemas: new Schemas([
      {
        group: 'metrics',
        name: 'metric',
        title: 'Split Size',
        min: 1,
        max: 1,
        defaults: [{
          type: 'count',
          schema: 'metric'
        }]
      },
      {
        group: 'buckets',
        name: 'segment',
        title: 'Levels',
        aggFilter: '!geohash_grid',
        min: 1,
        max: 2
      }
    ]),
    requiresSearch: true
  });
}

export default KbnCirclesVisProvider;
