<template>
    <div class="source">
        <div v-if="posts.length < 1" class="loader">
            <span class="loader-block"></span>
            <span class="loader-block"></span>
            <span class="loader-block"></span>
            <span class="loader-block"></span>
            <span class="loader-block"></span>
            <span class="loader-block"></span>
            <span class="loader-block"></span>
        </div>
        <div v-if="posts.length > 0" id="active-post" class="active-post" v-bind:class="{active: isActivePost}">
            <post-detail id="post-detail" v-if="activePost != null" v-bind:i="activePost" v-bind:content="posts[activePost]" v-bind:class="{active: isActivePost}"></post-detail>
        </div>
        <div class="header-items" v-if="windowWidth >= 640 || (windowWidth < 640 && isActivePost == false)">
            <div v-if="index < 2" class="item item--big" v-for="(item, index) in posts" v-bind:key="item.id">
                <post-block v-bind:content="item" v-bind:i="index"></post-block>
            </div>
        </div>
        <div class="masonry-items" v-if="windowWidth >= 640 || (windowWidth < 640 && isActivePost == false)">
            <div v-masonry transition-duration="0.3s" item-selector=".item" v-if="posts && posts.length" column-width=".item--sizer">
                <div class="item--sizer"></div>
                <div v-if="index > 1" v-masonry-tile class="item" v-bind:class="getBlockSize(index)" v-for="(item, index) in posts" v-bind:key="item.id">
                    <post-block v-bind:content="item" v-bind:i="index"></post-block>
                </div>
            </div>
        </div>
        <div id="loader" v-infinite-scroll="getNextPosts" infinite-scroll-disabled="busy" infinite-scroll-distance="100">
            <div v-if="posts.length > 1 && busy" class="loader__container--bottom ">
                <div class="loader">
                    <span class="loader-block"></span>
                    <span class="loader-block"></span>
                    <span class="loader-block"></span>
                    <span class="loader-block"></span>
                    <span class="loader-block"></span>
                    <span class="loader-block"></span>
                    <span class="loader-block"></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import PostBlock from '@/components/PostBlock'
import PostDetail from '@/components/PostDetail'
import http_build_query from 'locutus/php/url/http_build_query'
import config from '@/config'
import axios from 'axios'

function scrollToTop(scrollDuration) {
    const scrollHeight = window.scrollY,
        scrollStep = Math.PI / (scrollDuration / 15),
        cosParameter = scrollHeight / 2;
    var scrollCount = 0,
        scrollMargin,
        scrollInterval = setInterval(function() {
            if (window.scrollY != 0) {
                scrollCount = scrollCount + 1;
                scrollMargin = cosParameter - cosParameter * Math.cos(scrollCount * scrollStep);
                window.scrollTo(0, (scrollHeight - scrollMargin));
            }
            else clearInterval(scrollInterval);
        }, 15);
}

export default {
    name: 'source',
    components: {
        PostBlock,
        PostDetail
    },
    data() {
        return {
            posts: [],
            errors: [],
            activePost: 0,
            isActivePost: false,
            windowWidth: 0,
            meta: '',
            busy: false
        }
    },
    mounted() {
        this.$nextTick(function() {
            window.addEventListener('resize', this.getWindowWidth)

            this.getWindowWidth()
        })
    },
    methods: {
        getBlockSize: function(index) {
            if ((index - 1) % 4 == 0) {
                return 'item--medium'
            }
            return 'item--small'
        },
        getBlockColor: function(index) {
            if (index % 3 == 0) {
                return 'background--tint-3'
            } else if (index % 2 == 0) {
                return 'background--tint-2'
            }
            return 'background--tint-1'
        },
        getPosts: function() {
            this.busy = true;
            var url = config.apiUrl + '/user/?username=' + this.$route.params.username + '&type=' + this.$route.params.type

            axios.get(url)
                .then(response => {
                    // JSON responses are automatically parsed.
                    this.posts = response.data['feeds']
                    this.meta = response.data['meta']
                    this.busy = false;
                })
                .catch(e => {
                    this.errors.push(e)
                })
        },
        getNextPosts: function() {
            this.busy = true;
            var query = http_build_query(this.meta, '')
            var url = config.apiUrl + '/user_next/?username=' + this.$route.params.username + '&type=' + this.$route.params.type + '&' + query
            axios.get(url)
                .then(response => {
                    for (var i = 0; i < response.data['feeds'].length; i++) {
                        this.posts.push(response.data['feeds'][i])
                        this.$nextTick();
                        this.$redrawVueMasonry();
                    }
                    this.meta = response.data['meta']
                    this.busy = false;
                })
                .catch(e => {
                    this.errors.push(e)
                })
        },
        closeActivePost: function() {
            this.isActivePost = false
            var a = document.getElementById('active-post')
            a.style.height = 0
        },
        openActivePost: function() {
            var a = document.getElementById('active-post')
            var b = document.getElementById('post-detail')

            if (this.posts[this.activePost].media != '') {
                var c = document.getElementById('post-detail__image');
                c.style.height = c.offsetWidth + 'px'
            } else {
                if (this.windowWidth >= 640) {
                    var c = document.getElementById('post-detail__image');
                    c.style.height = c.offsetWidth * 0.5 + 'px'
                } else {
                    var c = document.getElementById('post-detail__image');
                    c.style.height = 0 + 'px'
                    c.style.minHeight = '80px'
                }
            }

            if (window.innerWidth >= 640) {
                a.style.height = b.offsetHeight + 'px'
            } else {
                a.style.height = 'auto'
            }

            scrollToTop(600)
        },
        setActivePost: function(index) {
            this.isActivePost = true
            this.activePost = index
            this.openActivePost();
        },
        getWindowWidth: function(event) {
            this.windowWidth = document.documentElement.clientWidth
        }
    },
    created() {
        this.getPosts()
    },
    watch: {
        '$route.params.username'(from, to) {
            this.getPosts()
        },
        // '$route.params.open'(from, to) {
        //     // if (this.$route.params.open == null) {
        //     //     this.isActivePost = false;
        //     // }

        //     // this.activePost = this.$route.params.open
        //     // this.isActivePost = true
        //     // var a = document.getElementById('active-post');
        //     // var b = document.getElementById('post-detail');
        //     // a.style.height = b.offsetHeight + 'px';

        // }
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.getWindowWidth)
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.active-post {
    overflow: hidden;
}

.source {
    margin: 0 -5px;
    width: calc(100% + 5px);
    z-index: 1000;
}
</style>
