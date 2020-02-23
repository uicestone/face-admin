<template>
  <div class="row">
    <div class="offset-md-2 col-lg-8 col-md-7">
      <div class="card mt-5">
        <div class="card-header">
          <h4 class="title mt-3 mb-3 ml-3">通行记录</h4>
        </div>
        <div class="card-body p-4">
          <form>
            <div class="row">
              <div class="col-md-4">
                <label>居民</label>
                <el-select
                  v-model="passRecord.resident"
                  value-key="id"
                  placeholder="搜索居民"
                  filterable
                  remote
                  :remote-method="searchCustomers"
                >
                  <el-option
                    v-if="!residents.length"
                    :key="passRecord.resident.id"
                    :label="passRecord.resident.name"
                    :value="passRecord.resident"
                  >
                  </el-option>
                  <el-option
                    v-for="item in residents"
                    :key="item.id"
                    :label="item.user.name"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </div>
              <div class="col-md-4">
                <div class="form-group has-label">
                  <label>日期</label>
                  <el-date-picker
                    v-model="passRecord.date"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd"
                  >
                  </el-date-picker>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-4">
                <div class="form-group has-label">
                  <label>小区</label>
                  <el-select
                    v-model="passRecord.community"
                    value-key="id"
                    placeholder="选择小区"
                    size="medium"
                  >
                    <el-option
                      v-for="community in communities"
                      :key="community.id"
                      :label="community.name"
                      :value="community"
                    >
                    </el-option>
                  </el-select>
                </div>
              </div>
            </div>

            <div class="text-center mt-3">
              <button
                type="submit"
                class="btn btn-info btn-fill btn-wd"
                @click.prevent="save"
              >
                {{ passRecord.id ? "更新通行记录" : "新增通行记录" }}
              </button>
              <button
                v-if="!passRecord.payments"
                class="btn btn-danger btn-fill btn-wd"
                @click.prevent="remove"
              >
                删除
              </button>
            </div>
            <div class="clearfix"></div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import PASSRECORD from "src/graphql/Booking.gql";
import PASSRECORD_UPSERT from "src/graphql/BookingUpsert.gql";
import PASSRECORD_DELETE from "src/graphql/BookingDelete.gql";
import COMMUNITYS from "src/graphql/Stores.gql";
import RESIDENTS from "src/graphql/Customers.gql";
import { DatePicker } from "element-ui";
import objectToInput from "src/util/objectToInput";

export default {
  components: {
    [DatePicker.name]: DatePicker
  },
  data() {
    return {
      passRecord: { community: {}, child: {}, resident: { user: {} } },
      residents: [],
      communities: []
    };
  },
  apollo: {
    passRecord: {
      query: PASSRECORD,
      variables() {
        return {
          id: +this.$route.params.id
        };
      },
      skip() {
        return this.$route.params.id === "new";
      }
    },
    communities: {
      query: COMMUNITYS
    }
  },
  methods: {
    async save() {
      const services = {
        data: this.passRecord.services.map(passRecordService => ({
          serviceId: passRecordService.service.id
        })),
        on_conflict: {
          constraint: "PK_816bd86a38b5b03368b66527146",
          update_columns: []
        }
      };
      const {
        data: {
          passRecord: {
            returning: [passRecord]
          }
        }
      } = await this.$apollo.mutate({
        mutation: PASSRECORD_UPSERT,
        variables: {
          data: objectToInput({ ...this.passRecord, services }, ["payments"]),
          id: this.passRecord.id
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

      this.passRecord = passRecord;

      if (isNew) {
        this.$router.replace(`/passRecord/${this.passRecord.id}`);
      }
    },
    async searchCustomers(keyword) {
      const {
        data: { residents }
      } = await this.$apollo.query({
        query: RESIDENTS,
        variables: {
          where: { user: { name: { _like: keyword + "%" } } }
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
