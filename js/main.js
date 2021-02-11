// https://docs.google.com/document/d/1u4ev8ecrrACEIctVoCc2HIDS69w8G2QLBdq3EDfbzXo/edit



// TODO: mostrare immagine alternativa se poster non presente


// VUE *************************************************************************
var app = new Vue ({
  el: '#root',
  data: {
    // I/O INTERFACCIA GRAFICA
    searchInput: 'Kill Bill',

    // RISULTATO QUERY
    listaFilm: [],            // Lista Film
    listaSerieTV: [],         // Lista Serie Tv
    listaAll: [],             // Lista contenente tutte le fonti

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
    standardAPICall: function(URL){
      return axios.get(URL,{
              params: {
                api_key: '41689b28957d4803002626fc60582afd',
                query: this.searchInput,
                language: 'it-IT',
              },
            });

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
      const self = this;

      //Svuota liste
      this.listaFilm = [];
      this.listaSerieTV = [];
      this.listaAll = [];

      // Cerca film e serie TV
      this.searchFilms('https://api.themoviedb.org/3/search/movie');
      this.searchSerieTV('https://api.themoviedb.org/3/search/tv');

      },
      searchFilms: function(url){
        const self = this;
        this.standardAPICall(url)
        .then(function(objReceived){
               // Sovrascrivi lista con risposta alla query
               self.listaFilm = objReceived.data.results;
               // Aggiungi film a listaAll
               self.listaAll = [...self.listaAll, ...self.listaFilm];

               // Debug*******************************
               const result = objReceived.data.results;
               console.log("RISULTATI TROVATI: " + result.length);
               result.forEach((item, i) => {
                 // OUTPUT SU CONSOLE.LOG
                 console.log('# FILM N.' + i);
                 self.consoleLogResultFilm(item);
               });
               console.log('');
               // /Debug*******************************
             });
      },
      searchSerieTV: function(url){
        const self = this;
        this.standardAPICall(url)
        .then(function(objReceived){
               // Sovrascrivi lista con risposta alla query
               self.listaSerieTV = objReceived.data.results;
               // Aggiungi film a listaAll
               self.listaAll = [...self.listaAll, ...self.listaSerieTV];

               // Debug*******************************
               const result = objReceived.data.results;
               console.log("RISULTATI TROVATI: " + result.length);
               result.forEach((item, i) => {
                 // OUTPUT SU CONSOLE.LOG
                 console.log('# FILM N.' + i);
                 self.consoleLogResultSerieTv(item);
               });
               console.log('');
               // /Debug*******************************
             });
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
        const flagStyle             = 'flat';        /* flat OR shiny */
        const size                  = 64;           /* size in pixel */
        const pathImgNonDisponibile = 'empty';
        const languageAccepted      = ['it','en','es', 'fr'] ;

        // Tabella Conversioni codici stati
        if(flag == 'en'){
          flag = 'gb';
        }

        const query = flagURI + '/' + flag + '/' + flagStyle + '/' + size + '.png';

        // console.log('Chiamo axios per icona:' + query);
        // axios.get(query)
        //       .then(function(objReceived){
        //         console.log('icona trovata');
        //       })
        //       .catch(function(error){
        //         console.log('icona non trovata');
        //         console.log(error)
        //        });


        if (languageAccepted.includes(language)){
          return query;
        }else{
          return null;
        }




      }

  }

});
Vue.config.devtools = true;

// / VUE ***********************************************************************
