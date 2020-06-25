const multer = require("multer");
const ImageMetadata = require("../models/ImageMetadataModel");

const IMG_DIRECTORY_PATH = "public/img";

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, IMG_DIRECTORY_PATH);
  },
  filename: (req, file, cb) => {
    const extension = file.mimetype.split("/")[1];
    cb(null, `${req.body.name}.${extension}`);
  },
});

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

function fileNamePath(name) {
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

const upload = multer({
  storage: multerStorage,
  fileFilter: fileFilter
});

exports.getAllImages = async (req, res, next) => {
  const data = await ImageMetadata.find();

  return res.status(200).json({
    status: "success",
    data: data,
  });
};

exports.uploadImage = upload.single("photo");

exports.createImageMetadata = async (req, res, next) => {
  let name = fileNamePath(req.body.name)
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
