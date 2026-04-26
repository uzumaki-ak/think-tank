import { uploadPicture } from "../middleware/uploadPictureMiddleware.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import { fileRemover } from "../utils/fileRemover.js";
import { v4 as uuidv4 } from "uuid";
import imagekit from "../utils/imagekit.js";
import { toFile } from "@imagekit/nodejs";
import VisitorLog from "../models/VisitorLog.js";
import axios from "axios";
import mongoose from "mongoose";
import PostCategories from "../models/PostCategories.js";



const createPost = async (req, res, next) => {
  try {
    const post = new Post({
      title: "sample title",
      caption: "sample caption",
      slug: uuidv4(),
      body: {
        type: "doc",
        content: [],
      },
      photo: "",
      user: req.user._id,
    });

    const createdPost = await post.save();
    return res.json(createdPost);
  } catch (error) {
    next(error);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });

    if (!post) {
      const error = new Error("post was not found");
      next(error);
      return;
    }

    const upload = uploadPicture.single("postPicture");

    const handleUpdatePostData = async (data) => {
      try {
        if (data) {
          const { title, caption, slug, body, tags, categories } =
            JSON.parse(data);

          // Process Categories: Create if new
          let categoryIds = [];
          if (categories && Array.isArray(categories)) {
            for (const cat of categories) {
              if (mongoose.Types.ObjectId.isValid(cat)) {
                categoryIds.push(cat);
              } else {
                // It's a new category title
                let existingCategory = await PostCategories.findOne({ title: cat });
                if (!existingCategory) {
                  existingCategory = await PostCategories.create({ title: cat });
                }
                categoryIds.push(existingCategory._id);
              }
            }
          }

          post.title = title || post.title;
          post.caption = caption || post.caption;
          post.slug = slug || post.slug;
          post.body = body || post.body;
          post.tags = tags || post.tags;
          post.categories = categoryIds.length > 0 ? categoryIds : post.categories;
          
          const updatedPost = await post.save();
          return res.json(updatedPost);
        } else {
          throw new Error("Update data is missing or undefined");
        }
      } catch (error) {
        next(error);
      }
    };

    upload(req, res, async function (err) {
      if (err) {
        const error = new Error(
          "An unknown error occured when uploading " + err.message
        );
        next(error);
      } else {
        // every thing went well
        if (req.file) {
          try {
            // Upload to ImageKit
            const ikResponse = await imagekit.files.upload({
              file: await toFile(req.file.buffer, req.file.originalname),
              fileName: `${Date.now()}-${req.file.originalname}`,
              folder: "/blog-posts",
            });

            let oldPhoto = post.photo;
            if (oldPhoto && !oldPhoto.startsWith("http")) {
              fileRemover(oldPhoto);
            }
            
            post.photo = ikResponse.url;
            handleUpdatePostData(req.body.document);
          } catch (uploadError) {
            next(uploadError);
          }
        } else {
          let oldPhoto = post.photo;
          post.photo = "";
          if (oldPhoto && !oldPhoto.startsWith("http")) {
            fileRemover(oldPhoto);
          }
          handleUpdatePostData(req.body.document);
        }
      }
    });

  } catch (error) {
    next(error);
  }
};

// deleting post

const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findOneAndUpdate(
      { slug: req.params.slug },
      { isDeleted: true },
      { new: true }
    );
    if (!post) {
      const error = new Error("post was not found");
      return next(error);
    }

    return res.json({
      message: "Post moved to Archive / Recycle Bin",
    });
  } catch (error) {
    next(error);
  }
};

const restorePost = async (req, res, next) => {
  try {
    const post = await Post.findOneAndUpdate(
      { slug: req.params.slug },
      { isDeleted: false },
      { new: true }
    );
    if (!post) {
      const error = new Error("post was not found");
      return next(error);
    }

    return res.json({
      message: "Post restored from Archive",
    });
  } catch (error) {
    next(error);
  }
};

const hardDeletePost = async (req, res, next) => {
  try {
    const post = await Post.findOneAndDelete({ slug: req.params.slug });
    if (!post) {
      const error = new Error("post was not found");
      return next(error);
    }

    if (post.photo && !post.photo.startsWith("http")) {
      fileRemover(post.photo);
    }

    await Comment.deleteMany({ post: post._id });

    return res.json({
      message: "Post permanently expunged from database",
    });
  } catch (error) {
    next(error);
  }
};

const getPost = async (req, res, next) => {
  try {
    const post = await Post.findOneAndUpdate(
      { slug: req.params.slug, isDeleted: false },
      { $inc: { views: 1 } },
      { new: true }
    ).populate([
      {
        path: "user",
        select: ["avatar", "name"],
      },
      {
        path: "categories",
        select: ["title"],
      },
      {
        path: "comments",
        match: {
          check: true,
          parent: null,
        },
        populate: [
          {
            path: "user",
            select: ["avatar", "name"],
          },
          {
            path: "replies",
            match: {
              check: true,
            },
            populate: [
              {
                path: "user",
                select: ["avatar", "name"],
              },
            ],
          },
        ],
      },
    ]);

    if (!post) {
      const error = new Error("post was not found");
      return next(error);
    }

    // Dynamic Analytics Protocol: Log Visit
    const logVisit = async () => {
      try {
        const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress || "127.0.0.1";
        
        let locationData = { country: "Unknown", countryCode: "XX", city: "Unknown" };
        try {
          // Use http instead of https if needed for free tier, or handle errors
          const response = await axios.get(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,city`);
          if (response.data.status === "success") {
            locationData = {
              country: response.data.country,
              countryCode: response.data.countryCode,
              city: response.data.city,
            };
          }
        } catch (e) {}

        await VisitorLog.create({
          post: post._id,
          ip,
          ...locationData,
        });
      } catch (e) {}
    };
    logVisit();

    return res.json(post);
  } catch (error) {
    next(error);
  }
};

const getAllPosts = async (req, res, next) => {
  try {
    const filter = req.query.searchKeyboard;
    const showDeleted = req.query.deleted === "true";

    const categories = req.query.categories
      ? req.query.categories.split(",")
      : [];

    let where = { isDeleted: showDeleted };

    if (filter) {
      where.title = { $regex: filter, $options: "i" };
    }
    if (categories.length > 0) {
      where.categories = { $in: categories };
    }

    let query = Post.find(where);
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * pageSize;
    const total = await Post.find(where).countDocuments();
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
      .populate([
        {
          path: "user",
          select: ["avatar", "name", "verified"],
        },
        {
          path: "categories",
          select: ["title"],
        },
      ])
      .sort({ updatedAt: "desc" });

    return res.json(result);
  } catch (error) {
    next(error);
  }
};

const getAnalytics = async (req, res, next) => {
  try {
    // 1. Dynamic Geographical Data: Top 5 Countries
    const topCountries = await VisitorLog.aggregate([
      { $group: { _id: "$country", count: { $sum: 1 }, code: { $first: "$countryCode" } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // 2. Engagement Flow (Last 7 Days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const engagementFlow = await VisitorLog.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // 3. System Metrics
    const totalVisits = await VisitorLog.countDocuments();
    const uniqueIps = await VisitorLog.distinct("ip");

    return res.json({
      topCountries,
      engagementFlow,
      metrics: {
        totalVisits,
        uniqueIps: uniqueIps.length,
      }
    });
  } catch (error) {
    next(error);
  }
};

export { createPost, updatePost, deletePost, getPost, getAllPosts, restorePost, hardDeletePost, getAnalytics };
