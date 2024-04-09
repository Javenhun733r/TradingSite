import { createRouter, createWebHistory } from "vue-router";
import MainPage from "@/components/Pages/MainPage.vue";
import SignUpPage from "@/components/Pages/SignUpPage.vue";
import LoginPage from "@/components/Pages/LoginPage.vue";
import ItemsPage from "@/components/Pages/ItemsPage.vue";
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            name: "Guest page",
            component: MainPage,
        },
        {
            path: "/signup",
            name: "SignUp page",
            component: SignUpPage,
        },
        {
            path: "/login",
            name: "Login page",
            component: LoginPage,
        },
        {
            path: "/items",
            name: "Items page",
            component: ItemsPage,
        }
    ],
});

export default router;