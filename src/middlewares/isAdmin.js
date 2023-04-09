import passport from "passport";

export const isAdmin = (req, res, next) => {
  passport.authenticate("jwt", function (error, user, info) {
    req.user = user;
  })(req, res, next);
  if (req.user.rol === "admin") return next();
  return res.send({ status: "error", error: "Admin rol required" });
};
