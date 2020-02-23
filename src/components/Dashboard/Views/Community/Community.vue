<template lang="pug">
  .row
    .offset-md-2.col-lg-8.col-md-7
      .card.mt-5
        .card-header
          h4.title.mt-3.mb-3.ml-3 社区详情
        .card-body.p-4
          form
            .row
              .col-md-4
                fg-input(type='text' label='名称' v-model='item.name')
              .col-md-4
                fg-input(type='text' label='电话' v-model='item.phone')
              .col-md-4
                label 居委书记
                el-select(v-model='item.manager' value-key='id' placeholder='搜索用户' filterable remote :remote-method='searchUsers' clearable @clear='clearManagerSelect')
                  el-option(v-if='!users.length && item.manager' :key='item.manager.id' :label='item.manager.name' :value='item.manager')
                  el-option(v-for='item in users' :key='item.id' :label='item.name' :value='item')
              .col-md-12
                fg-input(type='text' label='地址' v-model='item.address')
            .text-center.mt-3
              button.btn.btn-info.btn-fill.btn-wd(type='submit' @click.prevent='update')
                | {{ item.id ? "更新社区" : "新增社区" }}
            .clearfix
</template>
<script>
import moment from "moment";
import COMMUNITY from "src/graphql/Community.gql";
import COMMUNITY_UPSERT from "src/graphql/CommunityUpsert.gql";
import USERS from "src/graphql/Users.gql";
import objectToInput from "src/util/objectToInput";
import TagsInput from "../Components/TagsInput";
import Vue from "vue";
import { Slider } from "element-ui";
Vue.use(Slider);

export default {
  components: {
    TagsInput
  },
  data() {
    return {
      community: {},
      item: {},
      users: []
    };
  },
  apollo: {
    community: {
      query: COMMUNITY,
      variables() {
        return {
          id: this.$route.params.id
        };
      },
      skip() {
        return this.$route.params.id === "new";
      },
      result({
        data: {
          community
          // totalCount: {
          //   aggregate: { count }
          // }
        }
      }) {
        this.item = community;
      }
    }
  },
  methods: {
    async update() {
      try {
        const result = await this.$apollo.mutate({
          mutation: COMMUNITY_UPSERT,
          variables: {
            where: { id: this.item.id || "" },
            create: {
              ...this.item,
              __typename: undefined,
              id: undefined,
              manager: this.item.manager
                ? {
                    connect: {
                      id: this.item.manager.id
                    }
                  }
                : undefined
            },
            update: {
              ...this.item,
              __typename: undefined,
              manager: this.item.manager
                ? {
                    connect: {
                      id: this.item.manager.id
                    }
                  }
                : this.community.manager
                ? {
                    disconnect: true
                  }
                : undefined
            }
          }
        });

        this.$notify({
          message: "社区已保存",
          icon: "nc-icon nc-check-2",
          horizontalAlign: "center",
          verticalAlign: "bottom",
          type: "success"
        });

        const isNew = !this.community.id;

        this.community = result.data.community;

        if (isNew) {
          this.$router.replace(`/community/${this.community.id}`);
        }
      } catch (e) {
        console.error(e);
        const message = e.networkError.result.errors[0].message;
        if (
          message.match(/^Uniqueness violation\./) &&
          message.match(/"REL_8ad62f4838beb7599ccb071de9"/)
        ) {
          this.$notify({
            message: `${this.community.manager.name} 已经是其他社区的书记`,
            icon: "nc-icon nc-simple-remove",
            horizontalAlign: "center",
            verticalAlign: "bottom",
            type: "danger"
          });
        }
      }
    },
    async searchUsers(keyword) {
      const {
        data: { users }
      } = await this.$apollo.query({
        query: USERS,
        variables: {
          where: { name: { startsWith: keyword + "%" } }
        }
      });

      this.users = users;
    },
    clearManagerSelect() {
      this.community.manager = null;
    },
    numberToDay(day) {
      return moment()
        .day(day)
        .format("ddd");
    }
  }
};
</script>
<style lang="scss">
.form-control {
  height: calc(2.25rem + 4px);
}
</style>
