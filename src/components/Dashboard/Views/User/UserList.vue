<template>
  <div class="row">
    <div class="col-md-12">
      <!-- <h4 class="title">后台用户</h4> -->
    </div>
    <div class="col-md-12 card">
      <div class="card-header">
        <div class="category">包括总部用户和门店用户</div>
      </div>
      <div class="card-body row">
        <div class="col-sm-6">
        </div>
        <div class="col-sm-6">
          <div class="pull-right">
            <fg-input class="input-sm"
                      placeholder="搜索"
                      v-model="searchQuery.keyword"
                      addon-right-icon="nc-icon nc-zoom-split">
            </fg-input>
          </div>
        </div>
        <div class="col-sm-12 mt-3 mb-3">
          <el-table class="table-striped"
                    :data="users"
                    border
                    @row-click="showDetail"
                    style="width: 100%">
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column prop="sex" label="性别"></el-table-column>
            <el-table-column prop="birthday" label="生日"></el-table-column>
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
  import {Table, TableColumn, Select, Option} from 'element-ui'
  import PPagination from 'src/components/UIComponents/Pagination.vue'
  import USERS from 'src/graphql/Users.gql'
  import gql from 'graphql-tag'
  Vue.use(Table)
  Vue.use(TableColumn)
  Vue.use(Select)
  Vue.use(Option)
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
        searchQuery: {}
      }
    },
    apollo: {
      users: {
        query: USERS,
        variables() {
          return {
            where: {role: {_in: ['ADMIN', 'MANAGER']}},
            limit: this.pagination.perPage,
            offset: this.pagination.perPage * (this.pagination.currentPage - 1)
          };
        },
        result({data:{totalCount: {aggregate: { count }}}}) {
          this.pagination.total = count;
        }
      }
    },
    methods: {
      showDetail(item) {
        this.$router.push(`/user/${item.id}`);
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
</style>
