import { Router } from "express";
const router = Router();

router.get("/register", (req, res) => {
  return res.render("register", {});
});

router.get("/login", (req, res) => {
  return res.render("login", {});
});


export default router;
