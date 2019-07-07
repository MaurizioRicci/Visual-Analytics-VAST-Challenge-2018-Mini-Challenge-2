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
          <a class="nav-link" href="#/outliers_table">Tabella degli outliers</a>
        </li>
        <li>
          <a class="nav-link" href="#/dot_plot">Calendario dei rilevamenti</a>
        </li>
        <li>
          <a class="nav-link" href="#/conclusioni">Conclusioni</a>
        </li>
      </ul>
    </div>
    <div class="section wb nopadtop">
      <div class="container">

        <div class="row">

          <div class="col-md-12">

            <div class="message-box">
              <h2>Tabella degli outlier</h2>

            </div>
          </div>

          <p>
            L'indice utilizzato è la deviazione standard (dev std) poiché, essendo un indice di dispersione statistica, permette di dare una stima della variabilità di una popolazione di dati.
            Tale indicazione statistica è stata calcolata partendo dalla suddivisione dei dati per stazione di rilevamento e per ciascun elemento chimico.
            In genere i valori che superano le 7 dev std del campione sono equalmente distribuiti nel corso degli anni presi in analisi.
            <br/>Questo dato si evince in particolare dal calendario dei rilevamenti e dai bar chart presenti nella tabella degli outlier: nel primo grafico si offre la possibilità di filtrare le rilevazioni a seconda della dev std, il secondo presenta la distribuzione degli outlier nel corso degli anni e a seconda delle stazioni. Il trend che emerge da queste visualizzazioni è che in alcuni anni precedenti al 2007 i valori inconfutabilmente anomali, ovvero quelli che superano 7 dev std, si presentano con una frequenza all’incirca mensile e, a volte, anche più spesso.
          </p>

          <button style="padding: 1em"><a href="https://www.madesafe.org/science/hazard-list/">Un approfondimento sulle sostanze chimiche (in English)</a></button>
        </div>
      </div>
    </div>
    <b-row class="mt-1">
      <b-col>
        <OutliersChart/>
      </b-col>
    </b-row>
    <hr/>
    <b-row>
      <b-col>
        <OutliersTable/>
      </b-col>
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
<style scoped>
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
