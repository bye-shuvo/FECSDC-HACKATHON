import { lazy } from "react";
import { createBrowserRouter } from "react-router";
import { RootLayout } from "../layouts/RootLayout.jsx";
import { HackathonLayout } from "../layouts/HackathonLayout.jsx";
import { RouteErrorElement } from "../components/layout/ErrorBoundary.jsx";

// Lazy-load all pages for optimal code splitting & lightning fast initial loads
const HomePage = lazy(() => import("../pages/HomePage.jsx"));
const OverviewPage = lazy(() => import("../pages/hackathon/OverviewPage.jsx"));
const RegisterPage = lazy(() => import("../pages/hackathon/RegisterPage.jsx"));
const AboutPage = lazy(() => import("../pages/hackathon/AboutPage.jsx"));
const SchedulePage = lazy(() => import("../pages/hackathon/SchedulePage.jsx"));
const RulesPage = lazy(() => import("../pages/hackathon/RulesPage.jsx"));
const PrizesPage = lazy(() => import("../pages/hackathon/PrizesPage.jsx"));
const FaqPage = lazy(() => import("../pages/hackathon/FaqPage.jsx"));
const SubmitPage = lazy(() => import("../pages/hackathon/SubmitPage.jsx"));
const ChallengesPage = lazy(() => import("../pages/ChallengesPage.jsx"));
const SponsorsPage = lazy(() => import("../pages/SponsorsPage.jsx"));
const ProblemStatementsPage = lazy(() => import("../pages/ProblemStatementsPage.jsx"));
const ProblemDetailPage = lazy(() => import("../pages/ProblemDetailPage.jsx"));
const ResultsPage = lazy(() => import("../pages/ResultsPage.jsx"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage.jsx"));

/**
 * Modular Route Configuration Array
 * Adding a new page = 1 page file + 1 route entry.
 */
export const routes = [
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <RouteErrorElement />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "hackathon",
        element: <HackathonLayout />,
        children: [
          {
            index: true,
            element: <OverviewPage />,
          },
          {
            path: "register",
            element: <RegisterPage />,
          },
          {
            path: "about",
            element: <AboutPage />,
          },
          {
            path: "schedule",
            element: <SchedulePage />,
          },
          {
            path: "rules",
            element: <RulesPage />,
          },
          {
            path: "prizes",
            element: <PrizesPage />,
          },
          {
            path: "faq",
            element: <FaqPage />,
          },
          {
            path: "submit",
            element: <SubmitPage />,
          },
        ],
      },
      {
        path: "challenges",
        element: <ChallengesPage />,
      },
      {
        path: "sponsors",
        element: <SponsorsPage />,
      },
      {
        path: "problem-statements",
        element: <ProblemStatementsPage />,
      },
      {
        path: "problem-statements/:id",
        element: <ProblemDetailPage />,
      },
      {
        path: "results",
        element: <ResultsPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
