<template>
    <div id="app">
        <div class="container">
            <app-header></app-header>
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import AppHeader from '@/components/AppHeader'

export default {
    name: 'app',
    metaInfo: {
        // if no subcomponents specify a metaInfo.title, this title will be used
        title: 'Default Title',
        // all titles will be injected into this template
        titleTemplate: '%s | My Awesome Webapp',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' }
        ]
    },
    components: {
        AppHeader
    }
}
</script>

<style>

</style>
