import Joi from "joi";

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Email tidak valid",
    "any.required": "Email wajib diisi",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password minimal 6 karakter",
    "any.required": "Password wajib diisi",
  }),
});

export const registerSchema = Joi.object({
  nama: Joi.string().min(3).required().messages({
    "string.min": "Nama minimal 3 karakter",
    "any.required": "Nama wajib diisi",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Email tidak valid",
    "any.required": "Email wajib diisi",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password minimal 6 karakter",
    "any.required": "Password wajib diisi",
  }),
  phone: Joi.string().optional(),
});

export const alatSchema = Joi.object({
  nama: Joi.string().required().messages({
    "any.required": "Nama alat wajib diisi",
  }),
  deskripsi: Joi.string().optional(),
  harga_per_hari: Joi.number().positive().required().messages({
    "number.positive": "Harga harus angka positif",
    "any.required": "Harga wajib diisi",
  }),
  kategori: Joi.string().required().messages({
    "any.required": "Kategori wajib diisi",
  }),
  stok: Joi.number().integer().min(0).required().messages({
    "number.integer": "Stok harus angka bulat",
    "any.required": "Stok wajib diisi",
  }),
});

export const penyewaSchema = Joi.object({
  nama: Joi.string().required().messages({
    "any.required": "Nama wajib diisi",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Email tidak valid",
    "any.required": "Email wajib diisi",
  }),
  nomor_telepon: Joi.string().required().messages({
    "any.required": "Nomor telepon wajib diisi",
  }),
  alamat: Joi.string().optional(),
});

export const transaksiSchema = Joi.object({
  penyewa_id: Joi.number().positive().required().messages({
    "any.required": "Penyewa ID wajib diisi",
  }),
  alat_id: Joi.number().positive().required().messages({
    "any.required": "Alat ID wajib diisi",
  }),
  tanggal_mulai: Joi.date().iso().required().messages({
    "any.required": "Tanggal mulai wajib diisi",
  }),
  tanggal_selesai: Joi.date()
    .iso()
    .required()
    .greater(Joi.ref("tanggal_mulai"))
    .messages({
      "date.greater": "Tanggal selesai harus lebih besar dari tanggal mulai",
      "any.required": "Tanggal selesai wajib diisi",
    }),
  jumlah_hari: Joi.number().positive().required().messages({
    "any.required": "Jumlah hari wajib diisi",
  }),
  total_harga: Joi.number().positive().required().messages({
    "any.required": "Total harga wajib diisi",
  }),
  status: Joi.string()
    .valid("pending", "active", "completed", "cancelled")
    .default("pending"),
});

export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        message: "Validasi gagal",
        errors: messages,
      });
    }

    req.body = value;
    next();
  };
};
