<template lang="pug">
  .row
    .col-md-12
      // h4.title 后台用户
    .col-md-12.card
      .card-header
        //- .category 包括总部用户和门店用户
      .card-body.row
        .col-sm-6
        .col-sm-6
          .pull-right
            fg-input.input-sm(placeholder='搜索' v-model='searchQuery.keyword' addon-right-icon='nc-icon nc-zoom-split')
        .col-sm-12.mt-3.mb-3
          el-table.table-striped(:data='users' border='' @row-click='showDetail' style='width: 100%')
            el-table-column(prop='name' label='名称')
            el-table-column(prop='login' label='用户名')
        .col-sm-6.pagination-info
          p.category {{ users.length }} 项已加载
        .col-sm-6.text-right
          p-button.my-0(type="primary" size="sm" v-if="pagination.hasMore" @click="loadMore") 加载更多
          p.category(v-else) 没有更多项

</template>
<script>
import Vue from "vue";
import { Table, TableColumn, Select, Option } from "element-ui";
import PPagination from "src/components/UIComponents/Pagination.vue";
import USERS from "src/graphql/Users.gql";
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
      users: [],
      searchQuery: {}
    };
  },
  apollo: {
    users: {
      query: USERS,
      variables() {
        return {
          where: {},
          limit: this.pagination.perPage,
          offset: 0
        };
      },
      result({
        data: {
          users
          // totalCount: {
          //   aggregate: { count }
          // }
        }
      }) {
        this.pagination.hasMore = users.length === this.pagination.perPage;
      }
    }
  },
  methods: {
    showDetail(item) {
      this.$router.push(`/user/${item.id}`);
    },
    loadMore() {
      this.pagination.currentPage++;
      // Fetch more data and transform the original result

      this.$apollo.queries.users.fetchMore({
        // New variables
        variables: {
          limit: this.pagination.perPage,
          offset: this.pagination.perPage * (this.pagination.currentPage - 1)
        },
        // Transform the previous result with new data
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newItems = fetchMoreResult.users;
          const hasMore =
            fetchMoreResult.users.length === this.pagination.perPage;

          this.pagination.hasMore = hasMore;

          return {
            users: [...previousResult.users, ...newItems]
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
