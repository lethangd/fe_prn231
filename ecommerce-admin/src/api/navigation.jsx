import * as Icons from "react-icons/tb";

// Navigation Items
const navigation = (() => {
  const role = localStorage.getItem("userRole");
  if (role === "sale") {
    return [
      {
        name: "Dashboard",
        url: "/",
        icon: <Icons.TbLayout className="menu_icon" />,
      },
      {
        name: "Orders",
        url: "/orders/manage",
        icon: <Icons.TbChecklist className="menu_icon" />,
      },
    ];
  }
  return [
    // Dashboard
    {
      name: "Dashboard",
      url: "/",
      icon: <Icons.TbLayout className="menu_icon" />,
    },
    // Catalog
    {
      name: "Catalog",
      icon: <Icons.TbBuildingWarehouse className="menu_icon" />,
      url: "/catalog",
      subMenu: [
        // Products
        {
          name: "Products",
          url: "/product/manage",
          icon: <Icons.TbGardenCart className="menu_icon" />,
        },
        {
          name: "add Product",
          url: "/product/add",
          icon: <Icons.TbCirclePlus className="menu_icon" />,
        },
        // Categories
        {
          name: "Categories",
          url: "/categories/manage",
          icon: <Icons.TbCategory className="menu_icon" />,
        },
      ],
    },
    // Orders
    {
      name: "Orders",
      url: "/orders",
      icon: <Icons.TbChecklist className="menu_icon" />,
      subMenu: [
        {
          name: "Manage Order",
          url: "/manage",
          icon: <Icons.TbList className="menu_icon" />,
        },
      ],
    },
    // Customers
    {
      name: "Customers",
      url: "/customers",
      icon: <Icons.TbUsers className="menu_icon" />,
      subMenu: [
        {
          name: "Manage Customers",
          url: "/manage",
          icon: <Icons.TbList className="menu_icon" />,
        },
        {
          name: "add Customers",
          url: "/add",
          icon: <Icons.TbCirclePlus className="menu_icon" />,
        },
      ],
    },
    // Reviews
    {
      name: "Reviews",
      url: "/reviews",
      icon: <Icons.TbStar className="menu_icon" />,
    },
  ];
})();

export default navigation;
