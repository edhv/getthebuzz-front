<template>
    <div class="home">
        <div v-if="posts.length < 1" class="loader__container--top">
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
        <div v-if="posts.length > 0" id="active-post" class="active-post" v-bind:class="{active: isActivePost}">
            <post-detail id="post-detail" v-if="activePost != null" v-bind:i="activePost" v-bind:content="posts[activePost]" v-bind:class="{active: isActivePost}"></post-detail>
        </div>
        <div class="masonry-items" v-if="windowWidth >= 640 || (windowWidth < 640 && isActivePost == false)">
            <div v-masonry transition-duration="0.3s" item-selector=".item" v-if="posts && posts.length" percent-position="true" column-width=".item--sizer">
                <div class="item--sizer"></div>
                <div class="gutter--sizer"></div>
                <div v-masonry-tile class="item" v-bind:class="getBlockSize(index)" v-for="(item, index) in posts" v-bind:key="item.id">
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
import axios from 'axios'
import http_build_query from 'locutus/php/url/http_build_query'
import config from '@/config'

var count = 0;

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
    name: 'home',
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
            busy: false,
            data: []
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
            if ((index + 1) % 4 == 0) {
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
        },
        getAllPosts: function() {
            this.busy = true;
            var url = config.apiUrl + '/all'
            axios.get(url)
                .then(response => {
                    this.posts = response.data['feeds'];
                    this.meta = response.data['meta'];
                    this.busy = false;
                })
                .catch(e => {
                    this.errors.push(e)
                    this.busy = false;
                })
        },
        getNextPosts: function() {
            this.busy = true;
            var query = http_build_query(this.meta, '')
            var url = config.apiUrl + '/next/?' + query
            axios.get(url)
                .then(response => {
                    for (var i = 0; i < response.data['feeds'].length; i++) {
                        this.posts.push(response.data['feeds'][i])
                        this.$nextTick();
                        this.$redrawVueMasonry();
                    }
                    this.meta = response.data['meta'];
                    this.busy = false;
                    this.$nextTick();
                    this.$redrawVueMasonry();
                })
                .catch(e => {
                    this.errors.push(e)
                    this.busy = false;
                })
        },
        loadMore: function() {
            this.busy = true;

            setTimeout(() => {
                for (var i = 0, j = 10; i < j; i++) {
                    this.data.push({
                        name: count++
                    });
                }
                this.busy = false;
            }, 1000);
        },
        redraw: function() {
            window.dispatchEvent(new Event('resize'));
        }
    },
    created() {
        this.getAllPosts()
    },
    events: {
        'vuemasonry.imageLoaded': this.redraw
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

.home {
    margin: 0 -5px;
    width: calc(100% + 5px);
    z-index: 1000;
}
</style>
