<template>
  <div class='CalendarView'>
    <b-row>
      <b-col sm="2">
        <infoBtn :content="infoData.content"/>
      </b-col>
      <b-col sm="2" offset-sm="3">
        <label for="range-1">Filter by st dev > {{ stDevFilter }}</label>
        <b-form-input id="range-1" v-model="stDevFilter" type="range" min="0" max="7"></b-form-input>
      </b-col>
      <b-col ref='legendContainer'>
        <span>Legend</span>
      </b-col>
    </b-row>
      <b-row align-h="center">
        <b-col sm="12">
          <svg ref='svgCalendar'></svg>
        </b-col>
      </b-row>
      <b-modal ref="modalInfo" id="bv-modal-info" size="lg" hide-footer>
        <template slot="modal-title">Day info for {{formatDate(tableData.date)}}</template>
        <b-container fluid>
          <b-row>
            <b-col>
              <b-table striped hover :items="tableData.items" :fields="tableData.fields">
              </b-table>
            </b-col>
          </b-row>
        </b-container>
      </b-modal>
  </div>
</template>

<script>
import getStatistics from '@/assets/js/getStatistics'
import getCalendarStats from '@/assets/js/getCalendarStats'
import infoBtn from './InfoBtn'
const d3 = require('d3')

export default {
  name: 'CalendarView',
  components: {
    infoBtn: infoBtn
  },
  props: {
    width: Number,
    height: Number,
    stations: Array
  },
  data () {
    return {
      formatDate: d3.timeFormat('%Y-%m-%d'),
      stDevFilter: 0,
      tableData: [],
      transformedData: null,
      infoData: {
        title: '',
        content: `This is a calendar representing a summarized value for each day
         when a measurement was taken. <br>
         It shows a summarized value representing the maximum standard deviation
          of a single chemical element for each day. The data in this widtget can be
          filtered by station accordingly to the stations map.`
      }
    }
  },
  mounted () {
    this.fetchRedraw()
    this.showLegend()
  },
  watch: {
    stDevFilter: function (newVal, oldVal) { // watch it
      this.fetchRedraw(newVal, this.stations)
    },
    stations: function (newVal, oldVal) {
      this.fetchRedraw(this.stDevFilter, newVal)
    }
  },
  methods: {
    formatData: (data) => {
      let parseDate = d3.timeParse('%Y-%m-%d')
      return data.map(d => {
        d.date = parseDate(d.date)
        return d
      })
    },
    fetchRedraw: function (minStdDev, stations) {
      getCalendarStats({
        'minStdDev': minStdDev,
        'stations': stations
      }).then(d => {
        this.transformedData = this.formatData(d)
        this.redraw()
      })
    },
    redraw: function () {
      const weekday = 'monday'
      const cellSize = 17
      const maxDev = 7
      const format = d3.format('.2')
      const formatDay = d =>
        ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getUTCDay()]
      const formatDate = d3.utcFormat('%x')
      const formatMonth = d3.utcFormat('%b')
      const timeWeek = weekday === 'sunday' ? d3.utcSunday : d3.utcMonday
      const countDay = d =>
        weekday === 'sunday'
          ? d.getUTCDay()
          : (d.getUTCDay() + 6) % 7
      const color = d3
        .scaleSequential(
          d3.interpolateBrBG
          // d3.interpolateRgb('rgba(63, 195, 128, 1)', 'rgba(240, 52, 52, 1)')
        )
        .domain([-maxDev, maxDev])
      const pathMonth = t => {
        const n = weekday === 'weekday' ? 5 : 7
        const d = Math.max(0, Math.min(n, countDay(t)))
        const w = timeWeek.count(d3.utcYear(t), t)
        return `${
          d === 0
            ? `M${w * cellSize},0`
            : d === n
              ? `M${(w + 1) * cellSize},0`
              : `M${(w + 1) * cellSize},0V${d * cellSize}H${w * cellSize}`
        }V${n * cellSize}`
      }
      const years = d3
        .nest()
        .key(d => d.date.getUTCFullYear())
        .entries(this.transformedData)
        .sort((a, b) => d3.descending(Number(a.key), Number(b.key)))
      // .reverse()

      const svg = d3
        .select(this.$refs.svgCalendar)
        .attr('width', this.width)
        .attr('height', this.height * years.length)
        .style('font', '10px sans-serif')
        .style('width', '100%')

      const year = svg
        .selectAll('g')
        .data(years, d => d.key)
        .join('g')
        .attr(
          'transform',
          (d, i) => `translate(40,${this.height * i + cellSize * 1.5})`
        )

      year
        .selectAll('text')
        .data(d => [d.key])
        .join('text')
        .attr('x', -5)
        .attr('y', -5)
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'end')
        .text(d => d)

      year
        .append('g')
        .attr('text-anchor', 'end')
        .selectAll('text')
        .data(
          (weekday === 'weekday' ? d3.range(2, 7) : d3.range(7)).map(
            i => new Date(1995, 0, i)
          )
        )
        .join('text')
        .attr('x', -5)
        .attr('y', d => (countDay(d) + 0.5) * cellSize)
        .attr('dy', '0.31em')
        .text(formatDay)

      year
        .append('g')
        .selectAll('rect')
        .data(d => d.values)
        .join('rect')
        .attr('width', cellSize - 1)
        .attr('height', cellSize - 1)
        .attr(
          'x',
          d => timeWeek.count(d3.utcYear(d.date), d.date) * cellSize + 0.5
        )
        .attr('y', d => countDay(d.date) * cellSize + 0.5)
        .attr('fill', d => color(d.standard_val))
        .attr('stroke', d => (d.standard_val > maxDev ? 'violet' : 'black'))
        .attr('stroke-width', '2')
        .on('click', d => this.showInfo(d))
        .on('mouseover', function () { d3.select(this).classed('active', true) })
        .on('mouseout', function () { d3.select(this).classed('active', false) })
        .append('title')
        .text(d => `${formatDate(d.date)}: ${format(d.standard_val)} devSt`)

      const month = year
        .append('g')
        .selectAll('g')
        .data(d => {
          let sorted = d.values.sort((a, b) => d3.ascending(a.date, b.date))
          return d3.utcMonths(
            d3.utcMonth(sorted[0].date),
            sorted[sorted.length - 1].date
          )
        })
        .join('g')

      month
        .filter((d, i) => i)
        .append('path')
        .attr('fill', 'none')
        // .attr('stroke', '#fff')
        // .attr('stroke-width', 3)
        .attr('d', pathMonth)

      month
        .append('text')
        .attr(
          'x',
          d => timeWeek.count(d3.utcYear(d), timeWeek.ceil(d)) * cellSize + 2
        )
        .attr('y', -5)
        .text(formatMonth)
    },
    showInfo: function (d) {
      getStatistics({
        'date': this.formatDate(d.date),
        'stations': this.stations
      }).then(data => {
        let tmp = {}
        tmp.items = data
        tmp.fields = []
        tmp.fields.push({'key': 'location', 'sortable': true})
        tmp.fields.push({'key': 'measure', 'sortable': true})
        tmp.fields.push({'key': 'value', 'sortable': true})
        tmp.fields.push({'key': 'unit', 'sortable': true})
        tmp.fields.push({'key': 'avg_sample', 'label': 'average value', 'sortable': false})
        tmp.fields.push({'key': 'standard_val', 'label': 'Normalized value', 'sortable': true})
        tmp.date = d.date // contiene la data scelta
        this.tableData = tmp
        this.$refs.modalInfo.show()
      })
    },
    showLegend: function () {
      const maxDev = 7
      const color = d3
        .scaleSequential(d3.interpolateBrBG)
        .domain([-maxDev, maxDev])

      const legendContainer = d3
        .select(this.$refs.legendContainer)
        .selectAll('div')
        .data([0])
        .join('div')
        .style('position', 'relative')
        .style('left', (2 * maxDev * 10) + 'px')
        .style('width', (2 * maxDev * 10) + 'px')

      legendContainer
        .selectAll('div')
        .data(d3.range(-maxDev, maxDev))
        .join('div')
        .style('display', 'inline-block')
        .style('width', '10px')
        .style('height', '10px')
        .style('background-color', d => color(d))

      legendContainer
        .append('div')
        .selectAll('p')
        .data([-1, 0, 1])
        .join('p')
        .style('position', 'absolute')
        .style('left', (d, i) => i * 50 + '%')
        .style('display', 'inline-block')
        .text(d => d * maxDev)
    }
  }
}
</script>

<style scoped>
svg >>> .active {
  stroke: rgb(0, 126, 230)
}
</style>
