const coachOnly = (req, res, next) => {

  console.log("Coach Only user:", req.user);
  console.log("Coach Only role:", req.user?.role);

  
  if (!req.user) {
    return res.status(401).json({
      message: "Not authorized",
    });
  }

  if (req.user.role !== "coach") {
    return res.status(403).json({
      message: "Coach access only",
    });
  }

  next();
};

const clientOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Not authorized",
    });
  }

  if (req.user.role !== "client") {
    return res.status(403).json({
      message: "Client access only",
    });
  }

  next();
};

module.exports = {
  coachOnly,
  clientOnly,
};