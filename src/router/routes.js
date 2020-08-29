const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/Index.vue")
      },
      {
        path: "dashboard",
        component: () => import("pages/Dashboard.vue")
      },
      {
        path: "defectcollectioncard",
        component: () => import("pages/DefectCollectionCard.vue")
      },
      {
        path: "qualitycontrolchart",
        component: () => import("pages/QualityControlChart.vue")
      }
    ]
  }
];

// Always leave this as last one
/*
if (process.env.MODE !== "ssr") {
  routes.push({
    path: "*",
    component: () => import("pages/Error404.vue")
  });
}
*/

// Always leave this as last one
routes.push({
  path: "*",
  component: () => import("pages/Error404.vue")
});

export default routes;
