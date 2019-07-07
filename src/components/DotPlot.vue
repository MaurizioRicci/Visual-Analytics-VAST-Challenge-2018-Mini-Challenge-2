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
          <a class='nav-link' href='#/conclusioni'>Conclusioni</a>
        </li>
      </ul>
    </div>
    <div class="section wb nopadtop">
      <div class="container">

        <div class="row">

          <div class="col-md-12">

            <div class="message-box">
              <h2>Calendario dei rilevamenti</h2>

            </div>
          </div>

          <p>
            Il dipartimento di idrologia ci ha fornito le misurazioni svolte nel corso degli anni ma non tutte le stazioni presentano un sufficiente numero di dati. Il calendario dei rilevamenti presenta, mediante un dot plot, la collezione di rilevamenti e da esso si nota che la maggior parte delle stazioni ha una distribuzione piuttosto omogenea ad eccezione di: Tansanee, Decha e Achara che sono presenti da gennaio 2009. Con una finestra di circa dieci anni è difficile stabilire cosa possa essere successo prima di quest’anno nelle acque in prossimità delle stazioni sopra elencate. Ad ogni modo dal periodo in cui vengono effettuate le rilevazioni, esse risultano essere molto fitte, si hanno dati relativi a una data stazione anche più volte alla settimana.
            C’è da notare che le acque in prossimità della stazione di Achara confluiscono in quelle della stazione Sakda; si potrebbe pensare quindi a una correlazione tra le acque monitorate da Achara e quelle di Sakda, ciò potrebbe rendere non strettamente necessaria la stazione di Achara.

          </p>

        </div>
      </div>
    </div>
    <div class='container-fluid' ref="parent">
      <div class="tooltip"></div>
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
        var margin = { top: 20, right: 10, bottom: 30, left: 60 }
        var width = this.$refs.parent.clientWidth
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
        let formatTime = d3.timeFormat('%Y-%m-%d')
        let tooltip = d3.select('.tooltip')
        let showTooltip = function (d) {
          tooltip.transition()
            .duration(200)
            .style('opacity', 1)
          tooltip.html(formatTime(d.fromDate) + '<br/>' + d.location)
            .style('left', (d3.event.pageX) + 'px')
            .style('top', (d3.event.pageY - 35) + 'px')
        }
        let hideTooltip = function () {
          tooltip.transition()
            .duration(500)
            .style('opacity', 0)
        }

        linesC
          .selectAll('line')
          .data(linesData)
          .join('line')
          .attr('x1', d => x(d.fromDate))
          .attr('x2', d => x(d.toDate))
          .attr('y1', d => y(d.location))
          .attr('y2', d => y(d.location))
          .attr('stroke', d => color(d.location))
          .attr('stroke-width', '6')
          .attr('stroke-linecap', 'round')
          .on('mouseover', d => showTooltip(d))
          .on('mouseout', hideTooltip)

        pointsC
          .selectAll('circle')
          .data(pointsData)
          .join('circle')
          .attr('cx', d => x(d.fromDate))
          .attr('cy', d => y(d.location))
          .attr('r', 3)
          .attr('fill', d => color(d.location))
          .on('mouseover', d => showTooltip(d))
          .on('mouseout', hideTooltip)
      })
    }
  },
  mounted () {
    this.init()
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

 .nav-tabs .nav-link{
   border:1px solid gray;
 }
.nav-tabs .nav-item{
  margin-left: 16em;
}
a.nav-link{
  background-color: beige;
}

</style>
