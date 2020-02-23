<template>
  <div class="login-page">
    <app-navbar></app-navbar>
    <div class="wrapper wrapper-full-page">
      <div class="full-page login-page section-image">
        <!--   you can change the color of the filter page using: data-color="blue | azure | green | orange | red | purple" -->
        <div class="content">
          <div class="container">
            <div class="col-lg-4 col-md-6 ml-auto mr-auto">
              <form @submit.prevent="login">
                <card type="login">
                  <h3 slot="header" class="header text-center">登录</h3>

                  <fg-input
                    v-model="form.login"
                    addon-left-icon="nc-icon nc-single-02"
                    placeholder="用户名"
                    required
                  ></fg-input>

                  <fg-input
                    v-model="form.password"
                    addon-left-icon="nc-icon nc-key-25"
                    placeholder="密码"
                    type="password"
                    required
                  ></fg-input>

                  <br />

                  <!-- <p-checkbox>
                    Subscribe to newsletter
                  </p-checkbox>-->

                  <p-button
                    native-type="submit"
                    slot="footer"
                    type="primary"
                    round
                    block
                    class="mb-3"
                  >进入 社区内控后台管理系统</p-button>
                </card>
              </form>
            </div>
          </div>
        </div>
        <app-footer></app-footer>
        <div
          class="full-page-background"
          style="background-image: url(static/img/background/background-2.jpg) "
        ></div>
      </div>
    </div>
  </div>
</template>
<script>
import { Card, Checkbox, Button } from "src/components/UIComponents";
import AppNavbar from "./Layout/AppNavbar";
import AppFooter from "./Layout/AppFooter";
import LOGIN from "src/graphql/Login.gql";
import ME from "src/graphql/Me.gql";
import { onLogin } from "src/vue-apollo";

export default {
  components: {
    Card,
    AppNavbar,
    AppFooter,
    [Checkbox.name]: Checkbox,
    [Button.name]: Button
  },
  methods: {
    toggleNavbar() {
      document.body.classList.toggle("nav-open");
    },
    closeMenu() {
      document.body.classList.remove("nav-open");
      document.body.classList.remove("off-canvas-sidebar");
    },
    async login() {
      try {
        await this.$apollo.mutate({
          mutation: LOGIN,
          variables: {
            identify: this.form.login,
            password: this.form.password
          },
          update: (
            store,
            {
              data: {
                login: { token, user }
              }
            }
          ) => {
            const apolloClient = this.$apollo.provider.defaultClient;
            onLogin(apolloClient, token);
            apolloClient.writeQuery({
              query: ME,
              data: {
                me: user
              }
            });
          }
        });
        this.$router.replace("/");
      } catch (e) {
        let message = e.graphQLErrors[0].message;
        if (
          message.match(/^Could not find any entity of type "User" matching:/)
        ) {
          message = "用户不存在";
        }
        this.$notify({
          message,
          icon: "nc-icon nc-simple-remove",
          horizontalAlign: "center",
          verticalAlign: "bottom",
          type: "danger"
        });
      }
    }
  },
  data() {
    return {
      form: {
        login: "",
        password: ""
      }
    };
  },
  beforeDestroy() {
    this.closeMenu();
  }
};
</script>
<style>
</style>
