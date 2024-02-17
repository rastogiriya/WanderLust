//require database and category model
require("../model/database");
const Category = require("../model/Category");
const Blog = require("../model/Blog");

/*
 * GET /
 * homePage
 */
exports.homePage = async (req, res) => {
  try {
    const limitNumber = 5;
    const categories = await Category.find({}).limit(limitNumber);
    const latest = await Blog.find({}).sort({ _id: -1 }).limit(limitNumber);
    const indian = await Blog.find({ category: "India" }).limit(limitNumber);
    const italian = await Blog.find({ category: "Italy" }).limit(limitNumber);
    const japanese = await Blog.find({ category: "Japan" }).limit(limitNumber);

    const travelBlogs = { latest, indian, italian, japanese };

    res.render("index", {
      title: "Travelling Blog - Home",
      categories,
      travelBlogs,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

/*
 * GET /categories
 * Categories
 */
exports.exploreCategories = async (req, res) => {
  try {
    const limitNumber = 20;
    const categories = await Category.find({}).limit(limitNumber);
    res.render("categories", { title: "travel Blog - Categories", categories });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

/*
 * GET /categories/:id
 * Categories By Id
 */
exports.exploreCategoriesById = async (req, res) => {
  try {
    let categoryId = req.params.id;
    const limitNumber = 20;
    const categoryById = await Blog.find({ category: categoryId }).limit(
      limitNumber
    );
    res.render("categories", {
      title: "Travel Blog - Categories",
      categoryById,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

/*
 * POST /search
 * Search
 */
exports.searchBlog = async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    let blog = await Blog.find({
      $text: { $search: searchTerm, $diacriticSensitive: true },
    });
    res.render("search", { title: "Travel Blog - Search", blog });
  } catch (error) {}
};

/*
 * GET /explore-latest
 * explore latest
 */
exports.exploreLatest = async (req, res) => {
  try {
    const limitNumber = 20;
    const blog = await Blog.find({}).sort({ _id: -1 }).limit(limitNumber);
    res.render("explore-latest", {
      title: "Travel Blog - Explore Latest",
      blog,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

/*
 * GET /explore-random
 * explore random
 */
exports.exploreRandom = async (req, res) => {
  try {
    const count = await Blog.find().countDocuments();
    const random = Math.floor(Math.random() * count);
    let blog = await Blog.findOne().skip(random).exec();
    res.render("explore-random", {
      title: "Travel Blog - Explore Latest",
      blog,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

/*
 * GET /blod/:id
 * Blog
 */
exports.exploreBlog = async (req, res) => {
  try {
    let blogId = req.params.id;
    const clickedBlog = await Blog.findById(blogId);
    res.render("blog", { title: "Travel Blog - Blog", clickedBlog });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

/*
 * GET /submit-blog
 * Submit page
 */
exports.submitBlog = async (req, res) => {
  const infoErrorObj = req.flash("infoError");
  const infoSubmitObj = req.flash("infoSubmit");
  res.render("submit-blog", {
    title: "Travel Blog - Submit Blog",
    infoErrorObj,
    infoSubmitObj,
  });
};

/*
 * Post /submit-blog
 * Submit page
 */
exports.submitBlogOnPost = async (req, res) => {
  try {
    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if (!req.files || Object.keys(req.files).length === 0) {
      console.log("No files were uploaded.");
    } else {
      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath =
        require("path").resolve("./") + "/public/uploads/" + newImageName;

      imageUploadFile.mv(uploadPath, function (err) {
        if (err) return res.status(500).send(err);
      });
    }

    const newBlog = new Blog({
      name: req.body.name,
      email: req.body.email,
      description: req.body.description,
      category: req.body.category,
      favouritefood: req.body.regionalFoods,
      image: newImageName,
    });

    await newBlog.save();

    req.flash("infoSubmit", "Blog has been added");
    res.redirect("/submit-blog");
  } catch (error) {
    req.flash("infoError", error);
    res.redirect("/submit-blog");
  }
};

//GET "/about"
//About page
exports.aboutPage = async (req, res) => {
  res.render("about", { title: "About TechFuse" });
};

//GET "/contact"
//Contact Page (Not fully made just a coming soon page.)
exports.contactPage = async (req, res) => {
  res.render("contact", { title: "Contact" });
};
