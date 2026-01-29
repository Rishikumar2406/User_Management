const User = require("../models/User");
const exportToCsv = require("../utils/exportCsv");

// CREATE
exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// READ (Pagination + Search)
exports.getUsers = async (req, res) => {
  const { page = 1, limit = 5, search = "" } = req.query;

  const query = {
    $or: [
      { firstName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } }
    ]
  };

  const users = await User.find(query)
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const count = await User.countDocuments(query);

  res.json({
    users,
    totalPages: Math.ceil(count / limit),
    currentPage: page
  });
};

// READ SINGLE
exports.getUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
};

// UPDATE
exports.updateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(user);
};

// DELETE
exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
};

// EXPORT CSV
exports.exportCsv = async (req, res) => {
  const users = await User.find();
  exportToCsv(res, users);
};
