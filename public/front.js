const app = Vue.createApp({
    data(){
      return{
        selection: "Expense - Month",
        chart: "exdiscmch",
      }
    },
    methods:{
      async updateSelection(){
        //expensech,exdiscmch,exdiscych
        if (this.selection == "Expense - Month"){
          this.chart = "exdiscmch"
        }
        else if (this.selection == "Expense - Year"){
          this.chart = "exdiscych"
        }
        else if (this.selection == "Expense - Lifetime"){
          this.chart = "expensech"
        }
      }
    }
  })

  app.mount('#app')
