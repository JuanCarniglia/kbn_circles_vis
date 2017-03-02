export default function (kibana) {
  return new kibana.Plugin({
    uiExports: {
      visTypes: [
        'plugins/kbn_circles_vis/kbn_circles_vis'
      ]
    }
  });
}
