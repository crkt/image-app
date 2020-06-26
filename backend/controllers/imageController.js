const multer = require("multer");
const ImageMetadata = require("../models/ImageMetadataModel");
const sharp = require("sharp");

const IMG_DIRECTORY_PATH = "public/img";

// Use memory storage to access the file.buffer api and pass it to `sharp`
const multerStorage = multer.memoryStorage();

/**
 * Using the multers fileFilter to set what is allowed to upload to this web server.
 * See: https://github.com/expressjs/multer
 */
function fileFilter(req, file, cb) {
  if (!file.originalname.match(/\.(jpeg|png)$/)) {
    return cb(new Error("Must pass a photo of file type: .jpeg or .png"))
  }
  return cb(null, true);
}

/**
 * Formats the filename of the photo to the following:
 * Only use the first 10 chars
 * ÅÄÖ becomes A or O
 * Spaces are replaced with dashes
 *
 * This function will also lowercase the name for
 * making the matching of chars easier.
 * @param {String} name
 */
function fileName(name) {
  let short = name.substring(0,10)
    .replace(/ /g, "-")
    .toLowerCase()
    .replace(/å|ä/g, "a")
    .replace(/ö/g, "o")

  let date = new Date();
  return short + "_" +
    date.getFullYear() +
    "0" + date.getMonth() +
    date.getDate() +
    date.getHours() +
    date.getMinutes() +
    date.getSeconds()
 }

 /**
  * Return an image name with the provided extension
  * Uses split on the mimetype of the file, e.g `image/jpeg`
  * @param {multer.file} file
  * @param {String} name
  */
 function fileNameWithExtension(file, name) {
   return `${fileName(name)}.${file.mimetype.split("/")[1]}`
 }

 /**
  * A Complete path for a file and image
  * This is used when saving the image at a specifc path
  *
  * See const IMG_DIRECTORY_PATH as the prefix for the image name
  * @param {multer.file} file
  * @param {String} name
  */
 function imagePath(file, name) {
   return IMG_DIRECTORY_PATH + "/" + fileNameWithExtension(file, name)
 }

const upload = multer({
  storage: multerStorage,
  fileFilter: fileFilter
});

/**
 * Resize the images provided using the `sharp` library
 * This function is also responsible for saving the image
 * under the correct path. See `imagePath` function
 */
exports.resizeImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }
  const file = req.file;
  const name = req.body.name;

  await sharp(file.buffer)
    .resize(400,400)
    .toFile(imagePath(file, name))

  next();
}

exports.getAllImages = async (req, res, next) => {
  const data = await ImageMetadata.find();

  return res.status(200).json({
    status: "success",
    data: data,
  });
};

exports.uploadImage = upload.single("photo");

exports.createImageMetadata = async (req, res, next) => {
  let name = fileName(req.body.name)
  const doc = await ImageMetadata.create({
    name: name,
    path: `/img/${req.file.filename}`,
  });

  if (!doc) {
    return res.status(400).json({
      status: "fail",
      message: "invalid input",
    });
  }

  return res.status(201).json({
    status: "success",
    data: {
      data: doc,
    },
  });
};
