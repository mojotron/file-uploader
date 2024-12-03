import multer from "multer";

const fileFilterCallback = () => {};

const upload = multer({ dest: `./uploads` });

export default upload;
