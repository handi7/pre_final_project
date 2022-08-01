const multer = require("multer");
const fs = require("fs");
const path = require("path");

module.exports = {
  uploader: (dir, fileNamePrefix) => {
    // lokasi penyimpanan
    let defaultDir = "./public";

    // disk storage : menyimpan file dr FE ke direktori BE
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        const pathDir = defaultDir + dir;
        if (fs.existsSync(pathDir)) {
          cb(null, pathDir);
        } else {
          fs.mkdir(pathDir, { recursive: true }, (err) => cb(err, pathDir));
        }
      },

      filename: (req, file, cb) => {
        cb(
          null,
          fileNamePrefix + "-" + Date.now() + path.extname(file.originalname)
        );
      },
    });

    // const fileFilter = (req, file, cb) => {
    //   const ext = /\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)/;

    //   if (!file.originalname.match(ext)) {
    //     return cb(new Error("Your file type denide", false));
    //   }
    //   cb(null, true);
    // };

    return multer({
      storage,
      // fileFilter,
    });
  },
};
