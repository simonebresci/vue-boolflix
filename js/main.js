/* Eseguire in Vue.js una chiamata ajax, generare 10 email e stamparle a schermo.
La chiamata ajax vi ritornerà ogni volta un'email random.
Endpoint: https://flynn.boolean.careers/exercises/api/random/mail
*/



// VUE *************************************************************************
var app = new Vue ({
  el: '#root',
  data: {
    httpUri: 'https://api.themoviedb.org',
    httpBody: '/3/search/movie',
    httpRequest: '?api_key=41689b28957d4803002626fc60582afd&query=', //Query di test
    searchInput: 'kill',
    query: '',
  },
  mounted() {
    // EMPTY
  },
  methods: {
    searchQuery: function(){
      // Costruzione query
      query = this.httpUri + this.httpBody + this.httpRequest + this.searchInput;

      // Chiamata axios
      axios.get(query).then(function(objReceived){
             const result = objReceived.data.results;

             console.log("RISULTATI TROVATI: " + result.length);
             // console.log(result);
             result.forEach((item, i) => {
               console.log('# FILM N.' + i);
               console.log("Titolo          : " + result[i].title);
               console.log("Titolo originale: " + result[i].original_title);
               console.log("Lingua originale: " + result[i].original_language);
               console.log("Voto medio      : " + result[i].vote_average);
               console.log('');
             });

             console.log('');
           });

    },
    pushElement: function (elemento){
      this.listaEmail.push(elemento);
    },
    removeElement: function (index){
      // Rimuovere elemento con funzione .filter
      this.listaEmail = this.listaEmail.filter( (element,i) =>{
        return (i != index);
      });
    }
  }

});
Vue.config.devtools = true;

// / VUE ***********************************************************************
