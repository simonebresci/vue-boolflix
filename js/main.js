// https://docs.google.com/document/d/1u4ev8ecrrACEIctVoCc2HIDS69w8G2QLBdq3EDfbzXo/edit

// TODO: Gestire overflow campo overview
// TODO: Font custom

var app = new Vue ({
  el: '#root',
  data: {
    // I/O INTERFACCIA GRAFICA
    searchInput: 'Kill Bill',
    selected: '',
    varSezioni: ['listaAll', 'listaFilm', 'listaSerieTV', 'listaCommedie' ],
    nomiSezioni: ['FILM & SERIE TV', 'FILM', 'SERIE TV', 'COMMEDIE (COPIA DI FILM)'], /* Nomi assocciati a varSezioni */

    // RISULTATO QUERY
    listaFilm: [],            // Lista Film
    listaSerieTV: [],         // Lista Serie Tv
    listaCommedie: [],        // Lista commedie
    listaAll: [],             // Lista contenente tutte le fonti

  },
  mounted() {
    // Debug
    this.searchQuery();
  },
  methods: {
    // METODI GENERICI *********************************************************
    // VALORE DA TRASFORMARE CON PROPORZIONE
    proportion: function(valore1,valore1Max,valore2Max){
      // Es. 7.5/10 = x / 5
      // x = (valore1 * valore2Max) / valore1Max
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
    // CHIAMATA STANDARD API FILM
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
      console.log("Overview        : " + result.overview);
      console.log("Voto in stelline: " + this.getStarRating(result.vote_average));
      console.log('');

    },
    consoleLogResultSerieTv: function (result){
      console.log("Titolo          : " + result.name);
      console.log("Titolo originale: " + result.original_name);
      console.log("Lingua originale: " + result.original_language);
      console.log("Overview        : " + result.overview);
      console.log("Voto medio      : " + result.vote_average);
      console.log("Voto in stelline: " + this.getStarRating(result.vote_average));
      console.log('');

    },
    // /METODI DEBUG ********************************************************
    // RICERCA QUERY
    searchQuery: function(){
      const self = this;

      //Svuota liste
      this.listaFilm = [];
      this.listaSerieTV = [];
      this.listaAll = [];
      this.listaCommedie = [];

      // Cerca film e serie TV
      this.searchFilms('https://api.themoviedb.org/3/search/movie');
      this.searchSerieTV('https://api.themoviedb.org/3/search/tv');
      this.searchCommedie('https://api.themoviedb.org/3/search/movie'); /* Copia di movie */
    },
    // RICERCA FILM
    searchFilms: function(url){
      const self = this;
      this.standardAPICall(url)
      .then(function(objReceived){
             // Sovrascrivi lista con risposta alla query
             self.listaFilm = objReceived.data.results;
             // Aggiungi film a listaAll
             self.listaAll = [...self.listaAll, ...self.listaFilm];

           });
    },
    // RICERCA SERIE TV
    searchSerieTV: function(url){
      const self = this;
      this.standardAPICall(url)
      .then(function(objReceived){
             // Sovrascrivi lista con risposta alla query
             self.listaSerieTV = objReceived.data.results;
             // Aggiungi film a listaAll
             self.listaAll = [...self.listaAll, ...self.listaSerieTV];
           });
    },
    // RICERCA COMMEDIE
    searchCommedie: function(url){
      const self = this;
      this.standardAPICall(url)
      .then(function(objReceived){
             // Sovrascrivi lista con risposta alla query
             self.listaCommedie = objReceived.data.results;
             // Aggiungi film a listaAll
             self.listaAll = [...self.listaAll, ...self.listaCommedie];

           });
    },

    // METODI GRAFICA*********************************************************
    // GET SEZIONI  DA UNA LISTA(ARRAY)
    getSezioniFromList: function(){
      const arraySezioni = [ ];

      // Costruisci arraySezioni partendo da lista sezioni
      (this.varSezioni).forEach( (element)=>{
        arraySezioni.push(eval('this.'+ element));
      });

      return arraySezioni;
    },
    // GET PATH POSTER
    getPosterSrc: function(film){
      return 'https://www.themoviedb.org/t/p/w342/'+ film.poster_path;
    },
    // GET STAR RATING
    getStarRating: function(valore){
      // Proporzione
      let result = (this.proportion(valore,10,5));
      // Round up
      result = this.roundUp(result);

      return result;
    },
    // GET STAR RATING VUOTO
    getStarRatingEmpty: function(valore){
      return (5 - this.getStarRating(valore));
    },
    // GET BANDIERA
    getLanguageFlag: function(language){
      const flagURI               = 'https://www.countryflags.io';
      let   flag                  =  language;
      const flagStyle             = 'flat';        /* flat OR shiny */
      const size                  =  64;           /* size in pixel */
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

      // Tabella Conversioni codici non standard
      if(flag == 'en'){
        flag = 'gb';
      }

      if(flag == 'ja'){
        flag = 'jp';
      }

      const query = flagURI + '/' + flag + '/' + flagStyle + '/' + size + '.png';

      if (languageAccepted.includes(language)){
        return query;
      }else{
        return null;
      }
    }
  }

});
// TOOLS DI SVILUPPO
Vue.config.devtools = true;
