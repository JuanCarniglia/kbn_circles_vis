module.exports = function (kibana) {
  return new kibana.Plugin({
    name: 'kbn_circles_vis',
    require: ['kibana', 'elasticsearch'],
    uiExports: {
      visTypes: [
        'plugins/kbn_circles_vis/kbn_circles_vis'
      ]
    }
  });
};