<template lang="pug">
  .row
    .offset-md-2.col-lg-8.col-md-7
      .card.mt-5
        .card-header
          h4.title.mt-3.mb-3.ml-3 居民详情
        .card-body.p-4
          form
            .row
              .col-md-4.text-center
                img.face-img(:src="'https://face.codeispoetry.tech/static/'+item.id+'.png'" width="75%")
                //- span(v-if='item.user.openid') 微信已绑定
              .col-md-8.row
                .col-md-6
                  fg-input(type='text', label='姓名', v-model='item.name')
                .col-md-6
                  fg-input(type='text', label='级别', v-model='item.level')
                .col-md-6
                  label 单元
                  el-select(v-model='item.unit' value-key='id' placeholder='搜索单元' filterable remote :remote-method='searchUnits' clearable @clear='clearUnitSelect')
                    el-option(v-if='!units.length && item.unit' :key='item.unit.id' :label="item.unit.building+'-'+item.unit.room" :value='item.unit')
                    el-option(v-for='u in units' :key='u.id' :label="u.building+'-'+u.room" :value='u')
                .col-md-6
                  fg-input(type='text', label='小区', v-model='item.community.name' disabled)
            .text-center.mt-3
              button.btn.btn-info.btn-fill.btn-wd(type='submit', @click.prevent='save')
                | {{ item.id ? "更新居民" : "新增居民" }}
            .clearfix

</template>
<script>
import RESIDENT from "src/graphql/Resident.gql";
import RESIDENT_UPSERT from "src/graphql/ResidentUpsert.gql";
import UNITS from "src/graphql/Units.gql";
import { DatePicker } from "element-ui";

export default {
  components: {
    [DatePicker.name]: DatePicker
  },
  data() {
    return {
      resident: {},
      item: {},
      units: []
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
      try {
        const result = await this.$apollo.mutate({
          mutation: RESIDENT_UPSERT,
          variables: {
            where: { id: this.item.id || "" },
            create: {
              ...this.item,
              __typename: undefined,
              unit: this.item.unit
                ? {
                    connect: {
                      id: this.item.unit.id
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
              unit: this.item.unit
                ? {
                    connect: {
                      id: this.item.unit.id
                    }
                  }
                : this.resident.unit
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
                : this.resident.community
                ? {
                    disconnect: true
                  }
                : undefined
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

        const isNew = !this.resident.id;

        this.resident = result.data.resident;

        if (isNew) {
          this.$router.replace(`/resident/${this.resident.id}`);
        }
      } catch (e) {
        console.error(e);
        const message = e.networkError.result.errors[0].message;
      }
    },
    async searchUnits(keyword) {
      const [bk, rk] = keyword.split("-");
      const {
        data: { units }
      } = await this.$apollo.query({
        query: UNITS,
        variables: {
          where: {
            building: { startsWith: bk },
            room: rk ? { startsWith: rk } : undefined
          }
        }
      });

      this.units = units;
    },
    clearUnitSelect() {
      this.item.unit = null;
    }
  }
};
</script>
<style>
.face-img {
  border-radius: 10px;
}
</style>
