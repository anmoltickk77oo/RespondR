const { z } = require('zod');

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is too short'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.string().optional(),
    team: z.string().optional(),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

const sosSchema = z.object({
  body: z.object({
    location: z.string().min(2, 'Location is too short'),
    incidentType: z.string().min(2, 'Incident type is required'),
    userDescription: z.string().optional(),
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
  sosSchema,
};
