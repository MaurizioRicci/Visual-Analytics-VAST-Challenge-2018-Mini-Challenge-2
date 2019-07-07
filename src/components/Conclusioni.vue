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
              <h2>Conclusioni</h2>

            </div>
          </div>

          <p>
            Dopo aver analizzato i dati, raccolto informazioni sulle sostanze presenti nella Riserva e confrontato le misurazioni con i valori standard in cui dovrebbero essere presenti in natura si può affermare che l’ipotesi di inquinamento ambientale è confermato da molteplici fattori riportati.
            Molte sostanze tossiche sono presenti in quantità nettamente superiori alla medie e, fra le stazioni in cui si presentano maggiori criticità, ci sono Boonsri e Chai con numerosi versamenti di manganese e ferro. Si presume che tali sostanze provengano da scarichi industriali (batterie, bio-acidi, vernici, metodi di trattamento del legno) e per sostituzione chimica con i derivati del piombo. Anche i fertilizzanti chimici in agricoltura ne possono contenere una piccola percentuale. Questo elemento in acqua tende ad abbattere le cariche batteriche causando un ambiente tossico in elevata concentrazione .
            L’analisi visiva svolta per mezzo di grafici, realizzati con la libreria D3, ha permesso  visualizzazioni dinamiche e una vasta scelta di rappresentazioni grafiche per le esigenze del progetto.


          </p>

        </div>
      </div>
    </div>

          <h2 style="font-size:2em; font-weight:bolder; text-align:center">Il Team</h2>
          <div class="contact_form">
            <table style="width:100%" id="contatti">
              <tr>
                <td>Maurizio Ricci</td>
                <td>Antonio Sammartino</td>
              </tr>
              <tr>
                <td><a href="">maurizioricci95@gmail.com</a></td>
                <td><a href="">antosammartino@gmail.com</a></td>
              </tr>
            </table>
          </div>
        </div><!-- end col -->
        <!-- end row -->
      </div><!-- end container -->
    </div>
  </div>
</template>


<!--<script>-->
    <!--export default {-->
        <!--name: "Conclusioni"-->
    <!--}-->
<!--</script>-->

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
