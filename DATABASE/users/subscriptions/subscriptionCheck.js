const Subscription = require("./Subscription");
const Analytics = require("../analytics/Analytics");

const checkSubscription = async (req, res, next) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const subscription = await Subscription.findOne({ userId });
  const analytics = await Analytics.findOne({ userId });

  const videosGenerated = analytics?.videosGenerated || 0;
  const maxVideos = subscription?.limits?.maxVideosPerMonth || 5;

  if (subscription?.plan === "free" && videosGenerated >= maxVideos) {
    return res.status(403).json({
      success: false,
      message: "Free plan limit reached. Upgrade to continue."
    });
  }

  next();
};

module.exports = checkSubscription;
