<template>
  <div class='container'>
    <div class='header'>
      <h1>Inquinamento idrico nella riserva di Boonsong Lekagul</h1>

      <ul class='nav nav-tabs'>
        <li class='nav-item'></li>
        <li>
          <a class='nav-link' href='/'>Home</a>
        </li>
        <li>
          <a class='nav-link' href='#/outliers_table'>Outliers table</a>
        </li>
        <li>
          <a class='nav-link' href='#/dot_plot'>Calendario dei rilevamenti</a>
        </li>
        <li>
          <a class='nav-link' href='#'>Conclusioni</a>
        </li>
      </ul>
    </div>
    <div class='container-fluid'>
      <svg ref='svgLines' />
    </div>
  </div>
</template>

<script>
import getMeasureIntervals from '@/assets/js/getMeasureIntervals'
import infoBtn from './InfoBtn'
const d3 = require('d3')

export default {
  name: 'DotPlot',
  components: {
    infoBtn: infoBtn
  },
  props: {
    width: Number,
    height: Number,
    stations: Array
  },
  data () {
    return {}
  },
  methods: {
    init: function () {
      getMeasureIntervals().then(data => {
        var margin = { top: 20, right: 0, bottom: 30, left: 60 }
        var width = 1000
        var height = 500

        const stations = [
          'Kannika', 'Boonsri', 'Kohsoom',
          'Busarakhan', 'Somchair',
          'Achara', 'Tansanee',
          'Chai', 'Decha', 'Sakda'
        ].sort()

        const color = d3
          .scaleOrdinal(d3.schemeCategory10)
          .domain(stations)

        const svg = d3
          .select(this.$refs.svgLines)
          .attr('width', width)
          .attr('height', height)

        const parseTime = d3.timeParse('%Y-%m-%d')
        data = data.map(d => {
          d.fromDate = parseTime(d.fromDate)
          d.toDate = parseTime(d.toDate)
          return d
        })

        // Add X axis
        const x = d3
          .scaleTime()
          .domain([data[0].fromDate, data[data.length - 1].toDate])
          .rangeRound([margin.left, width - margin.right])
        svg
          .append('g')
          .attr('transform', 'translate(0,' + (height - margin.bottom) + ')')
          .call(d3.axisBottom(x))

        // Y axis
        const y = d3
          .scalePoint()
          .rangeRound([height - margin.bottom, margin.top])
          .domain(stations)

        svg.append('g')
          .attr('transform', 'translate(' + margin.left + ',' + (0) + ')')
          .style('font-size', '11px')
          .call(
            d3.axisLeft(y)
            //  .tickSizeOuter(0)
          )

        const linesC = svg.append('g')
          .classed('lines', true)

        const pointsC = svg.append('g')
          .classed('points', true)

        let linesData = data.filter(d => d.fromDate.getTime() !== d.toDate.getTime())
        let pointsData = data.filter(d => d.fromDate.getTime() === d.toDate.getTime())

        linesC
          .selectAll('line')
          .data(linesData)
          .join('line')
          .attr('x1', d => x(d.fromDate))
          .attr('x2', d => x(d.toDate))
          .attr('y1', d => y(d.location))
          .attr('y2', d => y(d.location))
          .attr('stroke', d => color(d.location))
          .attr('stroke-width', '4')
          .attr('stroke-linecap', 'round')

        pointsC
          .selectAll('circle')
          .data(pointsData)
          .join('circle')
          .attr('cx', d => x(d.fromDate))
          .attr('cy', d => y(d.location))
          .attr('r', 2)
          .attr('fill', d => color(d.location))
      })
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style scoped>
</style>
