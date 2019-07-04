<template>
  <div class="container">
    <div class="header">
      <h1>Inquinamento idrico nella riserva di Boonsong Lekagul</h1>

      <ul class="nav nav-tabs">
        <li class="nav-item"></li>
        <li>
          <a class="nav-link" href="/">Home</a>
        </li>
        <li>
          <a class="nav-link" href="#/outliers_table">Outliers table</a>
        </li>
        <li>
          <a class="nav-link" href="#/dot_plot">Calendario dei rilevamenti</a>
        </li>
        <li>
          <a class="nav-link" href="#">Conclusioni</a>
        </li>
      </ul>
    </div>
    <div class="container-fluid">
        <svg ref='svgLines'></svg>
    </div>
  </div>
</template>

<script>
import getMeasureIntervals from '@/assets/js/getMeasureIntervals'
import infoBtn from './InfoBtn'
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
    data: {},
    methods: {
      init: function () {
        getMeasureIntervals()
          .then(data => {
            var margin = {top: 30, right: 0, bottom: 30, left: 50},
              width = 210 - margin.left - margin.right,
              height = 210 - margin.top - margin.bottom;
            const svg = d3
              .select(this.$refs.svgLines)
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)

          });
        this.getTimeFormat = function () {
          return d3.timeFormat("%b-%y");
        }
      }
    },
  // Add X axis
  // var x = d3.scaleLinear()
  //   .domain([-1, 6])
  //   .range([ 0, width]);
  //    svg.append("g")
  // .attr("transform", "translate(0," + height + ")")
  // .call(d3.axisBottom(x))
    mounted () {
      init();
    },


)
        
      }

    }
  }
}
</script>

<style scoped>

</style>
