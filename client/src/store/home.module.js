import { defineStore } from "pinia";

export default defineStore('home', {
    state()
    {
        return {
            title: 'some title',
            Form: {
                title: '',
                description: ''
            }
        }
    },
    actions: {
       add()
       {
           console.log(this.Form)
       }

    }
})