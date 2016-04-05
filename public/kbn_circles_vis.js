define(function (require) {
  require('ui/agg_table');
  require('ui/agg_table/agg_table_group');

  require('plugins/kbn_circles_vis/kbn_circles_vis.less');
  require('plugins/kbn_circles_vis/kbn_circles_vis_controller');

  require('ui/registry/vis_types').register(KbnCirclesVisProvider);

  function KbnCirclesVisProvider(Private) {
    var TemplateVisType = Private(require('ui/template_vis_type/TemplateVisType'));
    var Schemas = Private(require('ui/Vis/Schemas'));

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
          defaults: [
            {type: 'count', schema: 'metric'}
          ]
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

  // export the provider so that the visType can be required with Private()
  return KbnCirclesVisProvider;
});
