const Subscriber = require('../models/Subscriber');
const Album = require('../models/Album');
const Artist = require('../models/Artist');

const getDashboardData = async (req, res) => {
  try {
    const [subscriberCount, releaseCount, artistCount] = await Promise.all([
      Subscriber.countDocuments(),
      Album.countDocuments(),
      Artist.countDocuments()
    ]);

    res.json({
      subscribers: subscriberCount,
      albums: releaseCount,
      artists: artistCount
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { getDashboardData };
