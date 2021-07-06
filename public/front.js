const app = Vue.createApp({
    data(){
      return{
        optionIcon: 'toggle_off',
      }
    },
    methods:{
      async updateIcon(){
        if(this.optionIcon == 'toggle_off'){
        this.optionIcon = 'toggle_on'
        }else{
          this.optionIcon = 'toggle_off'
        }
      }
    }
  })

  app.mount('#app')
