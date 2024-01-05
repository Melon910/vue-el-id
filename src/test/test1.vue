<template>
  <div dl-t="7d707339" class="app-container user-container">
    <el-row
      dl-t="c0bcfc29"
      style="display: flex; justify-content: space-between"
    >
      <!--用户数据-->
      <div
        dl-t="e22aaadf"
        style="width: 200px; flex-grow: 1; transition: all 0.3 ease-in-out"
      >
        <TableSearchWrapper
          ref="tableSearchWrapperRef"
          :form="queryParams"
          :handleParams="handleParams"
          @search="handleSearch"
          @clear="handleClear"
        >
          <template #name>
            <el-form-item dl-t="d06457d9" :label="$t(`姓名`)" prop="name">
              <el-input
                dl-t="c50427a2"
                v-model="queryParams.name"
                :placeholder="$t(`请输入姓名`)"
                clearable
                maxlength="50"
                @keyup.enter="handleSearch"
              />
            </el-form-item>
          </template>
          <template #phoneNumber>
            <el-form-item
              dl-t="93ee3df0"
              :label="$t(`手机号码`)"
              prop="phoneNumber"
              :rules="{
                pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
                message: $t('请输入正确的手机号码'),
                trigger: 'blur',
              }"
            >
              <el-input
                dl-t="1cd570e4"
                v-model="queryParams.phoneNumber"
                :placeholder="$t(`请输入手机号码`)"
                clearable
                @keyup.enter="handleSearch"
              />
            </el-form-item>
          </template>
          <template #status>
            <el-form-item dl-t="e3d63943" :label="$t(`用户状态`)" prop="status">
              <el-select
                dl-t="70f25658"
                v-model="queryParams.status"
                :placeholder="$t(`用户状态`)"
              >
                <el-option
                  :dl-t="`99fc21e${index}`"
                  v-for="(dict, index) in tenant_status"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </template>
          <template #type>
            <el-form-item dl-t="10329a89" :label="$t(`类型`)" prop="type">
              <el-select
                dl-t="31e578e8"
                v-model="queryParams.type"
                :placeholder="$t(`选择用户类型`)"
              >
                <el-option dl-t="3101ac53" :label="$t(`全部`)" :value="'99'" />
                <el-option
                  dl-t="7dee40df"
                  :label="$t(`专属账号`)"
                  :value="'01'"
                />
                <el-option
                  dl-t="df3286d8"
                  :label="$t(`平台账号`)"
                  :value="'00'"
                />
              </el-select>
            </el-form-item>
          </template>
          <template #rank>
            <el-form-item dl-t="53a6f230" :label="$t(`级别`)" prop="rank">
              <el-select
                dl-t="a10f0080"
                v-model="queryParams.rank"
                :placeholder="$t(`请选择`)"
              >
                <el-option
                  :dl-t="`8a05dcb${index}`"
                  v-for="(dict, index) in rankList"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </template>
          <template #changeDate>
            <el-form-item dl-t="5ae706b1" :label="$t(`加入时间`)">
              <el-date-picker
                dl-t="42bcc983"
                v-model="queryParams.changeDate"
                @change="changeDepartDate"
                type="daterange"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD HH:mm:ss"
                :start-placeholder="$t(`开始时间`)"
                :end-placeholder="$t(`结束时间`)"
                label-width="auto"
                range-separator="-"
              />
            </el-form-item>
          </template>
          <template #bottom>
            <!-- 按钮功能区 -->
            <div dl-t="7bc271fe" style="display: inline-flex">
              <el-button
                dl-t="49e006cb"
                type="primary"
                icon="Plus"
                @click="handleAdd"
                v-hasPermi="['system:user:add']"
                >{{ $t("添加用户") }}</el-button
              >
              <!-- <el-button @click="handleImport" v-hasPermi="['system:user:import']">
                   <template #icon>
                      <svg-icon class-name="el-icon" icon-class="lca-import" />
                   </template>导入
                </el-button>
                   <el-button icon="Download" @click="handleExport" v-hasPermi="['system:user:export']">
                      <template #icon>
                         <svg-icon class-name="el-icon" icon-class="lca-export" />
                      </template>导出
                </el-button> -->
              <el-button
                dl-t="90e94cd5"
                :disabled="deleteAble"
                @click="handleDelete"
                v-hasPermi="['system:user:remove']"
              >
                <template #icon>
                  <svg-icon
                    dl-t="40b77b9a"
                    class-name="el-icon"
                    icon-class="lca-delete"
                  /> </template
                >{{ $t("删除") }}</el-button
              >
              <el-button dl-t="aa13b321" @click="inviteSomeone()">{{
                $t("邀请人员加入")
              }}</el-button>
              <el-badge
                dl-t="a3b07883"
                :is-dot="hasUnhandleInvite"
                class="badge"
                style="margin-left: 16px"
              >
                <el-button dl-t="84ac8778" @click="getInviteList()">{{
                  $t("申请列表")
                }}</el-button>
              </el-badge>
            </div>
          </template>
        </TableSearchWrapper>

        <el-table
          dl-t="c97f14b9"
          v-loading="loading"
          :data="userList"
          @selection-change="handleSelectionChange"
          table-layout="auto"
          :header-cell-style="setColorAsThem"
          row-class-name="setTableTrHeight"
          style="margin-top: 20px"
        >
          <el-table-column
            dl-t="a44afe44"
            type="selection"
            width="50"
            align="left"
          />
          <el-table-column
            dl-t="2245756b"
            :label="$t(`姓名`)"
            align="left"
            prop="nickName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            dl-t="894709e4"
            :label="$t(`类型`)"
            align="left"
            prop="userType"
          >
            <template #default="scope">
              <span
                dl-t="49ed8484"
                class="status-type-using"
                style="width: 64px"
                :class="
                  scope.row.userType == '01' ? 'formal-using' : 'temp-using'
                "
              >
                {{
                  scope.row.userType == "01" ? $t("专属账号") : $t("平台账号")
                }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            dl-t="5c609c5c"
            :label="$t(`级别`)"
            align="left"
            prop="userRank"
            width="80"
          >
            <template #default="scope">
              {{ scope.row.userRank == "2" ? $t("高级账号") : $t("普通账号") }}
            </template>
          </el-table-column>
          <el-table-column
            dl-t="a6072283"
            :label="$t(`部门`)"
            align="left"
            prop="deptName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            dl-t="cd322dcd"
            :label="$t(`岗位`)"
            align="left"
            prop="postNames"
            :show-overflow-tooltip="true"
          >
            <template #default="scope">
              <span
                :dl-t="`b4856ae${index}`"
                v-for="(item, index) in scope.row.postNames"
                :key="index"
              >
                {{ item }}
                <span
                  dl-t="c1a63fa4"
                  v-if="index < scope.row.postNames.length - 1"
                  >、</span
                >
              </span>
            </template>
          </el-table-column>
          <el-table-column
            dl-t="5fb91554"
            :label="$t(`角色`)"
            align="left"
            prop="roleNames"
            min-width="120"
            :show-overflow-tooltip="true"
          >
            <template #default="scope">
              <span
                :dl-t="`b99697e${index}`"
                v-for="(item, index) in scope.row.roleNames"
                :key="index"
              >
                {{ item }}
                <span
                  dl-t="c6ad552b"
                  v-if="index < scope.row.roleNames.length - 1"
                  >、</span
                >
              </span>
            </template>
          </el-table-column>
          <el-table-column
            dl-t="7b1b3e8c"
            :label="$t(`手机号码`)"
            align="left"
            prop="phonenumber"
            width="120"
          />
          <el-table-column dl-t="bfdf9972" :label="$t(`状态`)" align="left">
            <template #default="scope">
              <span
                dl-t="83e10ed0"
                class="status-type-using"
                :class="scope.row.status == '0' ? 'normal-using' : 'stop-using'"
              >
                {{ scope.row.status == "0" ? $t("正常") : $t("停用") }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            dl-t="1ede2014"
            :label="$t(`加入时间`)"
            align="left"
            prop="createTime"
            width="100"
          >
            <template #default="scope">
              <span dl-t="3ebffd35">{{
                formatDataToYMD2(scope.row.createTime)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            dl-t="8f554d6f"
            :label="$t(`操作`)"
            fixed="right"
            align="right"
            width="120"
          >
            <template #default="scope">
              <el-tooltip dl-t="c3b842bb" :content="$t(`编辑`)" placement="top">
                <el-button
                  dl-t="080f89e3"
                  class="btn"
                  link
                  @click="handleUpdate(scope.row)"
                  v-hasPermi="['system:user:edit']"
                >
                  <template #icon>
                    <svg-icon
                      dl-t="24211687"
                      class-name="el-icon"
                      icon-class="lca-edit"
                    />
                  </template>
                </el-button>
              </el-tooltip>
              <el-tooltip
                dl-t="281e9df9"
                :content="
                  scope.row.userId == userId
                    ? $t('无法停用自己的账号')
                    : scope.row.status == '0'
                      ? $t('停用')
                      : $t('启用')
                "
                placement="top"
              >
                <el-button dl-t="04542d25" link
                  ><el-button
                    dl-t="9df405c9"
                    class="btn"
                    link
                    @click="handleStatusChange(scope.row)"
                    :disabled="scope.row.userId == userId"
                  >
                    <template #icon>
                      <svg-icon
                        dl-t="e31b0524"
                        class-name="el-icon"
                        :icon-class="
                          scope.row.status == '0' ? 'stop-using' : 're-using'
                        "
                      />
                    </template> </el-button
                ></el-button>
              </el-tooltip>
              <el-tooltip
                dl-t="5f4b2251"
                :content="
                  scope.row.userId == userId
                    ? $t('无法删除自己的账号')
                    : $t('删除')
                "
                placement="top"
              >
                <el-button dl-t="c297e00c" link
                  ><el-button
                    dl-t="639ef76a"
                    class="btn"
                    link
                    v-hasPermi="['system:user:remove']"
                    @click="handleDelete(scope.row)"
                    :disabled="scope.row.userId == userId"
                  >
                    <template #icon>
                      <svg-icon
                        dl-t="04f9d000"
                        class-name="el-icon"
                        icon-class="lca-delete"
                      />
                    </template> </el-button
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          dl-t="e96a0fb3"
          v-show="total > 0"
          :total="total"
          v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize"
          @pagination="getList"
        />
      </div>
    </el-row>
  </div>
</template>
