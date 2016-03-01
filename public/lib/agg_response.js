define(function (require) {
  return function circlesProvider(Private, Notifier) {
    var _ = require('lodash');
    var arrayToLinkedList = require('ui/agg_response/hierarchical/_array_to_linked_list');
    var notify = new Notifier({
      location: 'Circles chart response converter'
    });

    var nodes = [];

    function processEntry(aggConfig, metric, aggData) {
      _.each(aggData.buckets, function (b) {

	var temp_node = {'children' : null, 'name' : b.key, 'size' : b.doc_count };

	if (_.size(b) > 2){
		temp_node.children = [];
		var a;
		for ( t=0 ; t < _.size(b); t++){
			if (b[t]) a = b[t];
		}
		if (a) {
			_.each(a.buckets, function(kk){
				temp_node.children.push({ 'children' : null, 'name' : kk.key, 'size' : kk.doc_count });
			});
		}
	}

	nodes.push(temp_node);

        //if (aggConfig._next) {
        //  processEntry(aggConfig._next, metric, b[aggConfig._next.id]);
        //}
      });
    }

    return function (vis, resp) {

      var metric = vis.aggs.bySchemaGroup.metrics[0];
      var children = vis.aggs.bySchemaGroup.buckets;
      children = arrayToLinkedList(children);

      if (!children)  {
        return { 'children' : { 'children' : null }};
      }

      var firstAgg = children[0];
      var aggData = resp.aggregations[firstAgg.id];

      //if (!firstAgg._next) {
      //  notify.error('need more than one sub aggs');
      //}
      
      nodes = [];

      processEntry(firstAgg, metric, aggData);

      var chart = {
          'name' :'flare',
	  'children' : nodes,
	  'size' : 0
      };

      return chart;
    };
  };
});
