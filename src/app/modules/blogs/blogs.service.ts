import { Iblog } from "./blogs.interface";
import { Blogs } from "./blogs.mode";

const createBlog = async (payload: Iblog) => {
  const BaseSlug = payload.title.toLowerCase().split(" ").join("-");
  let slug = `${BaseSlug}`;
  const existingBlog = await Blogs.findOne({ where: { title: payload.title } });
  if (existingBlog) {
    throw new Error("Blog with this slug already exists");
  }
  let count = 0;
  while (await Blogs.exists({ slug })) {
    count++;
    slug = `${BaseSlug}-blog-${count}`;
  }
  payload.slug = slug;
  const blog = Blogs.create(payload);
  return blog;
};

const updateBlogs = async (id: string, payload: Partial<Iblog>) => {
  const blog = await Blogs.findById(id);
  if (!blog) {
    throw new Error("Blog not found");
  }

  await Blogs.findByIdAndUpdate(id, payload, { new: true });
  return Blogs.findById(id);
};

const getAllBlogs = async ({ page = 1, limit = 10 }) => {
  
 

  const skip = (page - 1) * limit;

  const [totalBlogs, blogs] = await Promise.all([
    Blogs.countDocuments(),
    Blogs.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
  ]);

  return {
    meta: {
      total: totalBlogs,
      page: page,
      totalPages: Math.ceil(totalBlogs / limit),
    },
    blogs,
  };
};

const getSingleBlog = async (slug: string) => {
  const blog = await Blogs.findOne({ where: { slug } });
  if (!blog) {
    throw new Error("Blog not found");
  }
  return blog;
};

const deleteBlogs = async (id: string) => {
  const blog = await Blogs.findOne({ where: { id } });
  if (!blog) {
    throw new Error("Blog not found");
  }
  await Blogs.deleteOne({ where: { id } });
  return blog;
};

export const BlogService = {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  deleteBlogs,
  updateBlogs,
};
