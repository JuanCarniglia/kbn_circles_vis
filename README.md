# Kibana Circles Packing Visualization Plugin

This is a Circles Packing diagram visType for Kibana, version 4.4.1.

This plugin is based on the excelent work done by @chenryn with the
kbn_sankey_vis [plugin](https://github.com/chenryn/kbn_sankey_vis) (Thanks!), and of course on the exceptional D3 library,
by @mbostock [D3 Gallery](https://github.com/mbostock/d3/wiki/Gallery) (Also, Thanks!).

If you really liked this and feel like making a donation : 

<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
<input type="hidden" name="cmd" value="_s-xclick">
<input type="hidden" name="encrypted" value="-----BEGIN PKCS7-----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-----END PKCS7-----
">
<input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!">
<img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1">
</form>


![Screenshot](kbn_circles_vis.png)
(Only one level is shown here, there can be up to two levels for now, have to work on the code some more).

##Installation Steps

(Theses are optional, you can just copy the kbn_circles_vis folder into
KIBANA_HOME/src/plugins).

```
git clone https://github.com/JuanCarniglia/kbn_circles_vis.git 
cd kbn_circles_vis
npm install
npm run build
cp -R build/kbn_circles_vis/ KIBANA_HOME/installedPlugins
```

##How does it work

Basically, this plugin takes the information from Elasticsearch, generates a JSON structure similar to
what is expected by the D3 Circle Packing code, which is:

```json
{
  "name": "flare",
  "children": [
    {
      "name": "something",
      "children": [
        {
          "name": "some_other",
          "children": null,
          "size": 138
        },
        {
          "name": "some_other_other",
          "children": null,
          "size": 305
        }
      ],
      "size": 443
    }
  ]
}
```
And generates two levels of circles. One root, and two other levels, to be exact.

The size of the circles are related to the "size" value.
