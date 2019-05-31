<template>
  <div class='CalendarView'>
    <b-row align-h="center">
      <b-col sm="2">
        <label for="range-1">Filter by st dev > {{ stDevFilter }}</label>
        <b-form-input id="range-1" v-model="stDevFilter" type="range" min="0" max="7"></b-form-input>
      </b-col>
    </b-row>
      <b-row align-h="center">
        <b-col sm="12">
          <svg ref='svgCalendar'></svg>
        </b-col>
      </b-row>
      <b-modal ref="modalInfo" id="bv-modal-info" size="lg" hide-footer>
        <template slot="modal-title">Day info for {{formatDate(tableData.date)}}</template>
        <div class='d-block text-center'>
          <b-table striped hover :items="tableData.items" :fields="tableData.fields">
          </b-table>
        </div>
      </b-modal>
  </div>
</template>

<script>
const d3 = require('d3')

export default {
  name: 'CalendarView',
  props: {
    width: Number,
    height: Number,
    data: Array,
    stations: Array
  },
  data () {
    return {
      filteredData: this.data,
      filteredDataByStations: this.data,
      stDevFilter: 0,
      tableData: []
    }
  },
  mounted () {
    this.filterByStation()
    this.redraw()
  },
  watch: {
    data: function (newVal, oldVal) { // watch it
      this.filteredData = newVal
      this.redraw()
    },
    stDevFilter: function (newVal, oldVal) { // watch it
      this.filteredData = this.filteredDataByStations.filter(d => Math.abs(d.normVal) >= newVal)
      this.redraw()
    },
    stations: function (newVal, oldVal) {
      this.filterByStation()
      this.redraw()
    }
  },
  computed: {
    parseDate: () => d3.timeParse('%d/%m/%Y'),
    formatDate: () => d3.timeFormat('%Y/%m/%d'),
    transformedData: function () {
      return d3.nest()// raggruppo per data
        .key(d => d.date)
        .rollup(d => this.rollFunc(d))
        .entries(this.filteredData)
        .map(d => {
          let clone = Object.assign({}, d)
          clone.date = this.parseDate(clone.key)
          return clone
        })
    }
  },
  methods: {
    filterByStation: function () {
      if (this.stations && this.stations.length > 0) {
        this.filteredDataByStations = this.data.filter(d => this.stations.includes(d.location))
        this.filteredData = this.filteredDataByStations
      }
    },
    rollFunc: function (d) {
      // raggruppa tutti i valori di un giorno in una unico numero
      // prende il minimo e massimo e confranta in valore assoluto
      // es: max(-10, 4) = -10
      let min = d3.min(d, d => (d.normVal))
      let max = d3.max(d, d => (d.normVal))
      if (Math.abs(min) <= Math.abs(max)) return max
      else return min
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
        .style('height', 'auto')

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
        .attr('fill', d => color(d.value))
        .attr('stroke', d => (d.value > maxDev ? 'violet' : 'black'))
        .attr('stroke-width', '2')
        .on('click', d => this.showInfo(d))
        .on('mouseover', function () { d3.select(this).classed('active', true) })
        .on('mouseout', function () { d3.select(this).classed('active', false) })
        .append('title')
        .text(d => `${formatDate(d.date)}: ${format(d.value)} devSt`)

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
      let tmp = {}
      tmp.items = this.filteredDataByStations.filter(x => d.key === x.date)
      tmp.fields = []
      tmp.fields.push({'key': 'location', 'sortable': true})
      tmp.fields.push({'key': 'measure', 'sortable': true})
      tmp.fields.push({'key': 'value', 'sortable': true})
      tmp.fields.push({'key': 'normVal', 'label': 'Normalized value', 'sortable': true})
      tmp.date = d.date // contiene la data scelta
      this.tableData = tmp
      this.$refs.modalInfo.show()
    }
  }
}
</script>

<style scoped>
svg >>> .active {
  stroke: rgb(0, 126, 230)
}
</style>
