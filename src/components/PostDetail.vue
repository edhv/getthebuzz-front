<template>
    <div class="post-detail">
        <div class="toggle-detail" v-on:click="goBack">
            <img class="arrow" src="../assets/svg/arrow_back.svg">
        </div>
        <div class="post-detail__media">
            <div class="post-detail__content">
                <div id="post-detail__image" v-bind:style="{'background-image': 'url('+ media +')'}"></div>
            </div>
        </div>
        <div id="post-detail__text" class="post-detail__text">
            <div class="post-detail__content">
                <div class="post-detail__header">
                    <span class="timestamp">{{ time }}</span>
                    <h3 v-if="title != ''" class="title">{{ title }}</h3>
                </div>
                <div class="post-detail__body">{{ text }}</div>
                <div class="post-detail__source">
                    <a v-bind:href="url" target="_blank" class="source-button">visit source</a>
                </div>
            </div>
        </div>
        <div class="source-link">
            <router-link v-bind:to="{path: '/source/' + type + '/' + user}">+</router-link>
        </div>
    </div>
</template>

<script>
import PostBlock from '@/components/PostBlock'
import config from '@/config'
import axios from 'axios'

export default {
    name: 'post-detail',
    components: {
        PostBlock
    },
    props: ['i', 'content'],
    data() {
        return {
            index: this.i,
            id: this.content.id,
            type: this.content.type,
            user: this.content.user,
            time: this.content.time,
            date: this.content.date,
            title: this.content.title,
            text: this.content.text,
            tags: this.content.tags,
            media: this.content.media,
            url: this.content.url
        }
    },
    methods: {
        goBack: function() {
            //this.$route.params.open = '';
            this.$parent.closeActivePost();
            // this.$router.go({
            //     path: '/source/' + this.type + '/' + this.name
            // })
        },
        setData: function() {
            this.index = this.i
            this.type = this.content.type
            this.user = this.content.user
            this.time = this.content.time
            this.date = this.content.date
            this.title = this.content.title
            this.text = this.content.text
            this.tags = this.content.tags
            this.media = this.content.media
            this.url = this.content.url
        }
    },
    watch: {
        content: function() {
            this.setData();
        }
    }
}
</script>

<style scoped>
.toggle-detail {
    position: absolute;
    right: 0;
    top: 0;
    width: 60px;
    height: 60px;
    background: black;
    z-index: +1;
}

.timestamp {
    color: black;
    background: 0;
    padding: 0;
    margin: 0;
}

.source-button {
    text-decoration: none;
    background-color: #703BB1;
    color: white;
    font-family: Montserrat;
    font-size: 14px;
    color: #FFFFFF;
    letter-spacing: 0.37px;
    text-transform: uppercase;
    padding: 12px 16px;
    border-radius: 2px;
}

.arrow {
    padding: 12px;
    cursor: pointer;
}

#post-detail__image {
    min-height: 50vh;
    max-height: 80vh;
    background-size: cover;
}

.source-link {
    text-align: center;
    width: 100%;
    height: 80px;
    background: white;
}

.source-link > * {
    text-decoration: none;
    font-family: Montserrat;
    font-size: 64px;
    font-weight: 600;
    color: #703BB1;
}
</style>
