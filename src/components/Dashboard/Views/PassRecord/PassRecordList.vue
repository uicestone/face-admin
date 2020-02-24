<template lang="pug">
  .row
    .col-md-12
      // h4.title
    .col-md-12.card
      .card-header
        .category
      .card-body.row
        .col-sm-2
          p-button.m-0(type='info', @click='showDetail') 添加通行记录
        .col-sm-10
          .pull-right
            el-form(:inline='true')
              el-form-item
                el-date-picker(v-model='searchQuery.dateRange', value-format='yyyy-MM-dd', type='daterange', range-separator='-', start-placeholder='开始日期', end-placeholder='结束日期')
              //- el-form-item
              //-   el-select.search-by-community(v-model='searchQuery.communityIds', multiple, collapse-tags, placeholder='小区')
              //-     el-option(v-for='community in communities', :key='community.id', :label='community.name', :value='community.id')
              //- el-form-item
              //-   el-input(v-model='searchQuery.resident', placeholder='居民', suffix-icon='nc-icon nc-zoom-split')
        .col-sm-12.mt-3.mb-3
          el-table.table-striped(:data='passRecords', border, @row-click='showDetail', style='width: 100%')
            el-table-column(label='日期')
              template(slot-scope='scope')
                | {{ scope.row.date | date('M/DD H:mm') }}
            el-table-column(prop='community.name', label='小区')
            el-table-column(prop='resident.name', label='居民')
            el-table-column(label='单元')
              template(slot-scope='scope')
                span(v-if="scope.row.resident.unit") {{ scope.row.resident.unit.building }}-{{ scope.row.resident.unit.room }}
                span(v-else) -
            el-table-column(prop='direction', label='方向')
            el-table-column(label='允许')
              template(slot-scope='scope') {{ scope.row.allow ? '是' : '否' }}
        .col-sm-6.pagination-info
          p.category {{ passRecords.length }} 项已加载
        .col-sm-6.text-right
          p-button.my-0(type="primary" size="sm" v-if="pagination.hasMore" @click="loadMore") 加载更多
          p.category(v-else) 没有更多项

</template>
<script>
import Vue from "vue";
import {
  Table,
  TableColumn,
  Form,
  FormItem,
  Input,
  Select,
  DatePicker
} from "element-ui";
import PPagination from "src/components/UIComponents/Pagination.vue";
import PASSRECORDS from "src/graphql/PassRecords.gql";
import COMMUNITIES from "src/graphql/Communities.gql";
import gql from "graphql-tag";
import moment from "moment";

Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Select);
Vue.use(DatePicker);

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
      passRecords: [],
      communities: [],
      searchQuery: {}
    };
  },
  apollo: {
    // $subscribe: {
    //   passRecords: {
    //     query: gql`
    //       subscription {
    //         booking {
    //           id, remarks
    //         }
    //       }
    //     `
    //   }
    // },
    passRecords: {
      query: PASSRECORDS,
      variables() {
        const where = {};
        // if (
        //   this.searchQuery.communityIds &&
        //   this.searchQuery.communityIds.length
        // ) {
        //   where.communityId = { _in: this.searchQuery.communityIds };
        // }
        if (this.searchQuery.dateRange) {
          const [from, to] = this.searchQuery.dateRange;
          where.date = {};
          if (from) {
            where.date.gte = moment(from).startOf("day");
          }
          if (to) {
            where.date.lte = moment(to).endOf("day");
          }
        }
        // if (this.searchQuery.resident) {
        //   where.resident = {
        //     user: { name: { like: `%${this.searchQuery.resident}%` } }
        //   };
        // }
        return {
          where,
          limit: this.pagination.perPage,
          offset: this.pagination.perPage * (this.pagination.currentPage - 1)
        };
      },
      result({
        data: {
          passRecords
          // totalCount: {
          //   aggregate: { count }
          // }
        }
      }) {
        this.pagination.hasMore =
          passRecords.length === this.pagination.perPage;
      }
    },
    communities: {
      query: COMMUNITIES,
      variables: {
        order_by: { id: "asc" }
      }
    }
  },
  methods: {
    showDetail(item) {
      this.$router.push(`/pass-record/${item.id || "new"}`);
    },
    loadMore() {
      this.pagination.currentPage++;
      // Fetch more data and transform the original result

      this.$apollo.queries.passRecords.fetchMore({
        // New variables
        variables: {
          limit: this.pagination.perPage,
          offset: this.pagination.perPage * (this.pagination.currentPage - 1)
        },
        // Transform the previous result with new data
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newItems = fetchMoreResult.passRecords;
          const hasMore =
            fetchMoreResult.passRecords.length === this.pagination.perPage;

          this.pagination.hasMore = hasMore;

          return {
            passRecords: [...previousResult.passRecords, ...newItems]
          };
        }
      });
    }
  },
  filters: {
    date(input, format) {
      return moment
        .utc(input)
        .local()
        .format(format);
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
.search-by-community {
  width: 230px;
}
</style>
