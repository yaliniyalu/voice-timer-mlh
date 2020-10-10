
import NotFoundPage from '../pages/404.vue';
import Stopwatch from "../pages/Stopwatch";
import Timer from "../pages/Timer";
import About from "../pages/About";

var routes = [
  {
    path: '/',
    component: Stopwatch,
  },
  {
    path: '/stopwatch/',
    component: Stopwatch,
  },
  {
    path: '/timer/',
    component: Timer,
  },
  {
    path: '/todo/',
    component: Stopwatch,
  },
  {
    path: '/about/',
    component: About,
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];

export default routes;
