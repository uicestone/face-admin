<template lang="pug">
  .row
    .offset-md-2.col-lg-8.col-md-7
      .card.mt-5
        .card-header
          h4.title.mt-3.mb-3.ml-3 居民详情
        .card-body.p-4
          form
            .row
              //- img(:src='resident.user.avatarUrl')
              //- span(v-if='resident.user.openid') 微信已绑定
              .col-md-4
                fg-input(type='text', label='姓名', v-model='resident.name')
              .col-md-4
                fg-input(type='text', label='级别', v-model='resident.level')
            .text-center.mt-3
              button.btn.btn-info.btn-fill.btn-wd(type='submit', @click.prevent='save')
                | {{ item.id ? "更新居民" : "新增居民" }}
            .clearfix

</template>
<script>
import RESIDENT from "src/graphql/Resident.gql";
import RESIDENT_UPSERT from "src/graphql/ResidentUpsert.gql";
import { DatePicker } from "element-ui";
import objectToInput from "src/util/objectToInput";

export default {
  components: {
    [DatePicker.name]: DatePicker
  },
  data() {
    return {
      resident: {},
      item: {}
    };
  },
  apollo: {
    resident: {
      query: RESIDENT,
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
          resident
          // totalCount: {
          //   aggregate: { count }
          // }
        }
      }) {
        this.item = resident;
      }
    }
  },
  methods: {
    async save() {
      const {
        data: {
          resident: {
            returning: [resident]
          }
        }
      } = await this.$apollo.mutate({
        mutation: RESIDENT_UPSERT,
        variables: {
          data: {
            ...objectToInput(this.resident, ["user"]),
            user: {
              data: objectToInput(this.resident.user),

              // such code to be substract to services
              on_conflict: {
                constraint: "PK_cace4a159ff9f2512dd42373760",
                update_columns: ["name", "sex", "birthday", "avatarUrl"]
              }
            }
          }
        }
      });

      this.$notify({
        message: "居民已保存",
        icon: "nc-icon nc-check-2",
        horizontalAlign: "center",
        verticalAlign: "bottom",
        type: "success"
      });

      this.resident = resident;
    }
  }
};
</script>
<style></style>
