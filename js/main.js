// https://docs.google.com/document/d/1u4ev8ecrrACEIctVoCc2HIDS69w8G2QLBdq3EDfbzXo/edit

// MILESTONE 2
// Trasformiamo il voto da 1 a 10 decimale in un numero intero da 1 a 5, così da permetterci di stampare a schermo un numero di stelle piene che vanno da 1 a 5, lasciando le restanti vuote (troviamo le icone in FontAwesome).
// Arrotondiamo sempre per eccesso all’unità successiva, non gestiamo icone mezze piene (o mezze vuote :P)
// Trasformiamo poi la stringa statica della lingua in una vera e propria bandiera della nazione corrispondente, gestendo il caso in cui non abbiamo la bandiera della nazione ritornata dall’API (le flag non ci sono in FontAwesome).
//
// Allarghiamo poi la ricerca anche alle serie tv. Con la stessa azione di ricerca dovremo prendere sia i film che corrispondono alla query, sia le serie tv, stando attenti ad avere alla fine dei valori simili (le serie e i film hanno campi nel JSON di risposta diversi, simili ma non sempre identici)
// Qui un esempio di chiamata per le serie tv:
// https://api.themoviedb.org/3/search/tv?api_key=e99307154c6dfb0b4750f6603256716d&language=it_IT&query=scrubs


// 1) sTELLINE
// 2) bandiere
// 3) Query film + serie TV


// VUE *************************************************************************
var app = new Vue ({
  el: '#root',
  data: {
    // QUERY
    httpUri: 'https://api.themoviedb.org',
    httpBody: '/3/search/movie',
    httpRequest: '?api_key=41689b28957d4803002626fc60582afd&query=',
    query: '',

    // RISULTATO QUERY
    listaFilm: [],

    // I/O INTERFACCIA GRAFICA
    searchInput: 'Kill Bill',


  },
  mounted() {
    // EMPTY
  },
  methods: {
    // METODI GENERICI *********************************************************
    // VALORE DA TRASFORMARE CON PROPORZIONE
    proportion: function(valore1,valore1Max,valore2Max){
      let result = -1;
      // Es. 7.5/10 = x / 5
      // x = (7.5 * 5) /10
      // x = (valore1 * valore2Max) / valore1Max
      result = (valore1 * valore2Max) / valore1Max;

      // Return valore
      return result;
    },

    // ARROTONDA PER eccesso
    roundUp: function(value){
      // Arrontonda per eccesso
      if( value > parseInt(value)){
        return parseInt(value) + 1
      } else{
        return value;
      }
    },
    // /METODI GENERICI ********************************************************
    // RICERCA QUERY ********************************
    searchQuery: function(){
      // Costruzione query
      query = this.httpUri + this.httpBody + this.httpRequest + this.searchInput;

      const self = this;

      // Svuota listaFilm
      this.resetListaFilm();

      // Chiamata axios
      axios.get(query).then(function(objReceived){
             const result = objReceived.data.results;

             console.log("RISULTATI TROVATI: " + result.length);
             console.log(result);
             result.forEach((item, i) => {
               // AGGIUNGI A LISTA FILM
               self.listaFilm.push(result[i]);

               // OUTPUT SU CONSOLE.LOG
               console.log('# FILM N.' + i);
               console.log("Titolo          : " + result[i].title);
               console.log("Titolo originale: " + result[i].original_title);
               console.log("Lingua originale: " + result[i].original_language);
               console.log("Voto medio      : " + result[i].vote_average);
               console.log("Voto in stelline: " + self.showStarRating(result[i].vote_average));
               console.log('');
             });

             console.log('');
           });

      },

      // RESETTA LISTA FILM ********************************
      resetListaFilm: function(){
        this.listaFilm = [];
      },

      // METODI GRAFICA*********************************************************
      showStarRating: function(valore){
        let result = -1;
        result = this.proportion(valore,10,5);

        // Round up
        result = this.roundUp(result);

        return result;
      },
      showStarRatingEmpty: function(valore){
        return (5 - this.showStarRating(valore));
      }

      // pushElement: function (elemento){
      //   this.listaFilm.push(elemento);
      // },
      // removeElement: function (index){
      //   // Rimuovere elemento con funzione .filter
      //   this.listaEmail = this.listaEmail.filter( (element,i) =>{
      //     return (i != index);
      //   });
      // }




  }

});
Vue.config.devtools = true;

// / VUE ***********************************************************************
