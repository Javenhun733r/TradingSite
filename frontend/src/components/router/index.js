import { createRouter, createWebHistory } from "vue-router";
import MainPage from "@/components/Pages/MainPage.vue";
import SignUpPage from "@/components/Pages/SignUpPage.vue";
import LoginPage from "@/components/Pages/LoginPage.vue";
import ItemsPage from "@/components/Pages/ItemsPage.vue";
import ProfilePage from "@/components/Pages/ProfilePage.vue";
import ChatPage from "@/components/Pages/ChatPage.vue";
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
        },
        {
            path: '/profile',
            name: 'Profile',
            component: ProfilePage,
        },
        {
            path: '/chats',
            name: 'Chats',
            component: ChatPage
        }
    ],
});

export default router;