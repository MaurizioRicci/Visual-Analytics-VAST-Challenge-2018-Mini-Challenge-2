<template>
  <div class='CalendarView'>
    <svg ref='svgCalendar'></svg>
  </div>
</template>

<script>
const d3 = require('d3')

export default {
  name: 'CalendarView',
  props: {
    width: Number,
    height: Number,
    data: Array
  },
  mounted () {
    this.redraw()
  },
  computed: {
    parseDate: () => d3.timeParse('%d/%m/%Y'),
    transformedData: function () {
      return d3.nest()//raggruppo per data
        .key(d => d.date)
        .rollup((d)=> this.rollFunc(d))
        .entries(this.data)
        .map(d => {
        let clone = Object.assign({}, d)
        clone.date = this.parseDate(clone.date)
        return clone
      })
    }
  },
  methods: {
    rollFunc: function (d) {
      // raggruppa tutti i valori di un giorno in una unico numero
      return d3.max(d, d => Math.abs(d.normVal))
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
          d3.interpolateRgb('rgba(63, 195, 128, 1)', 'rgba(240, 52, 52, 1)')
        )
        .domain([0, maxDev])
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
        .data(years)
        .join('g')
        .attr(
          'transform',
          (d, i) => `translate(40,${this.height * i + cellSize * 1.5})`
        )

      year
        .append('text')
        .attr('x', -5)
        .attr('y', -5)
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'end')
        .text(d => d.key)

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
        .attr('stroke', d => (d.value > maxDev ? 'violet' : null))
        .attr('stroke-width', '2')
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
        .attr('stroke', '#fff')
        .attr('stroke-width', 3)
        .attr('d', pathMonth)

      month
        .append('text')
        .attr(
          'x',
          d => timeWeek.count(d3.utcYear(d), timeWeek.ceil(d)) * cellSize + 2
        )
        .attr('y', -5)
        .text(formatMonth)
    }
  }
}
</script>
