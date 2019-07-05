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
    <b-row class="mt-1">
      <OutliersChart/>
    </b-row>
    <b-row>
      <OutliersTable/>
    </b-row>
  </div>
</template>

<script>
import OutliersTable from './OutliersTable'
import OutliersChart from './GroupedBarChart'

export default {
  name: 'OutliersPage1',
  components: {
    OutliersTable,
    OutliersChart
  }
}
</script>
