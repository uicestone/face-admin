<template>
  <div class="row">
    <div class="col-md-12">
      <!-- <h4 class="title"></h4> -->
    </div>
    <div class="col-md-12 card">
      <div class="card-header">
        <div class="category"></div>
      </div>
      <div class="card-body row">
        <div class="col-sm-2">
            <p-button type="info" class="m-0" @click="showDetail">添加预约</p-button>
        </div>
        <div class="col-sm-10">
          <div class="pull-right">
            <el-form :inline="true">
              <el-form-item>
                <el-date-picker
                  v-model="searchQuery.dateRange"
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-select
                  v-model="searchQuery.storeIds"
                  multiple
                  collapse-tags
                  placeholder="门店"
                  class="search-by-store">
                  <el-option
                    v-for="store in stores"
                    :key="store.id"
                    :label="store.name"
                    :value="store.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-input
                v-model="searchQuery.customer"
                placeholder="客人"
                suffix-icon="nc-icon nc-zoom-split"/>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="col-sm-12 mt-3 mb-3">
          <el-table class="table-striped"
                    :data="bookings"
                    border
                    @row-click="showDetail"
                    style="width: 100%">
            <el-table-column prop="date" label="日期"></el-table-column>
            <el-table-column label="时间">
              <template slot-scope="scope">
                {{ scope.row.slots[0] === 'Invalid date' ? '未确定' : scope.row.slots[0] }}
              </template>
            </el-table-column>
            <el-table-column prop="store.name" label="门店"></el-table-column>
            <el-table-column label="服务">
              <template slot-scope="scope">
                {{ scope.row.services.map(s => s.service.name).join('、') }}
              </template>
            </el-table-column>
            <el-table-column prop="child.name" label="孩子"></el-table-column>
            <el-table-column prop="customer.user.name" label="客人"></el-table-column>
            <el-table-column label="创建时间" width="115px">
              <template slot-scope="scope">
                {{ scope.row.createdAt | date('M/DD H:mm') }}
              </template>
            </el-table-column>
            <el-table-column label="定金" width="70px" class-name="text-center">
              <template slot-scope="scope">
                <i v-if="scope.row.assured" class="nc-icon nc-check-2 text-success"></i>
                <i v-else class="nc-icon nc-simple-remove text-danger"></i>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="col-sm-6 pagination-info">
          <p class="category">{{from + 1}} - {{to}} / {{total}}</p>
        </div>
        <div class="col-sm-6">
          <p-pagination class="pull-right"
                        v-model="pagination.currentPage"
                        :per-page="pagination.perPage"
                        :total="pagination.total">
          </p-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import {Table, TableColumn, Form, FormItem, Input, Select, DatePicker} from 'element-ui'
  import PPagination from 'src/components/UIComponents/Pagination.vue'
  import BOOKINGS from 'src/graphql/Bookings.gql'
  import STORES from 'src/graphql/Stores.gql'
  import gql from 'graphql-tag'
  import moment from 'moment'

  Vue.use(Table)
  Vue.use(TableColumn)
  Vue.use(Form)
  Vue.use(FormItem)
  Vue.use(Input)
  Vue.use(Select)
  Vue.use(DatePicker)
  
  export default {
    components: {
      PPagination
    },
    computed: {
      to () {
        let highBound = this.from + this.pagination.perPage
        if (this.pagination.total < highBound) {
          highBound = this.pagination.total
        }
        return highBound
      },
      from () {
        return this.pagination.perPage * (this.pagination.currentPage - 1)
      },
      total () {
        return this.pagination.total;
      }
    },
    data () {
      return {
        pagination: {
          perPage: 10,
          currentPage: 1,
          total: null
        },
        stores: [],
        searchQuery: {}
      }
    },
    apollo: {
      // $subscribe: {
      //   bookings: {
      //     query: gql`
      //       subscription {
      //         booking {
      //           id, remarks
      //         }
      //       }
      //     `
      //   }
      // },
      bookings: {
        query: BOOKINGS,
        variables() {
          const where = {};
          if (this.searchQuery.storeIds && this.searchQuery.storeIds.length) {
            where.storeId = {_in: this.searchQuery.storeIds};
          }
          if (this.searchQuery.dateRange) {
            const [from, to] = this.searchQuery.dateRange;
            where.date = {};
            if (from) {
              where.date._gte = from;
            }
            if (to) {
              where.date._lte = to;
            }
          }
          if (this.searchQuery.customer) {
            where.customer = {user: {name: {_like: `%${this.searchQuery.customer}%`}}}
          }
          return {
            where,
            limit: this.pagination.perPage,
            offset: this.pagination.perPage * (this.pagination.currentPage - 1)
          };
        },
        result({data:{totalCount: {aggregate: { count }}}}) {
          this.pagination.total = count;
        }
      },
      stores: {
        query: STORES,
        variables: {
          order_by: [{id: 'asc'}]
        }
      }
    },
    methods: {
      showDetail(item) {
        this.$router.push(`/booking/${item.id || 'new'}`);
      }
    },
    filters: {
      date(input, format) {
        return moment.utc(input).local().format(format);
      }
    }
  }
</script>
<style lang="scss">
  .el-table .td-actions{
    button.btn {
      margin-right: 5px;
    }
  }
  .search-by-store {
    width: 230px;
  }
</style>
