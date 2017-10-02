<template>
    <div class="app-header">
        <router-link to="/"><img class="logo" src="../assets/svg/getthebuzz_logo.svg"></router-link>
        
        <div class="menu-toggle" v-bind:class="{ active: isActive }" v-on:click="toggle">
            <div class="bar"></div>
        </div>
        <div class="menu-dropdown" v-bind:class="{ active: isActive }">
            <h3>
                A real-time insight into the hottest parties, most beautiful exhibitions, most interesting lectures and underground gems.
            </h3>
            <div class="button-wrapper">
                <div class="button">contact</div>
                <div class="button">contribute</div>
            </div>
            <div class="menu-header">
                <span>sources</span>
            </div>
            <ul v-if="sources.length > 0" class="menu-list">
                <li v-for="(item, index) in sources" v-bind:key="item.id">
                    <router-link v-on:click.native="hideDropdown" v-bind:to="{path: '/source/' + item.type + '/' + item.username}">{{ item.username }}</router-link>
                    <!-- <a v-bind:href="'#/source/?username=' + item.username + '&type=' + item.type">{{ item.username }}</a> -->
                    </li>
            </ul>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import config from '../config'

export default {
    name: 'app-header',
    data() {
        return {
            isActive: false,
            sources: [],
            errors: []
        }
    },
    methods: {
        toggle: function(e) {
            var element = e.currentTarget
            if (element.classList.contains("active")) {
                this.isActive = false
            } else {
                this.isActive = true
            }
        },
        hideDropdown: function () {
            this.isActive = false;
        }
    },
    created() {
        axios.get(config.apiUrl + '/sources')
            .then(response => {
                // JSON responses are automatically parsed.
                this.sources = response.data
            })
            .catch(e => {
                this.errors.push(e)
            })
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.app-header {
    width: 100%;
    background: #fff;
    height: 60px;
    position: relative;
    z-index: 2000;
}

.logo {
    height: 40px;
    width: auto;
    float: left;
    padding: 5px;
    margin-top: 10px;
    margin-left: 60px;
}

.menu-toggle {
    position: absolute;
    top: 0;
    right: 0;
    cursor: pointer;
    z-index: +2;
}

h3 {
    font-family: Montserrat;
    font-weight: bold;
    font-size: 30px;
    color: white;
    letter-spacing: 0.62px;
    line-height: 1.6em;
    margin: 0 72px;
    text-align: center;
}

@media screen and (max-width: 639px){
    h3 {
        font-size: 20px;
        margin: 0 40px;
    }
}

a {
    color: white;
    text-decoration: none;
}

ul {
    font-size: 24px;
    color: #FFFFFF;
    letter-spacing: 0.5px;
    line-height: 40px;
    text-transform: uppercase;
    margin-bottom: 120px;
}

ul li {
    text-align: center;
}
</style>