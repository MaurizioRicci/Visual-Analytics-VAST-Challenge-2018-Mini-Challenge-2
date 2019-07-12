<template>
  <div class='GroupedBarChart' ref='parent'>
    <b-row align-h="center">
      <b-col sm="4">
        <label for="range-1">Filter by st dev &ge; {{ minStDevFilter }}</label>
        <b-form-input id="range-1" v-model="minStDevFilter" type="range" min="0" max="7"></b-form-input>
      </b-col>
      <b-col sm="4">
        <b-button variant="outline-primary" @click="toogleView">
          Toggle view
        </b-button>
        <span v-if="group">Outliers per station</span>
        <span v-if="!group">Outliers per year</span>
      </b-col>
    </b-row>
    <div class="tooltip"></div>
    <svg ref='svgGroupedBarChart' />
  </div>
</template>

<script>
import getOutliersCountPerStation from '@/assets/js/getOutliersCountPerStation'
const d3 = require('d3')

export default {
  name: 'GroupedBarChart',
  data () {
    return {
      minStDevFilter: 0,
      data: null,
      group: true,
      groupKey: 'year',
      keys: null,
      margin: { top: 20, right: 50, bottom: 20, left: 40 },
      width: 900,
      height: 600
    }
  },
  mounted () {
    this.width = this.$refs.parent.clientWidth
    this.fetchDataRedraw()
  },
  methods: {
    fetchDataRedraw: function () {
      getOutliersCountPerStation({
        'minStdDev': this.minStDevFilter
      })
        .then(data => {
          this.data = Object.assign(data, {y: 'Count'})
          let nest = d3.nest()
            .key(d => d.year)
            .rollup(d => d3.sum(d, el => el.cont))
            .entries(this.data)
            .map(d => ({
              'year': d.key,
              'cont': d.value
            }))
          this.keys = data.map(d => d.location).sort()
          this.keys2 = nest.map(el => el.year)
          this.data2 = Object.assign(nest, {y: 'Count'})
          this.redraw()
        })
    },
    redraw: function () {
      let currData = this.group ? this.data : this.data2

      const x0 = d3
        .scaleBand()
        .domain(currData.map(d => d[this.groupKey]))
        .rangeRound([this.margin.left, this.width - this.margin.right])
        .paddingInner(0.1)

      const x1 = this.group ? d3
        .scaleBand()
        .domain(this.keys)
        .rangeRound([0, x0.bandwidth()])
        .padding(0.05) : x0

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(currData, d => d.cont)])
        .nice()
        .rangeRound([this.height - this.margin.bottom, this.margin.top])

      let color = this.group ? d3
        .scaleOrdinal(d3.schemeCategory10)
        .domain(this.keys) : d3
        .scaleOrdinal(['steelblue'])
        .domain(this.keys2)

      const xAxis = g =>
        g
          .attr('transform', `translate(0,${this.height - this.margin.bottom})`)
          .call(d3.axisBottom(x0).tickSizeOuter(0))
          .call(g => g.select('.domain').remove())

      const yAxis = g =>
        g
          .attr('transform', `translate(${this.margin.left},0)`)
          .call(d3.axisLeft(y).ticks(null, 's'))
          .call(g => g.select('.domain').remove())
          .call(g =>
            g
              .select('.tick:last-of-type text')
              .clone()
              .attr('x', 3)
              .attr('dy', -this.margin.top / 2)
              .attr('text-anchor', 'start')
              .attr('font-weight', 'bold')
              .text('Count')
          )
          .call(g => g.selectAll('line')
            .attr('x2', this.width - this.margin.left - this.margin.right))

      const legend = svg => {
        const g = svg
          .attr('transform', `translate(${this.width},0)`)
          .attr('text-anchor', 'end')
          .attr('font-family', 'sans-serif')
          .attr('font-size', 10)
          .selectAll('g')
          .data(color.domain().slice().reverse())
          .join('g')
          .attr('transform', (d, i) => `translate(0,${i * 20})`)

        g.append('rect')
          .attr('x', -19)
          .attr('width', 19)
          .attr('height', 19)
          .attr('fill', color)

        g.append('text')
          .attr('x', -24)
          .attr('y', 9.5)
          .attr('dy', '0.35em')
          .text(d => d)
      }

      const svg = d3.select(this.$refs.svgGroupedBarChart)
        .attr('width', this.width)
        .attr('height', this.height)

      const g = svg.selectAll('g')
        .data([0])
        .join('g')

      currData = this.group ? currData.map(el => ({
        'key': el.location,
        'value': el.cont,
        'year': el.year
      })) : currData.map(el => ({
        'key': el.year,
        'value': el.cont
      }))

      let tooltip = d3.select('.tooltip')
      g.selectAll('rect')
        .data(currData)
        .join('rect')
        .on('mouseover', d => this.showTooltip(tooltip, d))
        .on('mouseout', this.hideTooltip(tooltip))
        .transition()
        .duration(200)
        .attr('transform', d => this.group ? `translate(${x0(d[this.groupKey])},0)` : null)
        .attr('x', d => x1(d.key))
        .attr('y', d => y(d.value))
        .attr('width', x1.bandwidth())
        .attr('height', d => y(0) - y(d.value))
        .attr('fill', d => color(d.key))

      svg.append('g')
        .call(xAxis)

      svg.append('g')
        .call(yAxis)

      svg.append('g')
        .call(legend)
    },
    toogleView: function () {
      this.group = !this.group
      this.redraw()
    },
    showTooltip: function (tooltip, d) {
      console.log(d3.event)
      tooltip.transition()
        .duration(200)
        .style('opacity', 1)
      tooltip.html(d.value)
        .style('left', (d3.event.layerX) + 'px')
        .style('top', (d3.event.layerY - 15) + 'px')
    },
    hideTooltip: function (tooltip) {
      tooltip.transition()
        .duration(500)
        .style('opacity', 0)
    }
  },
  watch: {
    minStDevFilter: function () {
      this.fetchDataRedraw()
    }
  }
}
</script>

<style scoped>
.tooltip {
  position: absolute;
  text-align: center;
  padding: 2px;
  font: 12px sans-serif;
  background: lightsteelblue;
  border: 0px;
  border-radius: 8px;
  pointer-events: none;
}
</style>
