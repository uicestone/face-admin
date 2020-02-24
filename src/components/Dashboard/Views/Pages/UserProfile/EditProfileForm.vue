<template lang="pug">
  .card.mt-5
    .card-header
      h4.title.mt-3.mb-3.ml-3 用户资料
    .card-body.p-4
      form
        .row
          .col-md-4
            fg-input(type='text', label='名称', v-model='user.name')  
          .col-md-4
            fg-input(type='text', label='性别', v-model='user.sex')  
          .col-md-4
            .form-group.has-label
              label 生日
              el-date-picker(v-model='user.birthday', type='date', placeholder='选择日期', default-value='1980-01-01', value-format='yyyy-MM-dd')
        .row
          .col-md-4
            fg-input(type='text', label='用户名', v-model='user.login')
          .col-md-4
            .form-group.has-label
              label 角色
              el-select(v-model='user.role', placeholder='选择角色', size='medium')
                el-option(v-for='item in roles', :key='item.value', :label='item.label', :value='item.value')
          .col-md-4
            fg-input(type='password', label='重置密码', v-model='user.password', autocomplete='new-password')
        .text-center.mt-3
          button.btn.btn-info.btn-fill.btn-wd(type='submit', @click.prevent='updateProfile')
            | 更新用户资料
        .clearfix

</template>
<script>
import USER from "src/graphql/User.gql";
import USER_UPSERT from "src/graphql/UserUpsert.gql";
import RESET_PASSWORD from "src/graphql/ResetPassword.gql";
import { DatePicker } from "element-ui";
import objectToInput from "src/util/objectToInput";
export default {
  components: {
    [DatePicker.name]: DatePicker
  },
  data() {
    return {
      user: { role: "" },
      roles: [
        { value: "ADMIN", label: "总部" },
        { value: "MANAGER", label: "门店" }
      ]
    };
  },
  apollo: {
    user: {
      query: USER,
      variables() {
        return {
          id: +this.$route.params.id
        };
      }
    }
  },
  methods: {
    async updateProfile() {
      const r = await this.$apollo.mutate({
        mutation: USER_UPSERT,
        variables: {
          id: this.user.id,
          set: objectToInput(this.user)
        }
      });

      if (this.user.login && this.user.password) {
        await this.$apollo.mutate({
          mutation: RESET_PASSWORD,
          variables: {
            identify: this.user.login,
            password: this.user.password
          }
        });
        this.$notify({
          message: "密码已重置",
          icon: "nc-icon nc-check-2",
          horizontalAlign: "center",
          verticalAlign: "bottom",
          type: "warning"
        });
      }

      this.$notify({
        message: "更新用户资料成功",
        icon: "nc-icon nc-check-2",
        horizontalAlign: "center",
        verticalAlign: "bottom",
        type: "success"
      });

      this.user = r.data.user.returning[0];
    }
  }
};
</script>
<style></style>
