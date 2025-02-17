//* Exporting all the constants used in the application

// Name of the database
export const DB_NAME = "blogHorizon";

// Categories for the blog
// TODO : Add more category
export const BLOG_CATEGORY = [
  "Technology",
  "Business",
  "Health",
  "Entertainment",
  "Science",
  "Sports",
  "Education",
  "Lifestyle",
  "Travel",
  "Food & Cooking",
  "Finance & Investing",
  "Parenting",
  "Relationships & Dating",
  "Personal Development",
  "Career & Jobs",
  "Fashion & Beauty",
  "Environment & Sustainability",
  "Photography",
  "Gaming",
  "History",
  "Psychology & Mental Health",
  "DIY & Crafts",
  "Automobiles & Vehicles",
];

export const COOKIE_CONFIG = {
  httpOnly: true,
  sameSite: true,
  secure: process.env.NODE_ENV === "production",
  maxAge: 1000 * 60 * 60 * 24 * 15, // 15 days
};
