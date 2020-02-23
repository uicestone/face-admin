import DashboardLayout from "../components/Dashboard/Layout/DashboardLayout.vue";
// GeneralViews
import NotFound from "../components/GeneralViews/NotFoundPage.vue";
// Dashboard pages
const Overview = () =>
  import(
    /* webpackChunkName: "widgets" */ "src/components/Dashboard/Views/Dashboard/Overview.vue"
  );
const Widgets = () =>
  import(
    /* webpackChunkName: "widgets" */ "src/components/Dashboard/Views/Dashboard/Widgets.vue"
  );

// Pages
import User from "src/components/Dashboard/Views/Pages/UserProfile.vue";
import TimeLine from "src/components/Dashboard/Views/Pages/TimeLinePage.vue";
import Login from "src/components/Dashboard/Views/Pages/Login.vue";
import Register from "src/components/Dashboard/Views/Pages/Register.vue";
import Lock from "src/components/Dashboard/Views/Pages/Lock.vue";
import UserList from "src/components/Dashboard/Views/User/UserList.vue";
import PassRecordList from "src/components/Dashboard/Views/PassRecord/PassRecordList.vue";
import PassRecord from "src/components/Dashboard/Views/PassRecord/PassRecord.vue";
import ResidentList from "src/components/Dashboard/Views/Resident/ResidentList.vue";
import Resident from "src/components/Dashboard/Views/Resident/Resident.vue";
import CommunityList from "src/components/Dashboard/Views/Community/CommunityList.vue";
import Community from "src/components/Dashboard/Views/Community/Community.vue";

// Components pages
import Buttons from "src/components/Dashboard/Views/Components/Buttons.vue";
import GridSystem from "src/components/Dashboard/Views/Components/GridSystem.vue";
import Panels from "src/components/Dashboard/Views/Components/Panels.vue";
import SweetAlert from "src/components/Dashboard/Views/Components/SweetAlert.vue";
import Notifications from "src/components/Dashboard/Views/Components/Notifications.vue";
import Icons from "src/components/Dashboard/Views/Components/Icons.vue";
import Typography from "src/components/Dashboard/Views/Components/Typography.vue";

// Forms pages
const RegularForms = () =>
  import(
    /* webpackChunkName: "forms" */ "src/components/Dashboard/Views/Forms/RegularForms.vue"
  );
const ExtendedForms = () =>
  import(
    /* webpackChunkName: "forms" */ "src/components/Dashboard/Views/Forms/ExtendedForms.vue"
  );
const ValidationForms = () =>
  import(
    /* webpackChunkName: "forms" */ "src/components/Dashboard/Views/Forms/ValidationForms.vue"
  );
const Wizard = () =>
  import(
    /* webpackChunkName: "forms" */ "src/components/Dashboard/Views/Forms/Wizard.vue"
  );

// TableList pages
const RegularTables = () =>
  import(
    /* webpackChunkName: "tables" */ "src/components/Dashboard/Views/Tables/RegularTables.vue"
  );
const ExtendedTables = () =>
  import(
    /* webpackChunkName: "tables" */ "src/components/Dashboard/Views/Tables/ExtendedTables.vue"
  );
const PaginatedTables = () =>
  import(
    /* webpackChunkName: "tables" */ "src/components/Dashboard/Views/Tables/PaginatedTables.vue"
  );
// Maps pages
const GoogleMaps = () =>
  import(
    /* webpackChunkName: "maps" */ "src/components/Dashboard/Views/Maps/GoogleMaps.vue"
  );
const FullScreenMap = () =>
  import(
    /* webpackChunkName: "maps" */ "src/components/Dashboard/Views/Maps/FullScreenMap.vue"
  );
const VectorMaps = () =>
  import(
    /* webpackChunkName: "maps" */ "src/components/Dashboard/Views/Maps/VectorMapsPage.vue"
  );

// Calendar
import Calendar from "src/components/Dashboard/Views/Calendar/CalendarRoute.vue";
// Charts
const Charts = () =>
  import(
    /* webpackChunkName: "widgets" */ "src/components/Dashboard/Views/Charts.vue"
  );

let componentsMenu = {
  path: "/components",
  component: DashboardLayout,
  redirect: "/components/buttons",
  children: [
    {
      path: "buttons",
      name: "Buttons",
      component: Buttons
    },
    {
      path: "grid-system",
      name: "Grid System",
      component: GridSystem
    },
    {
      path: "panels",
      name: "Panels",
      component: Panels
    },
    {
      path: "sweet-alert",
      name: "Sweet Alert",
      component: SweetAlert
    },
    {
      path: "notifications",
      name: "Notifications",
      component: Notifications
    },
    {
      path: "icons",
      name: "Icons",
      component: Icons
    },
    {
      path: "typography",
      name: "Typography",
      component: Typography
    }
  ]
};
let formsMenu = {
  path: "/forms",
  component: DashboardLayout,
  redirect: "/forms/regular",
  children: [
    {
      path: "regular",
      name: "Regular Forms",
      component: RegularForms
    },
    {
      path: "extended",
      name: "Extended Forms",
      component: ExtendedForms
    },
    {
      path: "validation",
      name: "Validation Forms",
      component: ValidationForms
    },
    {
      path: "wizard",
      name: "Wizard",
      component: Wizard
    }
  ]
};

let tablesMenu = {
  path: "/table-list",
  component: DashboardLayout,
  redirect: "/table-list/regular",
  children: [
    {
      path: "regular",
      name: "Regular Tables",
      component: RegularTables
    },
    {
      path: "extended",
      name: "Extended Tables",
      component: ExtendedTables
    },
    {
      path: "paginated",
      name: "Paginated Tables",
      component: PaginatedTables
    }
  ]
};

let mapsMenu = {
  path: "/maps",
  component: DashboardLayout,
  redirect: "/maps/google",
  children: [
    {
      path: "google",
      name: "Google Maps",
      component: GoogleMaps
    },
    {
      path: "full-screen",
      name: "Full Screen Map",
      component: FullScreenMap
    },
    {
      path: "vector-map",
      name: "Vector Map",
      component: VectorMaps
    }
  ]
};

let pagesMenu = {
  path: "/pages",
  component: DashboardLayout,
  redirect: "/pages/user",
  children: [
    {
      path: "user",
      name: "User Page",
      component: User
    },
    {
      path: "timeline",
      name: "Timeline Page",
      component: TimeLine
    }
  ]
};

let passRecordMenu = {
  path: "/pass-record",
  component: DashboardLayout,
  redirect: "/pass-record/list",
  children: [
    {
      path: "list",
      name: "通行记录",
      component: PassRecordList,
      meta: {
        keepAlive: true
      }
    },
    {
      path: ":id",
      name: "通行记录详情",
      component: PassRecord
    }
  ]
};

let residentMenu = {
  path: "/resident",
  component: DashboardLayout,
  redirect: "/resident/list",
  children: [
    {
      path: "list",
      name: "所有居民",
      component: ResidentList,
      meta: {
        keepAlive: true
      }
    },
    {
      path: ":id",
      name: "居民详情",
      component: Resident
    }
  ]
};

let userMenu = {
  path: "/user",
  component: DashboardLayout,
  redirect: "/user/list",
  children: [
    {
      path: "list",
      name: "所有用户",
      component: UserList,
      meta: {
        keepAlive: true
      }
    },
    {
      path: ":id",
      name: "用户详情",
      component: User
    }
  ]
};

let communityMenu = {
  path: "/community",
  component: DashboardLayout,
  redirect: "/community/list",
  children: [
    {
      path: "list",
      name: "所有社区",
      component: CommunityList,
      meta: {
        keepAlive: true
      }
    },
    {
      path: ":id",
      name: "社区详情",
      component: Community
    }
  ]
};

let loginPage = {
  path: "/login",
  name: "Login",
  component: Login
};

let registerPage = {
  path: "/register",
  name: "Register",
  component: Register
};

let lockPage = {
  path: "/lock",
  name: "Lock",
  component: Lock
};

const routes = [
  {
    path: "/",
    component: DashboardLayout,
    redirect: "/admin/overview",
    children: [
      {
        path: "calendar",
        name: "Calendar",
        component: Calendar
      },
      {
        path: "charts",
        name: "Charts",
        component: Charts
      }
    ]
  },
  componentsMenu,
  formsMenu,
  tablesMenu,
  mapsMenu,
  pagesMenu,
  passRecordMenu,
  residentMenu,
  userMenu,
  communityMenu,
  loginPage,
  registerPage,
  lockPage,
  {
    path: "/admin",
    component: DashboardLayout,
    redirect: "/admin/overview",
    children: [
      {
        path: "overview",
        name: "数据统计（模拟）",
        component: Overview
      },
      {
        path: "widgets",
        name: "Widgets",
        component: Widgets
      }
    ]
  },
  { path: "*", component: NotFound }
];

export default routes;
