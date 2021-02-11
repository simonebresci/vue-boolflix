// https://docs.google.com/document/d/1u4ev8ecrrACEIctVoCc2HIDS69w8G2QLBdq3EDfbzXo/edit

// MILESTONE 2
// Trasformiamo poi la stringa statica della lingua in una vera e propria bandiera della nazione corrispondente,
 // gestendo il caso in cui non abbiamo la bandiera della nazione ritornata dall’API (le flag non ci sono in FontAwesome).
//
// Allarghiamo poi la ricerca anche alle serie tv. Con la stessa azione di ricerca dovremo prendere sia i film che corrispondono alla query, sia le serie tv,
// stando attenti ad avere alla fine dei valori simili (le serie e i film hanno campi nel JSON di risposta diversi, simili ma non sempre identici)
// Qui un esempio di chiamata per le serie tv:
// https://api.themoviedb.org/3/search/tv?api_key=e99307154c6dfb0b4750f6603256716d&language=it_IT&query=scrubs
// CONSIGLIO: FILM SEPARATI DALLE SERIE




// VUE *************************************************************************
var app = new Vue ({
  el: '#root',
  data: {
    // I/O INTERFACCIA GRAFICA
    searchInput: 'Kill Bill',

    // RISULTATO QUERY
    listaFilm: [],
    listaSerieTV: [],
    lingueDisponibili: []

  },
  mounted() {
    // EMPTY
  },
  methods: {
    // METODI GENERICI *********************************************************
    // VALORE DA TRASFORMARE CON PROPORZIONE
    proportion: function(valore1,valore1Max,valore2Max){
      // Es. 7.5/10 = x / 5
      // x = (valore1 * valore2Max) / valore1Max
      // Return valore
      return (valore1 * valore2Max) / valore1Max;
    },

    // ARROTONDA PER ECCESSO
    roundUp: function(value){
      // Arrontonda per eccesso
      if( value > parseInt(value)){
        return parseInt(value) + 1;
      } else{
        return value;
      }
    },
    // /METODI GENERICI ********************************************************
    // METODI DEBUG ********************************************************
    consoleLogResultFilm: function (result){
      console.log("Titolo          : " + result.title);
      console.log("Titolo originale: " + result.original_title);
      console.log("Lingua originale: " + result.original_language);
      console.log("Voto medio      : " + result.vote_average);
      console.log("Voto in stelline: " + this.showStarRating(result.vote_average));
      console.log('');

    },
    consoleLogResultSerieTv: function (result){
      console.log("Titolo          : " + result.name);
      console.log("Titolo originale: " + result.original_name);
      console.log("Lingua originale: " + result.original_language);
      console.log("Voto medio      : " + result.vote_average);
      console.log("Voto in stelline: " + this.showStarRating(result.vote_average));
      console.log('');

    },
    // /METODI DEBUG ********************************************************
    // RICERCA QUERY ********************************
    searchQuery: function(){

      // QUERY
      const httpUri     = 'https://api.themoviedb.org';
      let   httpBody    = '';
      const httpRequest = '?api_key=41689b28957d4803002626fc60582afd&query=';
      const self = this;

      // Svuota listaFilm
      this.listaFilm = [];
      this.listaSerieTV = [];

      // Costruzione query film
      httpBody    = '/3/search/movie'; //Film
      query = httpUri + httpBody + httpRequest + this.searchInput;

      // QUERY FILM
      // Chiamata axios
      axios.get(query).then(function(objReceived){
             const result = objReceived.data.results;

             console.log("RISULTATI TROVATI: " + result.length);
             result.forEach((item, i) => {
               // AGGIUNGI A LISTA FILM
               self.listaFilm.push(result[i]);

               // OUTPUT SU CONSOLE.LOG
               console.log('# FILM N.' + i);
               self.consoleLogResultFilm(result[i]);
             });

             console.log('');
           });
      // /QUERY FILM

      // Costruzione query serie TV
      httpBody    = '/3/search/tv'; //serie tv
      query = httpUri + httpBody + httpRequest + this.searchInput;

      // QUERY SERIE TV
      axios.get(query).then(function(objReceived){
             const result = objReceived.data.results;

             console.log("RISULTATI TROVATI: " + result.length);
             result.forEach((item, i) => {
               // AGGIUNGI A LISTA FILM
               self.listaSerieTV.push(result[i]);

               // OUTPUT SU CONSOLE.LOG
               console.log('# SERIE TV N.' + i);
               self.consoleLogResultSerieTv(result[i]);

             });

             console.log('');
           });
      // /QUERY SERIE TV

      },

      // METODI GRAFICA*********************************************************
      showStarRating: function(valore){
        // Proporzione
        let result = (this.proportion(valore,10,5));
        // Round up
        result = this.roundUp(result);

        return result;
      },
      showStarRatingEmpty: function(valore){
        return (5 - this.showStarRating(valore));
      },
      showLanguageFlag: function(language){
        const flagURI               = 'https://www.countryflags.io';
        let   flag                  = language;
        const flagStyle             = 'flat'; /* flat OR shiny */
        const size                  = 32; /* size in pixel */
        const pathImgNonDisponibile = 'empty';
        const languageAccepted      = ['it','en','es', 'fr'] ;

        // Tabella Conversioni codici stati
        if(language == 'en'){
          flag = 'gb';
        }

        const query = flagURI + '/' + flag + '/' + flagStyle + '/' + size + '.png';

        if (languageAccepted.includes(language)){
          return query;
        }else{
          return flag;
        }


        return query;

      }

  }

});
Vue.config.devtools = true;

// / VUE ***********************************************************************
