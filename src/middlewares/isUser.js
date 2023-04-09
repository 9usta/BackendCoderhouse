import passport from "passport";

export const isUser = (req, res, next) => {
  passport.authenticate("jwt", function (error, user, info) {
    req.user = user;
  })(req, res, next);
  if (req.user.rol === "user") return next();
  return res.send({ status: "error", error: "User rol required" });
};
