const Subscription = require("../../DATABASE/users/subscriptions/Subscription");
const Analytics = require("../../DATABASE/users/analytics/Analytics");

const subscriptionCheck = async (req, res, next) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const [subscription, analytics] = await Promise.all([
    Subscription.findOne({ userId }),
    Analytics.findOne({ userId })
  ]);
  const videosGenerated = analytics?.videosGenerated || 0;
  const plan = subscription?.plan || "free";
  const maxVideos = subscription?.limits?.maxVideosPerMonth || 5;

  if (plan === "free" && videosGenerated >= maxVideos) {
    return res.status(403).json({
      success: false,
      message: "Free plan limit reached. Upgrade to continue."
    });
  }

  next();
};

module.exports = subscriptionCheck;
