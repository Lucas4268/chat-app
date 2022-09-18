const { response } = require("express");
const formidable = require("formidable");
const cloudinary = require('cloudinary').v2

cloudinary.config( process.env.CLOUDINARY_URL || '' );

const saveFile = async( file ) => {
  const { secure_url } = await cloudinary.uploader.upload( file.filepath, {folder: 'chatapp', transformation:{quality: 30}} );
  return secure_url;
};

const parseFiles = async(req) => {
  return new Promise((resolve, reject) => {

    const form = new formidable.IncomingForm();
    form.parse( req, async( err, fields, files ) => {
      if ( err ) {
        console.log({err})
        return reject( err);
      }

      const filePath = await saveFile( files.file );
      resolve( filePath );
    })
  })
};

const uploadImage = async( req, res = response ) => {
  const imageUrl = await parseFiles( req );
  

  return res.status(200).json({ img: imageUrl });
} 

module.exports = uploadImage