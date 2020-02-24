<template lang="pug">
  .row
    .offset-md-2.col-lg-8.col-md-7
      .card.mt-5
        .card-header
          h4.title.mt-3.mb-3.ml-3 通行记录
        .card-body.p-4
          form
            .row
              .col-md-4
                label 居民
                el-select(v-model='item.resident', value-key='id', placeholder='搜索居民', filterable='', remote='', :remote-method='searchResidents')
                  el-option(v-if='!residents.length && item.resident', :key='item.resident.id', :label='item.resident.name', :value='item.resident')
                  el-option(v-for='r in residents', :key='r.id', :label='r.name', :value='r')
              .col-md-4
                .form-group.has-label
                  label 日期时间
                  el-date-picker(v-model='item.date', type='datetime', placeholder='选择日期时间')
              .col-md-4
                .form-group.has-label
                  label 小区
                  el-select(v-model='item.community', value-key='id', placeholder='选择小区', size='medium')
                    el-option(v-for='community in communities', :key='community.id', :label='community.name', :value='community')
              .col-md-4
                .form-group.has-label
                  label 是否允许
                  .form-control-static
                    el-radio-group(v-model='item.allow')
                      el-radio-button(:label='true') 允许
                      el-radio-button(:label='false') 禁止
              .col-md-4
                .form-group.has-label
                  label 通行方向
                  .form-control-static
                    el-radio-group(v-model='item.direction')
                      el-radio-button(label='IN') 进入
                      el-radio-button(label='OUT') 外出
            .text-center.mt-3
              button.btn.btn-info.btn-fill.btn-wd.mr-3(type='submit', @click.prevent='save')
                | {{ passRecord.id ? "更新通行记录" : "新增通行记录" }}
              button.btn.btn-danger.btn-fill.btn-wd(v-if='!passRecord.payments', @click.prevent='remove')
                | 删除
            .clearfix

</template>
<script>
import PASSRECORD from "src/graphql/PassRecord.gql";
import PASSRECORD_UPSERT from "src/graphql/PassRecordUpsert.gql";
import PASSRECORD_DELETE from "src/graphql/PassRecordDelete.gql";
import COMMUNITIES from "src/graphql/Communities.gql";
import RESIDENTS from "src/graphql/Residents.gql";
import { DatePicker, RadioButton, RadioGroup } from "element-ui";

export default {
  components: {
    [DatePicker.name]: DatePicker,
    [RadioButton.name]: RadioButton,
    [RadioGroup.name]: RadioGroup
  },
  data() {
    return {
      passRecord: {},
      item: {},
      residents: [],
      communities: []
    };
  },
  apollo: {
    passRecord: {
      query: PASSRECORD,
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
          passRecord
          // totalCount: {
          //   aggregate: { count }
          // }
        }
      }) {
        this.item = passRecord;
      }
    },
    communities: {
      query: COMMUNITIES
    }
  },
  methods: {
    async save() {
      try {
        const result = await this.$apollo.mutate({
          mutation: PASSRECORD_UPSERT,
          variables: {
            where: { id: this.item.id || "" },
            create: {
              ...this.item,
              __typename: undefined,
              id: undefined,
              resident: this.item.resident
                ? {
                    connect: {
                      id: this.item.resident.id
                    }
                  }
                : undefined,
              community: this.item.community
                ? {
                    connect: {
                      id: this.item.community.id
                    }
                  }
                : undefined
            },
            update: {
              ...this.item,
              __typename: undefined,
              resident: this.item.resident
                ? {
                    connect: {
                      id: this.item.resident.id
                    }
                  }
                : this.passRecord.resident
                ? {
                    disconnect: true
                  }
                : undefined,
              community: this.item.community
                ? {
                    connect: {
                      id: this.item.community.id
                    }
                  }
                : this.passRecord.community
                ? {
                    disconnect: true
                  }
                : undefined
            }
          }
        });

        this.$notify({
          message: "通行记录已保存",
          icon: "nc-icon nc-check-2",
          horizontalAlign: "center",
          verticalAlign: "bottom",
          type: "success"
        });

        const isNew = !this.passRecord.id;

        this.passRecord = result.data.passRecord;

        if (isNew) {
          this.$router.replace(`/pass-record/${this.passRecord.id}`);
        }
      } catch (e) {
        console.error(e);
        const message = e.networkError.result.errors[0].message;
      }
    },
    async searchResidents(keyword) {
      const {
        data: { residents }
      } = await this.$apollo.query({
        query: RESIDENTS,
        variables: {
          where: { name: { startsWith: keyword } }
        }
      });

      this.residents = residents;
    },
    async remove() {
      await this.$apollo.mutate({
        mutation: PASSRECORD_DELETE,
        variables: {
          id: this.passRecord.id
        }
      });
      this.$notify({
        message: "通行记录已删除",
        icon: "nc-icon nc-check-2",
        horizontalAlign: "center",
        verticalAlign: "bottom",
        type: "danger",
        timeout: 10000000
      });
      this.$router.back();
    }
  }
};
</script>
<style></style>
