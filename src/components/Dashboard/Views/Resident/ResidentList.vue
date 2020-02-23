<template lang="pug">
  .row
    .col-md-12
      // h4.title 所有居民
    .col-md-12.card
      .card-header
        .category
      .card-body.row
        .col-sm-2
          p-button.m-0(type='info', @click='showDetail') 添加居民
        .col-sm-10
          .pull-right
            fg-input.input-sm(placeholder='搜索', v-model='searchQuery.keyword', addon-right-icon='nc-icon nc-zoom-split')
        .col-sm-12.mt-3.mb-3
          el-table.table-striped(:data='residents', border='', @row-click='showDetail', style='width: 100%')
            el-table-column(prop='name', label='名称')
            el-table-column(prop='level', label='等级')
            el-table-column(prop='unit.building', label='孩子')
        .col-sm-6.pagination-info
          p.category {{ residents.length }} 项已加载
        .col-sm-6.text-right
          p-button.my-0(type="primary" size="sm" v-if="pagination.hasMore" @click="loadMore") 加载更多
          p.category(v-else) 没有更多项

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
        perPage: 100,
        currentPage: 1,
        total: null,
        hasMore: true
      },
      residents: [],
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
          residents
          // totalCount: {
          //   aggregate: { count }
          // }
        }
      }) {
        this.pagination.hasMore = residents.length === this.pagination.perPage;
      }
    }
  },
  methods: {
    showDetail(item) {
      this.$router.push(`/resident/${item.id || "new"}`);
    },
    loadMore() {
      this.pagination.currentPage++;
      // Fetch more data and transform the original result

      this.$apollo.queries.residents.fetchMore({
        // New variables
        variables: {
          limit: this.pagination.perPage,
          offset: this.pagination.perPage * (this.pagination.currentPage - 1)
        },
        // Transform the previous result with new data
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newItems = fetchMoreResult.residents;
          const hasMore =
            fetchMoreResult.residents.length === this.pagination.perPage;

          this.pagination.hasMore = hasMore;

          return {
            residents: [...previousResult.residents, ...newItems]
          };
        }
      });
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
