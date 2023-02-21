import { Router } from "express";
const router = Router();

router.get("/register", (req, res) => {
  return res.render("register", {});
});

router.get("/login", (req, res) => {
  return res.render("login", {});
});

/* router.get("/profile", (req, res) => {
  const isLogin = req.session.user ? true : false;
  return isLogin ? res.render("profile", {}) : res.redirect("/session/login");
}); */

export default router;
