// https://docs.google.com/document/d/1u4ev8ecrrACEIctVoCc2HIDS69w8G2QLBdq3EDfbzXo/edit

// Trasformiamo quello che abbiamo fatto fino ad ora in una vera e propria webapp, creando un layout completo simil-Netflix:
// Un header che contiene logo e search bar
// Dopo aver ricercato qualcosa nella searchbar, i risultati appaiono sotto forma di “card” in cui lo sfondo è rappresentato dall’immagine di copertina (consiglio la poster_path con w342)
// Andando con il mouse sopra una card (on hover), appaiono le informazioni aggiuntive già prese nei punti precedenti più la overview

// TODO: pagina di test di tutte le bandiere
// TODO: Gestire overflow campo overview
// TODO: Font custom
// TODO: copertine tagliate?

// VUE *************************************************************************
var app = new Vue ({
  el: '#root',
  data: {
    // I/O INTERFACCIA GRAFICA
    searchInput: 'Kill Bill',
    selected: '',
    showSezioni: ['listaAll', 'listaFilm', 'listaSerieTV'],

    // RISULTATO QUERY
    listaFilm: [],            // Lista Film
    listaSerieTV: [],         // Lista Serie Tv
    listaAll: [],             // Lista contenente tutte le fonti



  },
  mounted() {
    this.searchQuery();
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
    bandieraNonDisponibile: function(event){
      event.target.src = "";
    },
    getSezione: function(section){
      // console.log(this.[section]);
      console.log(section);

      return section;
    },
    // copertinaNonDisponibile: function(event) {
    //   event.target.src = "https://images-na.ssl-images-amazon.com/images/I/317s8kIy1WL._AC_.jpg";
    // },
    // /METODI GENERICI ********************************************************
    // METODI DEBUG ********************************************************

    consoleLogResultFilm: function (result){
      console.log("Titolo          : " + result.title);
      console.log("Titolo originale: " + result.original_title);
      console.log("Lingua originale: " + result.original_language);
      console.log("Voto medio      : " + result.vote_average);
      console.log("Overview        : " + result.overview);
      console.log("Voto in stelline: " + this.showStarRating(result.vote_average));
      console.log('');

    },
    consoleLogResultSerieTv: function (result){
      console.log("Titolo          : " + result.name);
      console.log("Titolo originale: " + result.original_name);
      console.log("Lingua originale: " + result.original_language);
      console.log("Overview        : " + result.overview);
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
                 console.log('# SERIE TV N.' + i);
                 self.consoleLogResultSerieTv(item);
               });
               console.log('');
               // /Debug*******************************
             });
      },

      // METODI GRAFICA*********************************************************
      getPosterSrc: function(film){
        return 'https://www.themoviedb.org/t/p/w342/'+ film.poster_path;
      },
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
        const languageAccepted      = ['ab','aa','af','ak','sq','am','ar','an',
        'hy','as','av','ae','ay','az','bm','ba','eu','be','bn','bh','bi','bs',
        'br','bg','my','ca','km','ch','ce','ny','zh','cu','cv','kw','co','cr',
        'hr','cs','da','dv','nl','dz','en','eo','et','ee','fo','fj','fi','fr',
        'ff','gd','gl','lg','ka','de','ki','el','kl','gn','gu','ht','ha','he',
        'hz','hi','ho','hu','is','io','ig','id','ia','ie','iu','ik','ga','it',
        'ja','jv','kn','kr','ks','kk','rw','kv','kg','ko','kj','ku','ky','lo',
        'la','lv','lb','li','ln','lt','lu','mk','mg','ms','ml','mt','gv','mi',
        'mr','mh','ro','mn','na','nv','nd','ng','ne','se','no','nb','nn','ii',
        'oc','oj','or','om','os','pi','pa','ps','fa','pl','pt','qu','rm','rn',
        'ru','sm','sg','sa','sc','sr','sn','sd','si','sk','sl','so','st','nr',
        'es','su','sw','ss','sv','tl','ty','tg','ta','tt','te','th','bo','ti',
        'to','ts','tn','tr','tk','tw','ug','uk','ur','uz','ve','vi','vo','wa',
        'cy','fy','wo','xh','yi','yo','za','zu'];



        // Tabella Conversioni codici stati
        if(flag == 'en'){
          flag = 'gb';
        }

        if(flag == 'ja'){
          flag = 'jp';
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
