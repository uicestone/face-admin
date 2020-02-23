<template>
  <div class="row">
    <div class="offset-md-2 col-lg-8 col-md-7">
        <div class="card mt-5">
          <div class="card-header">
            <h4 class="title mt-3 mb-3 ml-3">客户详情</h4>
          </div>
          <div class="card-body p-4">
            <form>
              <div class="row">
                <img :src="customer.user.avatarUrl">
                <span v-if="customer.user.openid">微信已绑定</span>
                <div class="col-md-4">
                  <fg-input type="text"
                            label="名称"
                            v-model="customer.user.name">
                  </fg-input>
                </div>
                <div class="col-md-4">
                  <fg-input type="text"
                            label="手机"
                            v-model="customer.mobile">
                  </fg-input>
                </div>
                <div class="col-md-4">
                  <label>性别</label>
                  <el-select placeholder="选择性别" v-model="customer.user.sex">
                    <el-option v-for="v in ['未知','男','女']" :key="v" :value="v">{{v}}</el-option>
                  </el-select>
                </div>
              </div>

              <div class="text-center mt-3">
                <button type="submit" class="btn btn-info btn-fill btn-wd" @click.prevent="save">
                  更新客户
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
  import CUSTOMER from 'src/graphql/Customer.gql';
  import CUSTOMER_UPSERT from 'src/graphql/CustomerUpsert.gql'
  import CHILDREN from 'src/graphql/Children.gql'
  import { DatePicker } from 'element-ui'
  import objectToInput from 'src/util/objectToInput'

  export default {
    components: {
      [DatePicker.name]: DatePicker
    },
    data () {
      return {
        customer: {user: {}},
        children: []
      }
    },
    apollo: {
      customer: {
        query: CUSTOMER,
        variables() {
          return {
            id: +this.$route.params.id
          };
        }
      }
    },
    methods: {
      async save () {
        const { data: {customer: { returning: [ customer ] } } } = await this.$apollo.mutate({
          mutation: CUSTOMER_UPSERT,
          variables: {
            data: {
              ...objectToInput(this.customer, ['user']),
              user: {
                data: objectToInput(this.customer.user),

                // such code to be substract to services
                on_conflict: {
                  constraint: 'PK_cace4a159ff9f2512dd42373760',
                  update_columns: [
                    'name',
                    'sex',
                    'birthday',
                    'avatarUrl'
                  ]
                }
              }
            }
          }
        });

        this.$notify({
          message: '客户已保存',
          icon: 'nc-icon nc-check-2',
          horizontalAlign: 'center',
          verticalAlign: 'bottom',
          type: 'success'
        })

        this.customer = customer;
      }
    }
  }
</script>
<style>

</style>
