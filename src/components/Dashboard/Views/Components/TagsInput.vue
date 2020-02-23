<template>
  <div>
    <el-tag
    :key="tag"
    v-for="tag in dynamicTags"
    closable
    type="info"
    :disable-transitions="false"
    @close="handleClose(tag)">
    {{tag}}
    </el-tag>
    <el-input
    class="input-new-tag"
    v-if="inputVisible"
    v-model="inputValue"
    ref="saveTagInput"
    size="small"
    @keypress.enter.native.stop="handleInputConfirm"
    @blur="handleInputConfirm"
    >
    </el-input>
    <el-button v-else class="button-new-tag" size="small" @click="showInput">+ {{newLabel}}</el-button>
  </div>
</template>

<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: middle;
  }
</style>

<script>
  import Vue from 'vue'
  import {Button, Input, Tag} from 'element-ui'
  Vue.use(Button);
  Vue.use(Input);
  Vue.use(Tag);
  
  export default {
    props: {
      value: {
        type: Array,
        default: () => []
      },
      newLabel: {
        type: String,
        default: '新标签'
      }
    },
    data() {
      return {
        inputVisible: false,
        inputValue: ''
      };
    },
    computed: {
      dynamicTags() {
        return this.value;
      }
    },
    methods: {
      handleClose(tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
        // this.$emit(this.dynamicTags);
      },

      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.dynamicTags.push(inputValue);
          // this.$emit(this.dynamicTags);
        }
        this.inputVisible = false;
        this.inputValue = '';
      }
    }
  }
</script>