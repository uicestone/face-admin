<template lang="pug">
  .row
    .col-md-12
      // h4.title" 所有小区
    .col-md-12.card
      .card-header
        .category
      .card-body.row
        .col-sm-6
          p-button.m-0(type='info' @click='showDetail') &#x6DFB;&#x52A0;&#x5C0F;&#x533A;
        .col-sm-6
          .pull-right
            fg-input.input-sm(placeholder='搜索' v-model='searchQuery.keyword' addon-right-icon='nc-icon nc-zoom-split')
        .col-sm-12.mt-3.mb-3
          el-table.table-striped(:data='communities' border='' @row-click='showDetail' style='width: 100%')
            el-table-column(prop='name' label='名称')
            el-table-column(prop='address' label='地址')
            el-table-column(prop='manager.name' label='居委书记')
        .col-sm-6.pagination-info
          p.category {{ communities.length }} 项已加载
        .col-sm-6.text-right
          p-button.my-0(type="primary" size="sm" v-if="pagination.hasMore" @click="loadMore") 加载更多
          p.category(v-else) 没有更多项
</template>
<script>
import Vue from "vue";
import { Table, TableColumn, Select, Option } from "element-ui";
import PPagination from "src/components/UIComponents/Pagination.vue";
import COMMUNITIES from "src/graphql/Communities.gql";
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
      searchQuery: {},
      communities: []
    };
  },
  apollo: {
    communities: {
      query: COMMUNITIES,
      variables() {
        return {
          limit: this.pagination.perPage,
          offset: 0
        };
      },
      result({
        data: {
          communities
          // totalCount: {
          //   aggregate: { count }
          // }
        }
      }) {
        this.pagination.hasMore =
          communities.length === this.pagination.perPage;
      }
    }
  },
  methods: {
    showDetail(item) {
      this.$router.push(`/community/${item.id || "new"}`);
    },
    loadMore() {
      this.pagination.currentPage++;
      // Fetch more data and transform the original result

      this.$apollo.queries.communities.fetchMore({
        // New variables
        variables: {
          limit: this.pagination.perPage,
          offset: this.pagination.perPage * (this.pagination.currentPage - 1)
        },
        // Transform the previous result with new data
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newItems = fetchMoreResult.communities;
          const hasMore =
            fetchMoreResult.communities.length === this.pagination.perPage;

          this.pagination.hasMore = hasMore;

          return {
            communities: [...previousResult.communities, ...newItems]
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
