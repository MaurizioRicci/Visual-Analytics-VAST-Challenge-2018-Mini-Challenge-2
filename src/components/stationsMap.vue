<template>
  <div class='stationsMap'>
    <svg ref='svgTree'></svg>
  </div>
</template>

<script>
const d3 = require('d3');

export default {
  name: 'StationsMap',
  data() {
    return {
      activeStations: new Set([
        'Waterways',
        'Kannika',
        'Boonsri',
        'Kohsoom',
        'Busarakan',
        'Somchair',
        'Achara',
        'Tansanee',
        'Chai',
        'Decha',
        'Sakda'
      ]),
      treeData: {
        name: 'Waterways',
        children: [
          {
            name: 'Kannika',
            children: [
              {
                name: 'Chai',
                children: [{ name: 'Boonsri' }, { name: 'Kohsoom' }]
              },
              { name: 'Busarakan' }
            ]
          },
          {
            name: 'Sakda',
            children: [{ name: 'Somchair' }, { name: 'Achara' }]
          },
          { name: 'Tansanee' },
          { name: 'Decha' }
        ]
      },
      svg: undefined
    };
  },
  mounted() {
    this.redraw()
    //this.removeActiveStation('Chai') //test
  },
  methods: {
    isStationActive: function (station) {
      return this.activeStations.has(station)
    },
    addActiveStation: function (station) {
      this.activeStations.add(station)
      this.redraw()
    },
    removeActiveStation: function (station) {
        this.activeStations.delete(station)
        this.redraw()
    },
    redraw: function () {
      // set the dimensions and margins of the diagram
      var margin = { top: 20, right: 0, bottom: 30, left: 0 },
        width = 500 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

      // declares a tree layout and assigns the size
      var treemap = d3.tree().size([width, height]);

      //  assigns the data to a hierarchy using parent-child relationships
      var nodes = d3.hierarchy(this.treeData);

      // maps the node data to the tree layout
      nodes = treemap(nodes);
      nodes.y = height;
      // append the svg obgect to the body of the page
      // appends a 'group' element to 'svg'
      // moves the 'group' element to the top left margin
      this.svg = d3
        .select(this.$refs.svgTree)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);
      var g = this.svg
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
      this.svg = this.svg.node();

      // adds the links between the nodes
      var link = g
        .selectAll('.link')
        .data(nodes.descendants().slice(1))
        .enter()
        .append('path')
        .attr('class', 'link')
        .attr('d', function(d) {
          d.y = height - d.y;
          return (
            'M' +
            d.x +
            ',' +
            d.y +
            'C' +
            d.x +
            ',' +
            (d.y + d.parent.y) / 2 +
            ' ' +
            d.parent.x +
            ',' +
            (d.y + d.parent.y) / 2 +
            ' ' +
            d.parent.x +
            ',' +
            d.parent.y
          )
        });

      // adds each node as a group
      var node = g
        .selectAll('.node')
        .data(nodes.descendants())
        .enter()
        .append('g')
        .attr('class', d => 'node' +
            (d.children ? ' node--internal' : ' node--leaf') +
            (this.isStationActive(d.data.name)
              ? ' node--active'
              : ' node--inactive')
        )
        .attr('transform', function(d) {
          return 'translate(' + d.x + ',' + d.y + ')'
        });

      // adds the circle to the node
      node.append('circle').attr('r', 10);

      // adds the text to the node
      node
        .append('text')
        .attr('dy', '.35em')
        .attr('y', 20)
        .style('text-anchor', 'middle')
        .text(function(d) {
          return d.data.name;
        });
    }
  }
};
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
svg >>> .node circle {
  fill: #fff;
  stroke: steelblue;
  stroke-width: 3px;
}

svg >>> .node--inactive > circle {
  stroke: gray;
}

svg >>> .node text {
  font: 12px sans-serif;
  fill: #16316e;
}

svg >>> .node--inactive > text {
  fill: gray;
}

svg >>> .node--internal text {
  text-shadow: 0 1px 0 #fff, 0 -1px 0 #fff, 1px 0 0 #fff, -1px 0 0 #fff;
}

svg >>> .link {
  fill: none;
  stroke: #ccc;
  stroke-width: 2px;
}
</style>
