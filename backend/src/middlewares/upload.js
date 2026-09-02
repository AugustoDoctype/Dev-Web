import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Aponta para a pasta que criamos na raiz do projeto
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    // Pega a extensão original (.jpg, .png) e junta com a data atual em milissegundos
    const extensao = path.extname(file.originalname);
    cb(null, Date.now() + extensao); 
  }
});

export const upload = multer({ storage });