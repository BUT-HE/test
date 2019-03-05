export default {
  name: 'ElFormQ',
  template: '<div></div>',
  props: {
    fieldData: {
      type: Array,
      default: function() {
        return [];
      }
    },
    buttons: Array,
    columns: {
      type: Number,
      default: 4
    },
    forceColumn: {
      type: Boolean,
      default: true
    },
    moreData: {
      type: Array,
      default: function() {
        return [];
      }
    },
    searchTable: String,
    buttonAdhere: Boolean,
    labelPosition: {
      type: String,
      default: 'right'
    },
    labelWidth: String,
    labelSuffix: {
      type: String,
      default: ''
    },
    inline: Boolean,
    showMessage: {
      type: Boolean,
      default: true
    },
    thrift: Boolean,
    floatSearch: Boolean,
    resetButton: {
      type: Boolean,
      default: true
    },
    size: String,
    title: String

  },

  data() {

    return {
      fm: {},
      rules: {},
      _fd: [],
      fieldDatas: this.fieldData,
      showSearch: false,
      consButtons: [
        {
          label: (this.thrift ? '' : '搜索'), op: 'submit', type: 'primary', icon: 'search', show: true, click: function(model, valid, me) {
            if (valid) {
              var param = { condition: JSON.stringify(model) };
              if (me.searchTable) {
                me.$root.$refs[me.searchTable].remoteData(param);
              } else {
                me.$emit('search-click', model, valid, me);
              }
            }
          }
        },
        { label: '重置', op: 'reset', type: 'primary', icon: 'yx-loop2', show: this.resetButton },
        { label: '高级', op: 'switch', type: 'text', icon: 'caret-bottom', show: (this.moreData && this.moreData.length > 0) }
      ],
      moreSearchClass: (this.floatSearch ? 'yu-formQFloat' : ''),
      fitButton: (this.forceColumn ? 'yu-formQButton' : 'yu-formQButton yu-right'),
      span: parseInt(24 / this.columns, 0)
    };

  },
  methods: {
    click: function(fn, op) {
      var me = this;
      if (me.buttons) {
        // 配置了默认的按钮，兼容之前的代码
        if (op === 'reset') {
          this.$children[0].resetFields();
          fn && fn(me.fm);
        } else if (op === 'submit') {
          this.$children[0].validate(function(valid) {
            fn(me.fm, valid);
          });
        } else {
          fn(me.fm);
        }
      } else {
        if (op === 'reset') {
          this.$children[0].resetFields();
          fn && fn(me.fm);
        } else if (op === 'submit') {
          this.$children[0].validate(function(valid) {
            fn(me.fm, valid, me);
          });
        } else if (op === 'switch') {
          this.showSearch = !this.showSearch;
          if (this.consButtons[2].icon === 'caret-bottom') {
            this.consButtons[2].icon = 'caret-top';
          } else {
            this.consButtons[2].icon = 'caret-bottom';
          }

        }
      }
    },
    subRefs: function(field) {
      var ref = this.$refs[field];
      if (ref && ref.length > 0) {
        ref = ref[0];
      }
      return ref;
    },
    rebuildFn: function() {
      var model = {};
      var rules = {};
      // var t = {};
      for (var i = 0, len = this.fieldDatas.length; i < len; i++) {
        var tmp = this.fieldDatas[i];
        model[tmp.field] = tmp.value || '';
        if (tmp.rules) {
          rules[tmp.field] = tmp.rules;
        }
      }
      this._fd = this.fieldDatas;
      this.rules = rules;
      this._thrift = this.thrift;
    },
    preTreat: function() {
      var model = {};
      var rules = {};
      // var t = {};
      for (var i = 0, len = this.fieldDatas.length; i < len; i++) {
        var tmp = this.fieldDatas[i];
        model[tmp.field] = tmp.value || '';
        if (tmp.rules) {
          rules[tmp.field] = tmp.rules;
        }
      }
      this.fm = model;
      this._fd = this.fieldDatas;
      this.rules = rules;
      this._thrift = this.thrift;
    },
    switch: function(field, params, value) {
      var dataArr = this.fieldDatas;
      this.fieldDatas = [];
      dataArr.filter(function(cur, index, arr) {
        if (cur.field === field) {
          cur[params] = value;
        }
      });
      this.fieldDatas = dataArr;
    }
  },
  mounted() {
    if (this.buttons) {
      return; // 兼容之前的代码
    }
    // 没有配置thrift属性,进行代码判断
    if (!this.$options.propsData.hasOwnProperty('thrift')) {
      var _this = this;
      var subWidth = 0;
      var btnDiv = _this.$el.querySelectorAll('.yu-formQButton');
      var formQBtns = btnDiv[0].querySelectorAll('button');
      if (formQBtns.length === 1) {
        subWidth = 90;
      } else if (formQBtns.length === 2) {
        if (_this.resetButton) {
          subWidth = 180;
        } else {
          subWidth = 150;
        }
      } else if (formQBtns.length === 3) {
        subWidth = 240;
      }
      var calActualWidth = function(dom, orginDom) {
        var restoreArray = [];
        var p = dom;
        while (orginDom[0].offsetWidth <= 0 && orginDom[1].offsetWidth <= 0) {
          p = findActualWidth(p, orginDom);
          if (!p) {
            return restoreArray;
          }
          restoreArray.push(p);
        }
        return restoreArray;
      };
      // 因为dom隐藏的原因，需要找出
      var findActualWidth = function(dom, orginDom) {
        while (dom.parentElement.style.display !== 'none') {
          dom = dom.parentElement;
          if (dom.parentElement.nodeName === 'BODY') {
            return null;
          }
        }
        dom.parentElement.style.display = 'block';
        return dom.parentElement;
      };
      var calWidth = function() {
        var _btnDiv;
        var restoreArray = [];
        if (btnDiv[0].offsetWidth <= 0 && btnDiv[1].offsetWidth <= 0) {
          // 需要计算实际宽度
          restoreArray = calActualWidth(btnDiv[0], btnDiv);
        }
        if (btnDiv[0].offsetWidth > 0) {
          _btnDiv = btnDiv[0];
        } else {
          _btnDiv = btnDiv[1];
        }
        if (subWidth >= _btnDiv.offsetWidth) {
          _this._thrift = true;
        } else {
          _this._thrift = false;
        }
        _this.$forceUpdate();
        // 还原更改
        for (var i = 0;i < restoreArray.length;i++) {
          restoreArray[0].style.display = 'none';
        }
      };
      calWidth();
      var myTime = null;
      window.onresize = function resizeWindow() {
        if (myTime) {clearTimeout(myTime);}
        myTime = setTimeout(function() {
          calWidth();
        }, 100);
      };

    }

  },
  created() {
    var renderXtemplate = function() {
      if (this.buttons) {
        // 如果配置了按钮，兼容之前的配置
        var tmplate = '<div class="yu-search">\
            <h2 v-if="title">{{title}}</h2>\
              <el-form :model="fm" :rules="rules" :inline="inline" :showMessage="showMessage" :size="size" :columns="columns" defaultQueryField>\
              <el-row :gutter="10">\
              <el-col :span="span" v-for="(i,idx) in _fd" v-show="i.hidden!== true" :key="idx">\
              <el-form-item :prop="i.field" :label="i.label">\
              <el-input :ref="i.field" v-if="i.type==\'input\'||i.type==\'password\'||i.type==\'textarea\'" \
              v-model="fm[i.field]" :placeholder="i.placeholder" :icon="i.icon" :type="i.type"\
              :maxlength="i.maxlength" :minlength="i.minlength" :disabled="i.disabled" :max="i.max" :min="i.min"\
              @focus="i.focus&&i.focus(fm[i.field],fm,arguments)"\
              @click="i.click&&i.click(fm[i.field],fm,arguments)" \
              @blur="i.blur&&i.blur(fm[i.field],fm,arguments)"\
              @change="i.change&&i.change(fm[i.field],fm,arguments)">\
              </el-input>\
              <el-input v-else-if="i.type==\'num\'" :type="i.type" :disabled="i.disabled" :formatter="i.formatter" :digit="i.digit"\
              v-model.number="fm[i.field]" :placeholder="i.placeholder" :icon="i.icon"\
              :maxlength="i.maxlength" :minlength="i.minlength" :max="i.max" :min="i.min"\
              @focus="i.focus&&i.focus(fm[i.field],fm,arguments)"\
              @click="i.click&&i.click(fm[i.field],fm,arguments)" \
              @blur="i.blur&&i.blur(fm[i.field],fm,arguments)"\
              @change="i.change&&i.change(fm[i.field],fm,arguments)">\
              </el-input>\
              <el-select-x :ref="i.field" v-else-if="i.type==\'select\'" :disabled="i.disabled" :multiple="i.multiple" :placeholder="i.placeholder" v-model="fm[i.field]" :options="i.options" :props="i.props" :data-url="i.dataUrl" :clearable="i.clearable" :request-type="i.requestType" :data-params="i.dataParams" \
              :data-code="i.dataCode" :filterable="i.filterable" :filter-method="i.filterMethod" :datacode-filter="i.datacodeFilter"\
              @change="i.change&&i.change(fm[i.field],fm,arguments)">\
              </el-select-x>\
              <el-radio-x :ref="i.field" v-else-if="i.type==\'radio\'" v-model="fm[i.field]" :data-url="i.dataUrl" :disabled="i.disabled"\
              :option-button="i.optionButton" @change="i.change&&i.change(fm[i.field],fm,arguments)"></el-radio-x>\
              <el-checkbox-x :ref="i.field" v-else-if="i.type==\'checkbox\'" v-model="fm[i.field]" :data-url="i.dataUrl" :min=i.min :max=i.max \
              :option-button="i.optionButton" :disabled="i.disabled"\
              @change="i.change&&i.change(fm[i.field],fm,arguments)">\
              </el-checkbox-x>\
              <el-date-picker :ref="i.field" v-else-if="i.type==\'date\'||i.type==\'week\'||i.type==\'year\'||i.type==\'month\'||i.type==\'datetime\'||i.type==\'datetimerange\'||i.type==\'daterange\'" \
              v-model="fm[i.field]" :type="i.type" :disabled="i.disabled" :placeholder="i.placeholder" :size="i.size" :format="i.format"\
              :clearable="i.clearable" :range-separator="i.rangeSeparator" :picker-options="i.pickerOptions"\
              @change="i.change&&i.change(fm[i.field],fm,arguments)"></el-date-picker>\
              <el-time-select :ref="i.field" v-else-if="i.type==\'time\'" :disabled="i.disabled" v-model="fm[i.field]" :isRange="i.isRange" :placeholder="i.placeholder" :size="i.size" :format="i.format"\
              ::clearable="i.clearable"  :range-separator="i.rangeSeparator" :picker-options="i.pickerOptions"\
              @change="i.change&&i.change(fm[i.field],fm,arguments)"></el-time-select>\
              <el-time-picker :ref="i.field" v-else-if="i.type==\'timePicker\'" :disabled="i.disabled" v-model="fm[i.field]" :isRange="i.isRange" :placeholder="i.placeholder" :size="i.size" :format="i.format"\
              :clearable="i.clearable" :range-separator="i.rangeSeparator" :picker-options="i.pickerOptions"\
              @change="i.change&&i.change(fm[i.field],fm,arguments)"></el-time-picker>\
              <component :ref="i.ref||i.field" v-else-if="i.type==\'custom\'"\
              v-model="fm[i.field]" :params="i.params" :placeholder="i.placeholder"\
              @click-fn="i.clickFn && i.clickFn(fm[i.field],fm,arguments)"\
              @change="i.change && i.change(fm[i.field],fm,arguments)"\
              :disabled="i.disabled" :readonly="i.readonly" :size="i.size" :raw-value="i.rawValue"\
              :is="i.is" @select-fn="i.selectFn&&i.selectFn(fm[i.field],fm,arguments)">\
              </component>\
              </el-form-item>\
              </el-col>\
              <el-col :span="span">\
              <el-form-item>\
              <el-button v-for="(i,idx)  in buttons" :key="idx" :type="i.type"  :plain="i.plain" :round="i.round" :icon="i.icon" \
              @click="(i.click||i.op==\'reset\')&&click(i.click,i.op)" >{{i.label}}</el-button>\
              </el-form-item>\
              </el-col>\
              </el-row>\
              </el-form>\
              </div>';
        return tmplate;
      } else {
        // var queryButtons = this.consButtons;
        var forceColumn = this.forceColumn;
        var fieldData = this.fieldData;
        var moreData = this.moreData;
        var columns = this.columns;// 控制列排版
        // var thrift = this.thrift;// 节俭显示，不显示中文只显示图标
        var count = (fieldData.length + 1) % columns;
        count = count === 0 ? 0 : columns - count;
        tmplate = '<div class="yu-search">\
              <h2 v-if="title">{{title}}</h2>\
              <el-form :model="fm" :rules="rules" :inline="inline" :showMessage="showMessage" :size="size" :columns="columns" defaultQueryField>\
              <el-row :gutter="10">\
              <el-col :span="span" v-for="(i,idx) in _fd" :key="idx" v-show="i.hidden!== true">\
              <el-form-item :prop="i.field" :label="i.label">\
              <el-input :ref="i.field" v-if="i.type==\'input\'||i.type==\'password\'||i.type==\'textarea\'" :disabled="i.disabled"\
              v-model="fm[i.field]" :placeholder="i.placeholder" :icon="i.icon" :type="i.type"\
              :maxlength="i.maxlength" :minlength="i.minlength" :max="i.max" :min="i.min"\
              @focus="i.focus&&i.focus(fm[i.field],fm,arguments)"\
              @click="i.click&&i.click(fm[i.field],fm,arguments)" \
              @blur="i.blur&&i.blur(fm[i.field],fm,arguments)"\
              @change="i.change&&i.change(fm[i.field],fm,arguments)">\
              </el-input>\
              <el-input v-else-if="i.type==\'num\'" :type="i.type" :formatter="i.formatter" :digit="i.digit" :disabled="i.disabled"\
              v-model.number="fm[i.field]" :placeholder="i.placeholder" :icon="i.icon"\
              :maxlength="i.maxlength" :minlength="i.minlength" :max="i.max" :min="i.min"\
              @focus="i.focus&&i.focus(fm[i.field],fm,arguments)"\
              @click="i.click&&i.click(fm[i.field],fm,arguments)" \
              @blur="i.blur&&i.blur(fm[i.field],fm,arguments)"\
              @change="i.change&&i.change(fm[i.field],fm,arguments)">\
              </el-input>\
              <el-select-x :ref="i.field" v-else-if="i.type==\'select\'" :disabled="i.disabled" :multiple="i.multiple" :placeholder="i.placeholder" v-model="fm[i.field]" :options="i.options" :props="i.props" :data-url="i.dataUrl"\
              :data-code="i.dataCode" :request-type="i.requestType" :data-params="i.dataParams" :clearable="i.clearable"\
              @change="i.change&&i.change(fm[i.field],fm,arguments)" :filterable="i.filterable" :filter-method="i.filterMethod" :datacode-filter="i.datacodeFilter">\
              </el-select-x>\
              <el-radio-x :ref="i.field" v-else-if="i.type==\'radio\'" v-model="fm[i.field]" :data-url="i.dataUrl" :disabled="i.disabled"\
              :option-button="i.optionButton" @change="i.change&&i.change(fm[i.field],fm,arguments)"></el-radio-x>\
              <el-checkbox-x :ref="i.field" v-else-if="i.type==\'checkbox\'" v-model="fm[i.field]" :data-url="i.dataUrl" :min=i.min :max=i.max \
              :option-button="i.optionButton" :disabled="i.disabled"\
              @change="i.change&&i.change(fm[i.field],fm,arguments)">\
              </el-checkbox-x>\
              <el-date-picker :ref="i.field" v-else-if="i.type==\'date\'||i.type==\'week\'||i.type==\'year\'||i.type==\'month\'||i.type==\'datetime\'||i.type==\'datetimerange\'||i.type==\'daterange\'" \
              v-model="fm[i.field]" :type="i.type" :disabled="i.disabled" :placeholder="i.placeholder" :size="i.size" :format="i.format"\
              :clearable="i.clearable" :range-separator="i.rangeSeparator" :picker-options="i.pickerOptions"\
              @change="i.change&&i.change(fm[i.field],fm,arguments)"></el-date-picker>\
              <el-time-select :ref="i.field" v-else-if="i.type==\'time\'" v-model="fm[i.field]" :isRange="i.isRange" :disabled="i.disabled" :placeholder="i.placeholder" :size="i.size" :format="i.format"\
              ::clearable="i.clearable"  :range-separator="i.rangeSeparator" :picker-options="i.pickerOptions"\
              @change="i.change&&i.change(fm[i.field],fm,arguments)"></el-time-select>\
              <el-time-picker :ref="i.field" v-else-if="i.type==\'timePicker\'" v-model="fm[i.field]" :isRange="i.isRange" :disabled="i.disabled" :placeholder="i.placeholder" :size="i.size" :format="i.format"\
              :clearable="i.clearable" :range-separator="i.rangeSeparator" :picker-options="i.pickerOptions"\
              @change="i.change&&i.change(fm[i.field],fm,arguments)"></el-time-picker>\
              <component :ref="i.ref||i.field" v-else-if="i.type==\'custom\'"\
              v-model="fm[i.field]" :params="i.params"\
              @click-fn="i.clickFn && i.clickFn(fm[i.field],fm,arguments)"\
              @change="i.change && i.change(fm[i.field],fm,arguments)"\
              :disabled="i.disabled" :readonly="i.readonly" :size="i.size" :raw-value="i.rawValue"\
              :is="i.is" @select-fn="i.selectFn&&i.selectFn(fm[i.field],fm,arguments)">\
              </component>\
              </el-form-item>\
              </el-col>';
        var fillHtml = '';
        if (!forceColumn) {
          // 不强制紧随其后
          for (var i = 0; i < count; i++) {
            fillHtml += '<el-col :span="span" >\
                            <el-form-item>\
                            </el-form-item>\
                          </el-col>';
          }
        }
        tmplate += fillHtml;
        tmplate += '<el-col :span="span" :class="fitButton" v-show="!(showSearch)" >\
                    <el-form-item>\
                    <el-button v-for="(i,idx)  in consButtons" v-if="i.show" :key="idx" :type="i.type"  :plain="i.plain" :round="i.round" :icon="i.icon" \
                    @click="(i.click||i.op==\'reset\'||i.op==\'switch\')&&click(i.click,i.op)" ><b v-show="!_thrift">{{i.label}}</b><b v-show="_thrift"></b></el-button>\
                    </el-form-item>\
                    </el-col>\
                    </el-row>';
        if (moreData) {
          var sCount = (moreData.length + 1) % columns;
          sCount = sCount === 0 ? 0 : columns - sCount;
          var moreSearch = '<transition name="el-zoom-in-top"><el-row :gutter="10" v-show="showSearch" :class="moreSearchClass">\
                          <el-col :span="span" v-for="(j,idx) in moreData" :key="idx" v-show="i.hidden!== true">\
                          <el-form-item :prop="j.field" :label="j.label">\
                            <el-input :ref="j.field" v-if="j.type==\'input\'||j.type==\'password\'||j.type==\'textarea\'" :disabled="j.disabled" \
                            v-model="fm[j.field]" :placeholder="j.placeholder" :icon="j.icon" :type="j.type"\
                            :maxlength="j.maxlength" :minlength="j.minlength" :max="j.max" :min="j.min"\
                            @focus="j.focus&&j.focus(fm[j.field],fm,arguments)"\
                            @click="j.click&&j.click(fm[j.field],fm,arguments)" \
                            @blur="j.blur&&j.blur(fm[j.field],fm,arguments)"\
                            @change="j.change&&j.change(fm[j.field],fm,arguments)">\
                            </el-input>\
                            <el-input v-else-if="j.type==\'num\'" :type="j.type" :formatter="j.formatter" :digit="j.digit" :disabled="j.disabled"\
                            v-model.number="fm[j.field]" :placeholder="j.placeholder" :icon="j.icon"\
                            :maxlength="j.maxlength" :minlength="j.minlength" :max="j.max" :min="j.min"\
                            @focus="j.focus&&j.focus(fm[j.field],fm,arguments)"\
                            @click="j.click&&i.click(fm[j.field],fm,arguments)" \
                            @blur="j.blur&&j.blur(fm[j.field],fm,arguments)"\
                            @change="j.change&&j.change(fm[j.field],fm,arguments)">\
                            </el-input>\
                            <el-select-x :ref="j.field" v-else-if="j.type==\'select\'" :disabled="j.disabled" :multiple="i.multiple" :placeholder="j.placeholder" v-model="fm[j.field]" :options="j.options" :props="j.props" :data-url="j.dataUrl"\
                            :data-code="j.dataCode" :filterable="j.filterable" :filter-method="j.filterMethod" :datacode-filter="j.datacodeFilter"\
                            @change="j.change&&j.change(fm[j.field],fm,arguments)">\
                            </el-select-x>\
                            <el-radio-x :ref="j.field" v-else-if="j.type==\'radio\'" v-model="fm[j.field]" :data-url="j.dataUrl" :disabled="j.disabled"\
                            :option-button="i.optionButton" @change="j.change&&j.change(fm[j.field],fm,arguments)"></el-radio-x>\
                            <el-checkbox-x :ref="j.field" v-else-if="j.type==\'checkbox\'" v-model="fm[j.field]" :data-url="j.dataUrl" :min=j.min :max=j.max \
                            :option-button="i.optionButton" :disabled="j.disabled"\
                            @change="j.change&&j.change(fm[j.field],fm,arguments)">\
                            </el-checkbox-x>\
                            <el-date-picker :ref="j.field" v-else-if="j.type==\'date\'||j.type==\'week\'||j.type==\'year\'||j.type==\'month\'||j.type==\'datetime\'||j.type==\'datetimerange\'||j.type==\'daterange\'" \
                            v-model="fm[j.field]" :type="j.type" :disabled="j.disabled" :placeholder="j.placeholder" :size="j.size" :format="j.format"\
                            :clearable="j.clearable" :range-separator="j.rangeSeparator" :picker-options="j.pickerOptions"\
                            @change="j.change&&j.change(fm[j.field],fm,arguments)"></el-date-picker>\
                            <el-time-select :ref="j.field" v-else-if="j.type==\'time\'" :disabled="j.disabled" v-model="fm[j.field]" :isRange="j.isRange" :placeholder="j.placeholder" :size="j.size" :format="j.format"\
                            ::clearable="j.clearable"  :range-separator="j.rangeSeparator" :picker-options="j.pickerOptions"\
                            @change="j.change&&j.change(fm[j.field],fm,arguments)"></el-time-select>\
                            <el-time-picker :ref="j.field" v-else-if="j.type==\'timePicker\'" v-model="fm[j.field]" :disabled="j.disabled" :isRange="j.isRange" :placeholder="j.placeholder" :size="j.size" :format="j.format"\
                            :clearable="j.clearable" :range-separator="j.rangeSeparator" :picker-options="j.pickerOptions"\
                            @change="j.change&&j.change(fm[j.field],fm,arguments)"></el-time-picker>\
                            <component :ref="j.ref||j.field" v-else-if="j.type==\'custom\'"\
                            v-model="fm[j.field]" :params="j.params"\
                            @click-fn="j.clickFn && j.clickFn(fm[j.field],fm,arguments)"\
                            @change="i.change && i.change(fm[i.field],fm,arguments)"\
                            :disabled="j.disabled" :readonly="j.readonly" :size="j.size" :raw-value="j.rawValue"\
                            :is="j.is" @select-fn="j.selectFn&&j.selectFn(fm[j.field],fm,arguments)">\
                            </component>\
                          </el-form-item>\
                        </el-col>';
          var searchFill = '';
          if (!forceColumn) {
            // 不强制紧随其后
            for (var ii = 0; ii < sCount; ii++) {
              searchFill += '<el-col :span="span" >\
                              <el-form-item>\
                              </el-form-item>\
                              </el-col>';
            }
          }
          moreSearch += searchFill;
          moreSearch += '<el-col :span="span" :class="fitButton" >' +
            '<el-form-item>' +
            '<el-button v-for="(i,idx)  in consButtons" v-if="i.show" :key="idx" :type="i.type"  :plain="i.plain" :round="i.round" :icon="i.icon" \
                                      @click="(i.click||i.op==\'reset\'||i.op==\'switch\')&&click(i.click,i.op)" ><b v-show="!_thrift">{{i.label}}</b><b v-show="_thrift"></b></el-button>\
                          </el-form-item>\
                          </el-col>\
                          </el-row>\
                        </transition>';
          tmplate += moreSearch;
        }

        tmplate += ' </el-form></div>';

        return tmplate;
      }

    };
    this.$options.template = renderXtemplate.call(this);
    this.preTreat();
  },
  watch: {
    fieldData: function(val) {
      this.rebuildFn();
    }
  }
};
// </script>




// WEBPACK FOOTER //
// ./packages/form-q/src/form-q.js