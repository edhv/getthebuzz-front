<template>
    <div class="post-block">
        <div class="post__content" v-bind:class="getBlockColor(index)" v-bind:style="{ 'background-image': getBackground(index), 'animation-delay': (100 * index) + 'ms' }">
            <div class="align-top">
                <span class="timestamp">
                    {{ time }}
                </span>
            </div>
            <div class="align-bottom">
                <router-link v-bind:to="{path: '/source/' + type + '/' + user}" v-on:click.native="deactivate">
                    <span class="user">
                        {{ user }}
                    </span>
                </router-link>
                <!-- <router-link v-bind:to="{path: '/source/' + type + '/' + user + '/' + index}"> -->
                <div class="activate-post" v-on:click="activate">
                    <span v-if="title" class="title">
                        {{ title }}
                    </span>
                    <span v-else-if="type == 'twitter'" class="text--light">
                        {{ getText() }}
                    </span>
                    <span v-else class="text">
                        {{ text }}
                    </span>
                </div>
                <!-- </router-link> -->
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'post-block',
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
        getBlockColor: function(index) {
            if (index % 3 == 0) {
                return 'background--tint-3'
            } else if (index % 2 == 0) {
                return 'background--tint-2'
            }
            return 'background--tint-1'
        },
        getBackground(index) {
            if (this.media == "") {
                var startColor = '#703bb1';
                var stopColor = '#381d58';
                if (index % 3 == 0) {
                    stopColor = '#1F1130';
                } else if (index % 2 == 0) {
                    startColor = '#8258C9';
                }

                return 'linear-gradient('+startColor+', '+stopColor+')'
            } else {
                return 'url(' + this.media + ')'
            }
        },
        getText: function () {
            var fullString = "" + this.text
            var maxLength = 500

            if (window.innerWidth < 960) {
                var maxLength = 150
            }
            if (window.innerWidth < 640) {
                var maxLength = 100    
            }

            var trimmedString = fullString.substr(0, maxLength);

            trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")))

            if (trimmedString.length < fullString.length) {
                trimmedString = trimmedString + "..."
            }
            return trimmedString;
        },
        activate: function() {
            this.$parent.setActivePost(this.index)
        },
        deactivate: function() {
            this.$parent.closeActivePost()
        }
    }
}
</script>

<style scoped>
.background--tint-2 {
    background: #DCDCDC;
}

.background--tint-2 {
    background: #DCDCDC;
}

.background--tint-3 {
    background: #CBCBCB;
}

.align-top {
    position: absolute;
    top: 33px;
}

.align-bottom {
    position: absolute;
    bottom: 24px;
    width: 90%;
    max-width: 500px;
    max-height: 55%;
    overflow: hidden;
    text-overflow: ellipsis;
}
.activate-post {
    cursor: pointer;
}
</style>
