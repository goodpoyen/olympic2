<template>
  <div>
    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item
          :prepend-avatar="logoPath"
          :subtitle="systemWord + olympicMsg"
          :title="olympicTitle"
        >
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list v-model:opened="open">
        <v-list-item
          v-for="(item, i) in items"
          v-show="
            (item.system === globalSystemValue.system &&
              item.level.includes(globalSystemValue.level)) ||
            (item.system === 'all' &&
              item.level.includes(globalSystemValue.level))
          "
          slim
          :key="i"
          :value="item"
          :prepend-icon="item.icon"
          :title="item.text"
          :href="item.url"
          :style="{
            backgroundColor: $store.state.title === item.text ? '#d6e3f0' : '',
          }"
        >
        </v-list-item>
        <v-list-group
          v-for="(item, i) in groupItems"
          v-show="
            (item.system === globalSystemValue.system &&
              item.level.includes(globalSystemValue.level)) ||
            (item.system === 'all' &&
              item.level.includes(globalSystemValue.level))
          "
          :key="i"
          :value="item"
          value="setting"
        >
          <template v-slot:activator="{ props }">
            <v-list-item
              slim
              v-bind="props"
              :prepend-icon="item.icon"
              :title="item.text"
            ></v-list-item>
          </template>
          <v-list-item
            v-for="(group, i) in item.subItem"
            v-show="
              (group.system === globalSystemValue.system &&
                group.level.includes(globalSystemValue.level)) ||
              (group.system === 'all' &&
                group.level.includes(globalSystemValue.level))
            "
            slim
            :key="i"
            :prepend-icon="group.icon"
            :title="group.text"
            :value="group.text"
            :href="group.url"
            :style="{
              backgroundColor:
                $store.state.title === item.subItem[0].text ? '#d6e3f0' : '',
              '--indent-padding': '20px',
            }"
          ></v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar dark :color="systemColor" dense>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title style="font-size: 17px; font-weight: bold">
        {{ systemWord }}{{ titleName }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" append-icon="mdi-cog" size="large"></v-btn>
        </template>

        <v-list>
          <v-list-item to="/manage/infoEditorP">
            <v-list-item-title
              ><v-icon icon="mdi-lastpass" class="me-2"></v-icon
              >修改密碼</v-list-item-title
            >
          </v-list-item>
          <v-list-item link>
            <v-list-item-title @click="logout">
              <v-icon icon="mdi-export" class="me-2"></v-icon>
              系統登出</v-list-item-title
            >
          </v-list-item>
        </v-list>
      </v-menu>
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
    olympicTitle: "",
    olympicMsg: "",
    logoPath: "",
    selectedItem: 0,
    levelStatus: false,
    items: [],
    groupItems: [],
    open: ["setting"],
    datetime: new Date(),
    systemColor: "",
    systemWord: "",
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
    async logout() {
      const data = {};
      data.t = localStorage.getItem("ret");

      await this.axios
        .post(this.systemENV.APISERVERURL + "/logOut", data)
        .then((response) => {
          // console.log(response.data);
        })
        .catch(function (error) {
          // console.log(error);
        });

      this.globalSystemTool.removeLocalStorage(this.globalSystemValue.system);
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

    this.items = [
      {
        text: "帳號管理",
        icon: "mdi-shield-account-outline",
        url: "/manage/account",
        system: "all",
        level: "1,3",
      },
      {
        text: "選拔管理",
        icon: "mdi-calendar-text-outline",
        url: "/manage/optionMenu",
        system: "olympic",
        level: "1,2",
      },
      {
        text: "甄選管理",
        icon: "mdi-calendar-text-outline",
        url: "/manage/optionMenu",
        system: "science",
        level: "1,3,4",
      },
      {
        text: "聯絡人管理",
        icon: "mdi-briefcase-account-outline",
        url: "/manage/schoolUser",
        system: "olympic",
        level: "1,2",
      },
    ];

    this.groupItems = [
      {
        text: "系統管理",
        icon: "mdi-cog-outline",
        system: "science",
        level: "1,2,3,4",
        subItem: [
          {
            text: "成績單設定",
            icon: "mdi-license",
            url: "/manage/defaultscore/0",
            system: "science",
            level: "1,3,4",
          },
          {
            text: "考生通知檔設定",
            icon: "mdi mdi-file-pdf-box",
            url: "/manage/setExamNoticeFile",
            system: "olympic",
            level: "1,2,3,4",
          },
        ],
      },
    ];

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
