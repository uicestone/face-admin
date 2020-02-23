<template>
  <div class="row">
    <div class="col-md-12">
      <!-- <h4 class="title">所有居民</h4> -->
    </div>
    <div class="col-md-12 card">
      <div class="card-header">
        <div class="category"></div>
      </div>
      <div class="card-body row">
        <div class="col-sm-6"></div>
        <div class="col-sm-6">
          <div class="pull-right">
            <fg-input
              class="input-sm"
              placeholder="搜索"
              v-model="searchQuery.keyword"
              addon-right-icon="nc-icon nc-zoom-split"
            >
            </fg-input>
          </div>
        </div>
        <div class="col-sm-12 mt-3 mb-3">
          <el-table
            class="table-striped"
            :data="residents"
            border
            @row-click="showDetail"
            style="width: 100%"
          >
            <el-table-column prop="user.name" label="名称"></el-table-column>
            <el-table-column prop="mobile" label="手机"></el-table-column>
            <el-table-column
              prop="children.length"
              label="孩子"
            ></el-table-column>
          </el-table>
        </div>
        <div class="col-sm-6 pagination-info">
          <p class="category">{{ from + 1 }} - {{ to }} / {{ total }}</p>
        </div>
        <div class="col-sm-6">
          <p-pagination
            class="pull-right"
            v-model="pagination.currentPage"
            :per-page="pagination.perPage"
            :total="pagination.total"
          >
          </p-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { Table, TableColumn, Select, Option } from "element-ui";
import PPagination from "src/components/UIComponents/Pagination.vue";
import RESIDENTS from "src/graphql/Residents.gql";
import gql from "graphql-tag";
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Select);
Vue.use(Option);
export default {
  components: {
    PPagination
  },
  computed: {
    to() {
      let highBound = this.from + this.pagination.perPage;
      if (this.pagination.total < highBound) {
        highBound = this.pagination.total;
      }
      return highBound;
    },
    from() {
      return this.pagination.perPage * (this.pagination.currentPage - 1);
    },
    total() {
      return this.pagination.total;
    }
  },
  data() {
    return {
      pagination: {
        perPage: 10,
        currentPage: 1,
        total: null
      },
      searchQuery: {}
    };
  },
  apollo: {
    residents: {
      query: RESIDENTS,
      variables() {
        return {
          limit: this.pagination.perPage,
          offset: this.pagination.perPage * (this.pagination.currentPage - 1)
        };
      },
      result({
        data: {
          totalCount: {
            aggregate: { count }
          }
        }
      }) {
        this.pagination.total = count;
      }
    }
  },
  methods: {
    showDetail(item) {
      this.$router.push(`/resident/${item.id}`);
    }
  }
};
</script>
<style lang="scss">
.el-table .td-actions {
  button.btn {
    margin-right: 5px;
  }
}
</style>
