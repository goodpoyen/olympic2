<template>
  <div>
    <v-navigation-drawer absolute permanent v-model="drawer">
      <v-list>
        <v-list-item
          :prepend-avatar="logoPath"
          :subtitle="systemWord + olympicMsg"
          :title="olympicTitle"
        >
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list :lines="false" nav>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :value="item"
          color="primary"
          @click="iconClick(item.text)"
        >
          <template v-slot:prepend>
            <v-icon :icon="item.icon"></v-icon>
          </template>
          <v-list-item-title>
            {{ systemWord }}{{ item.text }}</v-list-item-title
          >
          <v-list-group
            v-if="item.text == '系統管理'"
            style="margin-left: -17px"
            :value="true"
          >
            <template v-slot:prependIcon>
              <v-icon
                v-text="item.icon"
                :style="{ color: groupColor }"
              ></v-icon>
            </template>
            <template v-slot:activator>
              <v-list-item-title
                style="
                  font-size: 15px;
                  font-weight: bold;
                  color: black;
                  width: 100px;
                "
                >系統管理</v-list-item-title
              >
            </template>

            <v-list-item
              class="listItem"
              :style="{
                cursor: 'pointer',
                backgroundColor:
                  $store.state.title === item.title ? '#d6e3f0' : '',
              }"
              v-for="(item, index) in sysSetingGroup"
              :key="index"
              @click="groupClick(item)"
            >
              <div v-if="item.title == '成績單設定'">
                <!-- <v-list-item-icon>
                  <v-icon
                    dense
                    v-text="item.icon"
                    :style="{ color: groupScroeColor, marginLeft: '50px' }"
                  ></v-icon>
                </v-list-item-icon> -->
                <v-list-item-title
                  v-text="item.title"
                  style="font-size: 13px; font-weight: bold; display: inline"
                ></v-list-item-title>
              </div>
              <!-- <div v-if="item.title == '專案設定'">
                <v-list-item-icon>
                  <v-icon
                    dense
                    v-text="item.icon"
                    :style="{ color: groupProjectColor, marginLeft: '50px' }"
                  ></v-icon>
                </v-list-item-icon>
                <v-list-item-title
                  v-text="item.title"
                  style="font-size: 13px; font-weight: bold; display: inline"
                ></v-list-item-title>
              </div>-->
            </v-list-item>
          </v-list-group>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar dark :color="systemColor" dense>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title style="font-size: 17px; font-weight: bold">
        {{ systemWord }}{{ titleName }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="logout">
        <v-icon>mdi-export</v-icon>
      </v-btn>
    </v-app-bar>
    <router-view> </router-view>
  </div>
</template>
<style>
.listItem:hover {
  background-color: #d6e3f0;
}
</style>
<script>
export default {
  data: () => ({
    sysSetingGroup: [
      {
        title: "成績單設定",
        icon: "mdi-license",
      },
      // {
      //   title: "專案設定",
      //   icon: "mdi-sign-text",
      // }
    ],
    olympicTitle: "",
    olympicMsg: "",
    logoPath: "",
    selectedItem: 0,
    levelStatus: false,
    items: [],
    datetime: new Date(),
    systemColor: "",
    systemWord: "",
    accountColor: "gray",
    olympicColor: "gray",
    scienceColor: "gray",
    schoolUserColor: "gray",
    groupColor: "gray",
    groupScroeColor: "gray",
    groupProjectColor: "gray",
    groupUploadColor: "gray",
    accountBackgroundColor: "",
    olympicBackgroundColor: "",
    scienceBackgroundColor: "",
    schoolUserBackgroundColor: "",
    drawer: true,
    groupSelect: "",
  }),

  computed: {
    titleName() {
      if (
        (this.globalSystemValue.level === "1" ||
          this.globalSystemValue.level === "3" ||
          this.globalSystemValue.level === "4") &&
        this.globalSystemValue.system === "science"
      ) {
        if (this.$route.path === "/manage/optionMenu") {
          this.$store.dispatch("title", "甄選管理");
        }
      } else {
        if (this.$route.path === "/manage/optionMenu") {
          this.$store.dispatch("title", "選拔管理");
        }
      }
      return this.$store.state.title;
    },
  },

  methods: {
    logout() {
      this.globalSystemTool.removeLocalStorage(this.globalSystemValue.system);
    },

    groupClick(item) {
      this.groupColor = "blue";
      if (item.title === "成績單設定") {
        location.href = "/manage/defaultscore/0";
      }
      if (item.title === "專案設定") {
        location.href = "/manage/setting";
      }
    },

    iconClick(title) {
      if (title === "帳號管理") {
        this.accountColor = "blue";
        location.href = "/manage/account";
      } else if (title === "選拔管理") {
        location.href = "/manage/optionMenu";
      } else if (title === "甄選管理") {
        location.href = "/manage/optionMenu";
      } else if (title === "聯絡人管理") {
        location.href = "/manage/schoolUser";
      }
    },
  },

  async mounted() {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.getElementsByTagName("head")[0].appendChild(link);
    }

    if (this.globalSystemValue.system === "science") {
      document.title = "高級中等學校科學班";
      link.href = "/images/scienceFav.png";
    } else {
      document.title = "臺灣奧林匹亞";
      link.href = "/images/fav.png";
    }

    if (this.globalSystemValue.level === "1") {
      if (this.globalSystemValue.system === "olympic") {
        this.items = [
          {
            text: "帳號管理",
            icon: "mdi-shield-account-outline",
          },
          {
            text: "選拔管理",
            icon: "mdi-calendar-text-outline",
          },
          {
            text: "聯絡人管理",
            icon: "mdi-briefcase-account-outline",
          },
        ];
      } else {
        this.items = [
          {
            text: "帳號管理",
            icon: "mdi-shield-account-outline",
          },
          {
            text: "甄選管理",
            icon: "mdi-calendar-text-outline",
          },
          { text: "系統管理", icon: "mdi-cog-outline" },
        ];
      }
    } else if (
      this.globalSystemValue.level === "2" ||
      (this.globalSystemValue.level === "99" &&
        this.globalSystemValue.system === "olympic")
    ) {
      this.items = [
        {
          text: "選拔管理",
          icon: "mdi-calendar-text-outline",
        },
        {
          text: "聯絡人管理",
          icon: "mdi-briefcase-account-outline",
        },
      ];
    } else if (this.globalSystemValue.level === "3") {
      this.items = [
        {
          text: "帳號管理",
          icon: "mdi-shield-account-outline",
        },
        {
          text: "甄選管理",
          icon: "mdi-calendar-text-outline",
        },
        { text: "系統管理", icon: "mdi-cog-outline" },
      ];
    } else if (
      this.globalSystemValue.level === "4" ||
      (this.globalSystemValue.level === "99" &&
        this.globalSystemValue.system === "science")
    ) {
      this.items = [
        {
          text: "甄選管理",
          icon: "mdi-calendar-text-outline",
        },
        { text: "系統管理", icon: "mdi-cog-outline" },
      ];
    }

    if (window.location.pathname === "/manage/account") {
      this.selectedItem = 0;
    } else if (window.location.pathname === "/manage/optionMenu") {
      if (
        this.globalSystemValue.level === "1" ||
        this.globalSystemValue.level === "3"
      ) {
        this.selectedItem = 1;
      } else {
        this.selectedItem = 0;
      }
    } else if (window.location.pathname === "/manage/schoolUser") {
      if (
        this.globalSystemValue.level === "1" ||
        this.globalSystemValue.level === "3"
      ) {
        this.selectedItem = 2;
      } else {
        this.selectedItem = 1;
      }
    } else if (window.location.pathname === "/manage/upload") {
      if (
        this.globalSystemValue.level === "1" ||
        this.globalSystemValue.level === "3"
      ) {
        this.selectedItem = 3;
      } else {
        this.selectedItem = 2;
      }
    } else if (window.location.pathname === "/manage/setting") {
      if (
        this.globalSystemValue.level === "1" ||
        this.globalSystemValue.level === "3"
      ) {
        this.selectedItem = 4;
      } else {
        this.selectedItem = 3;
      }
    } else if (window.location.pathname.includes("manage/optionExam/")) {
      if (
        this.globalSystemValue.level === "1" ||
        this.globalSystemValue.level === "3"
      ) {
        this.selectedItem = 1;
      } else {
        this.selectedItem = 0;
      }
    } else if (window.location.pathname.includes("manage/optionOnlineExam/")) {
      if (
        this.globalSystemValue.level === "1" ||
        this.globalSystemValue.level === "3"
      ) {
        this.selectedItem = 1;
      } else {
        this.selectedItem = 0;
      }
    } else if (window.location.pathname.includes("manage/optionScienceExam/")) {
      if (
        this.globalSystemValue.level === "1" ||
        this.globalSystemValue.level === "3"
      ) {
        this.selectedItem = 1;
      } else {
        this.selectedItem = 0;
      }
    }

    this.olympicTitle = await this.globalSystemTool.changeTitleData(
      this.globalSystemValue.olympic,
    );
    this.logoPath = this.globalSystemTool.getSysLogo(
      this.globalSystemValue.olympic,
    );

    this.olympicMsg = await this.globalSystemTool.changeSubtitleMsg(
      this.globalSystemValue.level,
    );
    await this.tokenService.renewLT();

    if (this.$store.state.title === "帳號管理") {
      this.accountColor = "blue";
      this.accountBackgroundColor = "#d6e3f0";
    } else if (this.$store.state.title === "選拔管理") {
      this.olympicColor = "blue";
      this.olympicBackgroundColor = "#d6e3f0";
    } else if (this.$store.state.title === "甄選管理") {
      this.scienceColor = "blue";
      this.scienceBackgroundColor = "#d6e3f0";
    } else if (this.$store.state.title === "聯絡人管理") {
      this.schoolUserColor = "blue";
      this.schoolUserBackgroundColor = "#d6e3f0";
    } else if (this.$store.state.title === "成績單設定") {
      this.groupColor = "blue";
      this.groupScroeColor = "blue";
    } else if (this.$store.state.title === "專案設定") {
      this.groupColor = "blue";
      this.groupProjectColor = "blue";
    }

    if (this.systemENV.MOD === "prod" || this.systemENV.MOD === "dev") {
      this.systemColor = "#0046FE";
      this.systemWord = "";
    } else if (this.systemENV.MOD === "sit") {
      this.systemColor = "#1EB2D5";
      this.systemWord = "(測試)_";
    }
  },
};
</script>
