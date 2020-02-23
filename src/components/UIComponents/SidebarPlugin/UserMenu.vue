<template>
  <div class="user">
    <div class="photo">
      <img src="static/img/faces/face-qkid.png" alt="user avatar"/>
    </div>
    <div class="info">
      <a data-toggle="collapse" :aria-expanded="!isClosed" @click="toggleMenu" href="#">
         <span>
           {{ me.name }}
           <b class="caret"></b>
        </span>
      </a>
      <div class="clearfix"></div>
      <div>
        <collapse-transition>
          <ul class="nav nav-menu" v-show="!isClosed">
            <li>
              <router-link :to="`/user/${me.id}`">
                <span class="sidebar-mini-icon"><i class="fa fa-user"></i></span>
                <span class="sidebar-normal">个人资料</span>
              </router-link>
            </li>
            <li>
              <a @click="logout">
                <span class="sidebar-mini-icon"><i class="fa fa-sign-out"></i></span>
                <span class="sidebar-normal">退出登录</span>
              </a>
            </li>
          </ul>
        </collapse-transition>
      </div>
    </div>
  </div>
</template>
<script>
  import { CollapseTransition } from 'vue2-transitions'
  import ME from 'src/graphql/Me.gql'
  import { onLogout } from 'src/vue-apollo'

  export default {
    components: {
      CollapseTransition
    },
    data() {
      return {
        isClosed: true,
        me: {}
      }
    },
    apollo: {
      me: {
        query: ME
      }
    },
    methods: {
      toggleMenu() {
        this.isClosed = !this.isClosed
      },
      logout() {
        const apolloClient = this.$apollo.provider.defaultClient
        onLogout(apolloClient)
        this.$router.push('/login');
      }
    }
  }
</script>
<style scoped>
  .nav.nav-menu {
    margin-top: 0;
  }
</style>
