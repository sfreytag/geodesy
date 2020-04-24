import Vue from 'vue'
import App from './App.vue'
import {store} from './store/store.js'
import axios from 'axios'

Vue.config.productionTip = false

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

axios.interceptors.response.use(
    function(response) {
        return response
    },
    function(error) {
        if (error.response) {
            console.log("Axios error:", error)
            return Promise.reject({...error})
        }
    }
)

new Vue({
    store,
    render: h => h(App),
}).$mount('#app')
