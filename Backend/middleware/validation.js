const { body, param, query } = require("express-validator");

// Cinema validation rules
const validateCinema = [
    body('cinema_name')
        .trim()
        .notEmpty()
        .withMessage('Cinema name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Cinema name must be between 2 and 100 characters')
        .matches(/^[a-zA-Z0-9\s\-&.,()]+$/)
        .withMessage('Cinema name contains invalid characters'),

    body('cinema_location')
        .trim()
        .notEmpty()
        .withMessage('Cinema location is required')
        .isLength({ min: 5, max: 200 })
        .withMessage('Cinema location must be between 5 and 200 characters'),

    body('ongoing_movies.movie_1')
        .trim()
        .notEmpty()
        .withMessage('First ongoing movie is required')
        .isLength({ max: 100 })
        .withMessage('Movie name cannot exceed 100 characters'),

    body('ongoing_movies.movie_2')
        .trim()
        .notEmpty()
        .withMessage('Second ongoing movie is required')
        .isLength({ max: 100 })
        .withMessage('Movie name cannot exceed 100 characters'),

    body('ongoing_movies.movie_3')
        .trim()
        .notEmpty()
        .withMessage('Third ongoing movie is required')
        .isLength({ max: 100 })
        .withMessage('Movie name cannot exceed 100 characters'),

    body('ongoing_movies.movie_4')
        .trim()
        .notEmpty()
        .withMessage('Fourth ongoing movie is required')
        .isLength({ max: 100 })
        .withMessage('Movie name cannot exceed 100 characters'),

    body('upcoming_movie')
        .trim()
        .notEmpty()
        .withMessage('Upcoming movie is required')
        .isLength({ max: 100 })
        .withMessage('Movie name cannot exceed 100 characters'),

    body('contact_info.phone')
        .optional()
        .trim()
        .matches(/^[\+]?[1-9][\d]{0,15}$/)
        .withMessage('Please enter a valid phone number'),

    body('contact_info.email')
        .optional()
        .trim()
        .isEmail()
        .withMessage('Please enter a valid email address')
        .normalizeEmail(),

    body('is_active')
        .optional()
        .isBoolean()
        .withMessage('is_active must be a boolean value')
];

// Update validation rules (all fields optional)
const validateCinemaUpdate = [
    body('cinema_name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Cinema name must be between 2 and 100 characters')
        .matches(/^[a-zA-Z0-9\s\-&.,()]+$/)
        .withMessage('Cinema name contains invalid characters'),

    body('cinema_location')
        .optional()
        .trim()
        .isLength({ min: 5, max: 200 })
        .withMessage('Cinema location must be between 5 and 200 characters'),

    body('ongoing_movies.movie_1')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Movie name cannot exceed 100 characters'),

    body('ongoing_movies.movie_2')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Movie name cannot exceed 100 characters'),

    body('ongoing_movies.movie_3')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Movie name cannot exceed 100 characters'),

    body('ongoing_movies.movie_4')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Movie name cannot exceed 100 characters'),

    body('upcoming_movie')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Movie name cannot exceed 100 characters'),

    body('contact_info.phone')
        .optional()
        .trim()
        .matches(/^[\+]?[1-9][\d]{0,15}$/)
        .withMessage('Please enter a valid phone number'),

    body('contact_info.email')
        .optional()
        .trim()
        .isEmail()
        .withMessage('Please enter a valid email address')
        .normalizeEmail(),

    body('is_active')
        .optional()
        .isBoolean()
        .withMessage('is_active must be a boolean value')
];

// ID validation
const validateObjectId = [
    param('id')
        .isMongoId()
        .withMessage('Invalid cinema ID format')
];

// Query validation
const validateQuery = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),

    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),

    query('search')
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Search term must be between 1 and 100 characters'),

    query('is_active')
        .optional()
        .isBoolean()
        .withMessage('is_active must be a boolean value')
];

module.exports = {
    validateCinema,
    validateCinemaUpdate,
    validateObjectId,
    validateQuery
};
