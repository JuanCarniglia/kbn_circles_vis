define(function (require) {
  return function circlesProvider(Private, Notifier) {
    var _ = require('lodash');
    var arrayToLinkedList = require('ui/agg_response/hierarchical/_array_to_linked_list');
    var notify = new Notifier({
      location: 'Circles chart response converter'
    });

    var nodes = [];

    var bucket_temp = null;
    var bucket_position = 0;

    function processEntryRecursive(data, parent) {

      bucket_position = 0;

      for (var t=0; t < _.size(data.buckets); t++) {
        var bucket = data.buckets[t];

        bucket_temp = null;

        if (!bucket) {

          var pos = 0;
          var found = false;
          _.each(data.buckets, function(a,b) {

            if (!found) {
              if (bucket_position == pos) {
              bucket_temp = a;
              bucket_temp.key = b;
              bucket_position++;
              found = true;
              }
            }

            pos++;
          });

          if (bucket_temp) {
            bucket = bucket_temp;
          }
        }


        var temp_node = null;

        if (bucket.doc_count > 0)
            temp_node = { 'name': bucket.key, 'size': bucket.doc_count };
        else
            temp_node = { 'name': bucket.key};


        // warning ...

        if (_.size(bucket) > 2) {
          var i = 0;

          while(!bucket[i] && i <= _.size(bucket)) { i++; }

          if (bucket[i] && bucket[i].buckets) {
            // there are more
               processEntryRecursive(bucket[i], temp_node);
          }
        }

        if (!parent.children) parent.children = [];

        parent.children.push(temp_node);
      }

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

      nodes = [];

      processEntryRecursive(aggData, nodes);

      var chart = {
        'name' :'flare',
    	'children' : nodes.children
      };

      return chart;
    };
  };
});
