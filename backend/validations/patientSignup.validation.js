const { z } = require("zod");
//
const patientSignupSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  gender: z.string(),
  password: z.string().min(6),
  mobile: z.string().min(10),
  address: z.string(),
});
//
module.exports = patientSignupSchema;
