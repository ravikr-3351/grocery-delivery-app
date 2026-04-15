const Order = require('../models/Order');
const User = require('../models/User');

const ACTIVE_DELIVERY_STATUSES = ['Pending', 'Confirmed', 'Shipped'];
const ASSIGNABLE_UNASSIGNED_STATUSES = ['Pending', 'Confirmed'];

const getRiderLoadSnapshot = async () => {
  const riders = await User.find({ role: 'rider' })
    .select('_id')
    .sort({ createdAt: 1 });

  if (!riders.length) {
    return { riders: [], loadMap: new Map() };
  }

  const riderIds = riders.map((rider) => rider._id);
  const loadByRider = await Order.aggregate([
    {
      $match: {
        rider: { $in: riderIds },
        status: { $in: ACTIVE_DELIVERY_STATUSES },
      },
    },
    {
      $group: {
        _id: '$rider',
        activeOrders: { $sum: 1 },
        lastAssignedAt: { $max: '$createdAt' },
      },
    },
  ]);

  const loadMap = new Map(
    loadByRider.map((entry) => [
      entry._id.toString(),
      {
        activeOrders: entry.activeOrders,
        lastAssignedAt: entry.lastAssignedAt || new Date(0),
      },
    ])
  );

  return { riders, loadMap };
};

const pickLeastLoadedRider = (riders, loadMap) => {
  if (!riders.length) return null;

  const sortedRiders = [...riders].sort((a, b) => {
    const aLoad = loadMap.get(a._id.toString()) || { activeOrders: 0, lastAssignedAt: new Date(0) };
    const bLoad = loadMap.get(b._id.toString()) || { activeOrders: 0, lastAssignedAt: new Date(0) };

    if (aLoad.activeOrders !== bLoad.activeOrders) {
      return aLoad.activeOrders - bLoad.activeOrders;
    }

    return aLoad.lastAssignedAt - bLoad.lastAssignedAt;
  });

  return sortedRiders[0];
};

const markRiderLoad = (loadMap, riderId) => {
  const key = riderId.toString();
  const current = loadMap.get(key) || { activeOrders: 0, lastAssignedAt: new Date(0) };
  loadMap.set(key, {
    activeOrders: current.activeOrders + 1,
    lastAssignedAt: new Date(),
  });
};

const getAutoAssignedRider = async () => {
  const { riders, loadMap } = await getRiderLoadSnapshot();
  return pickLeastLoadedRider(riders, loadMap);
};

// Backfill older unassigned orders so riders always see a consistent queue.
const backfillUnassignedOrders = async (limit = 50) => {
  const { riders, loadMap } = await getRiderLoadSnapshot();
  if (!riders.length) return 0;

  const unassignedOrders = await Order.find({
    status: { $in: ASSIGNABLE_UNASSIGNED_STATUSES },
    $or: [
      { rider: null },
      { rider: { $nin: riders.map((rider) => rider._id) } },
    ],
  })
    .sort({ createdAt: 1 })
    .limit(limit)
    .select('_id');

  let assignedCount = 0;

  for (const order of unassignedOrders) {
    const rider = pickLeastLoadedRider(riders, loadMap);
    if (!rider) break;

    await Order.findByIdAndUpdate(order._id, {
      rider: rider._id,
      status: 'Confirmed',
    });

    markRiderLoad(loadMap, rider._id);
    assignedCount += 1;
  }

  return assignedCount;
};

module.exports = {
  getAutoAssignedRider,
  backfillUnassignedOrders,
};
