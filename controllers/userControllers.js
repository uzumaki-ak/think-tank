import { uploadPicture } from "../middleware/uploadPictureMiddleware.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js";
import Post from "../models/Post.js";
import { fileRemover } from "../utils/fileRemover.js";
import imagekit from "../utils/imagekit.js";
import { toFile } from "@imagekit/nodejs";



const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      // return res.status(400).json({message: "User already registered"})
      throw new Error("User already registered");
    }

    // create new user
    user = await User.create({
      name,
      email,
      password,
    });

    return res.status(201).json({
      _id: user._id,
      avatar: user.avatar,
      name: user.name,
      email: user.email,
      verified: user.verified,
      admin: user.admin,
      token: await user.generateJWT(),
    });
  } catch (error) {
    next(error);
    // return res.status(500).json({message: "something went wrong !"});
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      throw new Error("Email not found");
    }
    if (await user.comparePassword(password)) {
      return res.status(201).json({
        _id: user._id,
        avatar: user.avatar,
        name: user.name,
        email: user.email,
        verified: user.verified,
        admin: user.admin,
        token: await user.generateJWT(),
      });
    } else {
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    next(error);
  }
};

const userProfile = async (req, res, next) => {
  try {
    let user = await User.findById(req.user._id);

    if (user) {
      return res.status(201).json({
        _id: user._id,
        avatar: user.avatar,
        name: user.name,
        email: user.email,
        verified: user.verified,
        admin: user.admin,
      });
    } else {
      let error = new Error("User Not Found");
      error.statusCode = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {

    const userIdToUpdate = req.params.userId;

    let userId = req.user._id;

    if (!req.user.admin && userId !== userIdToUpdate) {
      let error = new Error("Unauthorized to update this user");
      error.statusCode = 403;
      throw error;
    }

    let user = await User.findById(userIdToUpdate);

    if (!user) {
      throw new Error("User not found");
    }

    if(typeof req.body.admin !== "undefined" && req.user.admin) {
      user.admin = req.body.admin;
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.gender = req.body.gender || user.gender;
    if (req.body.password && req.body.password.length < 6) {
      throw new Error("Password must be at least 6 characters ");
    } else if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUserProfile = await user.save();

    res.json({
      avatar: updatedUserProfile.avatar,
      name: updatedUserProfile.name,
      _id: updatedUserProfile._id,
      email: updatedUserProfile.email,
      verified: updatedUserProfile.verified,
      admin: updatedUserProfile.admin,
      gender: updatedUserProfile.gender,
      bookmarks: updatedUserProfile.bookmarks,
      token: await updatedUserProfile.generateJWT(),
    });
  } catch (error) {
    next(error);
  }
};

const updateBookmark = async (req, res, next) => {
  try {
    const { postId } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      throw new Error("User not found");
    }

    const index = user.bookmarks.indexOf(postId);
    if (index === -1) {
      user.bookmarks.push(postId);
    } else {
      user.bookmarks.splice(index, 1);
    }

    await user.save();
    return res.json(user.bookmarks);
  } catch (error) {
    next(error);
  }
};

const getBookmarkedPosts = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "bookmarks",
      populate: [
        { path: "user", select: ["avatar", "name"] },
        { path: "categories", select: ["title"] }
      ]
    });

    if (!user) {
      throw new Error("User not found");
    }

    return res.json(user.bookmarks);
  } catch (error) {
    next(error);
  }
};

const updateProfilePicture = async (req, res, next) => {
  try {
    const upload = uploadPicture.single("profilePicture");

    upload(req, res, async function (err) {
      if (err) {
        const error = new Error("Error uploading profile picture");
        next(error);
      } else {
        //every thing went well
        if (req.file) {
          try {
            const ikResponse = await imagekit.files.upload({
              file: await toFile(req.file.buffer, req.file.originalname),
              fileName: `${Date.now()}-${req.file.originalname}`,
              folder: "/avatars",
            });

            let updatedUser = await User.findById(req.user._id);
            let oldAvatar = updatedUser.avatar;
            if (oldAvatar && !oldAvatar.startsWith("http")) {
              fileRemover(oldAvatar);
            }

            updatedUser.avatar = ikResponse.url;
            await updatedUser.save();
            res.json({
              avatar: updatedUser.avatar,
              name: updatedUser.name,
              _id: updatedUser._id,
              email: updatedUser.email,
              verified: updatedUser.verified,
              admin: updatedUser.admin,
              token: await updatedUser.generateJWT(),
            });
          } catch (uploadError) {
            next(uploadError);
          }
        } else {
          let updatedUser = await User.findById(req.user._id);
          let oldAvatar = updatedUser.avatar;
          updatedUser.avatar = "";
          await updatedUser.save();
          if (oldAvatar && !oldAvatar.startsWith("http")) {
            fileRemover(oldAvatar);
          }
          res.json({
            avatar: updatedUser.avatar,
            name: updatedUser.name,
            _id: updatedUser._id,
            email: updatedUser.email,
            verified: updatedUser.verified,
            admin: updatedUser.admin,
            token: await updatedUser.generateJWT(),
          });
        }
      }
    });

  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const filter = req.query.searchKeyboard;
    let where = {};
    if (filter) {
      where.email = { $regex: filter, $options: "i" };
    }
    let query = User.find(where);
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * pageSize;
    const total = await User.find(where).countDocuments();
    const pages = Math.ceil(total / pageSize);

    res.header({
      "x-filter": filter,
      "x-totalcount": JSON.stringify(total),
      "x-currentpage": JSON.stringify(page),
      "x-pagesize": JSON.stringify(pageSize),
      "x-totalpagecount": JSON.stringify(pages),
    });

    if (page > pages) {
      return res.json([]);
    }

    const result = await query
      .skip(skip)
      .limit(pageSize)

      .sort({ updatedAt: "desc" });

    return res.json(result);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    let user = await User.findById(req.params.userId);

    if (!user) {
      throw new Error("User not found");
    }

    const postsToDelete = await Post.find({ user: user._id });
    const postIdsToDelete = postsToDelete.map((post) => post._id);

    await Comment.deleteMany({
      post: { $in: postIdsToDelete },
    });

    await Post.deleteMany({
      _id: { $in: postIdsToDelete },
    });


    postsToDelete.forEach((post) => {
      fileRemover(post.photo);
    })

    await User.deleteOne({ _id: user._id });
    if (user.avatar && !user.avatar.startsWith("http")) {
      fileRemover(user.avatar);
    }


    res.status(204).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export {
  registerUser,
  loginUser,
  userProfile,
  updateProfile,
  updateProfilePicture,
  getAllUsers,
  deleteUser,
  updateBookmark,
  getBookmarkedPosts,
};
