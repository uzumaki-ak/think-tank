import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import "./App.css";
import HomePage from "./pages/home/HomePage";
import ArticleDetailPage from "./pages/articleDetail/ArticleDetailPage";
import RegisterPage from "./pages/register/RegisterPage";
import LoginPage from "./pages/login/LoginPage";
import ProfilePage from "./pages/profile/ProfilePage";
import AdminLayout from "./pages/admin/AdminLayout";
import Admin from "./pages/admin/screens/Admin";
import Comments from "./pages/admin/screens/comments/Comments";
import ManagePosts from "./pages/admin/screens/posts/ManagePosts";
import EditPost from "./pages/admin/screens/posts/EditPost";
import Trash from "./pages/admin/screens/posts/Trash";
import Categories from "./pages/admin/screens/categories/Categories";
import EditCategories from "./pages/admin/screens/categories/EditCategories";
import Users from "./pages/admin/screens/users/Users";
import BlogPage from "./pages/blog/BlogPage";
import ApiKeySettings from "./pages/admin/screens/settings/ApiKeySettings";
import Briefing from "./pages/admin/screens/Briefing";
import Subscribers from "./pages/admin/screens/Subscribers";
import AboutPage from "./pages/about/AboutPage";
import ContactPage from "./pages/contact/ContactPage";
import BookmarksPage from "./pages/bookmarks/BookmarksPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <div className="App font-ops">
      <Routes>
        <Route index path="/" element={<HomePage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<ArticleDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* User Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
        </Route>

        {/* Admin Protected Routes */}
        <Route element={<ProtectedRoute adminOnly={true} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Admin />} />
            <Route path="comments" element={<Comments />} />
            <Route path="posts/manage" element={<ManagePosts />} />
            <Route path="posts/manage/edit/:slug" element={<EditPost />} />
            <Route path="posts/trash" element={<Trash />} />
            <Route path="categories/manage" element={<Categories />} />
            <Route
              path="categories/manage/edit/:slug"
              element={<EditCategories />}
            />
            <Route path="users/manage" element={<Users />} />
            <Route path="settings/api-key" element={<ApiKeySettings />} />
            <Route path="briefing" element={<Briefing />} />
            <Route path="subscribers" element={<Subscribers />} />
          </Route>
        </Route>
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
